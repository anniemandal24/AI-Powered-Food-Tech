from app.main import sio
from app.db.mongo import conversations_collection, messages_collection
from bson import ObjectId
import socketio
import jwt
import os

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
    if not auth or "token" not in auth:
        raise socketio.exceptions.ConnectionRefusedError("No token")
    
    try:
        payload = jwt.decode(auth["token"], JWT_SECRET)
        await sio.save_session(sid, {
            "user_id": payload.get("_id")
        })

        print("Auth-handshake done")

    except Exception:
        raise socketio.exceptions.ConnectionRefusedError("Invalid token")
    

@sio.on("fetch_conversations")
async def fetch_conversations(sid):
    session = await sio.get_session(sid)

    cursor = conversations_collection.find({
        "user_id": ObjectId(session["user_id"])
    }).sort("updated_at", -1)

    conversations = await cursor.to_list(length=50)
    await sio.emit("conversations_list", {
        "conversations": [serialize_mongo(c) for c in conversations]
    }, room=sid)


@sio.on("fetch_messages")
async def fetch_messages(sid, data):
    cursor = messages_collection.find({
        "conversation_id": ObjectId(data["conversation_id"])
    }).sort("created_at", 1)

    messages = await cursor.to_list(length=100)
    await sio.emit("messages_list", {
        "messages": [serialize_mongo(m) for m in messages]
    }, room=sid)

