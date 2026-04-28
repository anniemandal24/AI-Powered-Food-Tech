from app.models.chat_model import conversations_collection, messages_collection
from app.LangGraph.state import State
from app.LangGraph.graph import graph
from bson import ObjectId
import socketio
import jwt
import urllib.parse
import os

sio = socketio.AsyncServer(
    async_mode='asgi', 
    cors_allowed_origins='*'
)

JWT_SECRET = os.getenv("JWT_SECRET_KEY")

def serialize_mongo(doc):
    doc["_id"] = str(doc["_id"])
    if "user_id" in doc: doc["user_id"] = str(doc["user_id"])
    if "conversation_id" in doc: doc["conversation_id"] = str(doc["conversation_id"])
    if "created_at" in doc: doc["created_at"] = doc["created_at"].isoformat()
    if "updated_at" in doc: doc["updated_at"] = doc["updated_at"].isoformat()
    return doc

@sio.on("connect")
async def connect(sid, environ, auth):
    token = auth.get("token") if auth else None

    if not token:
        query_string = environ.get("QUERY_STRING", "")
        parsed_params = urllib.parse.parse_qs(query_string)
        if "token" in parsed_params:
            token = parsed_params["token"][0]
    
    try:
        payload = jwt.decode(token, JWT_SECRET, ["HS256"])
        await sio.save_session(sid, {
            "user_id": payload.get("_id")
        })

        print("Auth-handshake done")

    except Exception:
        raise socketio.exceptions.ConnectionRefusedError("Invalid token")
    

@sio.on("fetch_conversations")
async def fetch_conversations(sid):
    session = await sio.get_session(sid)

    if not session:
        raise socketio.exceptions.ConnectionRefusedError("Unauthorized")

    try:
        print(session)
        cursor = conversations_collection.find({
            "user_id": ObjectId(session["user_id"])
        }).sort("updated_at", -1)

        conversations = await cursor.to_list(length=50)
        await sio.emit("conversations_list", {
            "conversations": [serialize_mongo(c) for c in conversations]
        }, room=sid)

    except Exception as e:
        print(f"Error in fetch_conversations: {e}")
        raise socketio.exceptions.ConnectionRefusedError("Internal Server Error in fetch_conversations")


@sio.on("fetch_messages")
async def fetch_messages(sid, data):
    cursor = messages_collection.find({
        "conversation_id": ObjectId(data["conversation_id"])
    }).sort("created_at", 1)

    messages = await cursor.to_list(length=100)
    await sio.emit("messages_list", {
        "messages": [serialize_mongo(m) for m in messages]
    }, room=sid)


@sio.on("ask_ai")
async def ask_ai_handler(sid, data):
    try:

        if not sid:
            return await sio.emit("ai_error", {
                "error": "No sid provided"
            }, room=sid)

        if not data:
            return await sio.emit("ai_error", {
                "error": "No data provided"
            }, room=sid)

        session = await sio.get_session(sid)

        if not data.get("message"): 
            return await sio.emit("ai_error", {
                "error": "No message provided"
            }, room=sid)
        
        initial_state = State(
            sid = sid,
            user_id = session.get("user_id"),
            user_input = data.get("message"),
            image_url = data.get("url"),
            file_name = data.get("filename"),
            conversation_id = data.get("conversation_id")
        )

        config = {
            "configurable": {
                "thread_id": "Rounak"
            }
        }

        response_state = await graph.invoke(initial_state,config = config)
        response = response_state["response"]

        await sio.emit("ai_complete", {
                "done": "true",
                "response": response
            }, room=sid
        )

    except Exception as e:
        print(f"Master Loop Error: {e}")
        await sio.emit("ai_error", {
            "error": "An error occurred while processing your request."
        }, room=sid)
