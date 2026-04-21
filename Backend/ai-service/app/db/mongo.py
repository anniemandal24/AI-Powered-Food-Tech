import os
from typing import Any
from datetime import datetime,timezone
from bson import ObjectId
from app.models.chat_model import MessageSchema
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URI")
mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client.get_database()

print("connected to mongoDB")

# Collections
conversations_collection = db.get_collection("conversations")
messages_collection = db.get_collection("messages")


async def save_chat_to_db(conversation_id:str,user_message:str,ai_result):
    conv_obj_id = ObjectId(conversation_id)

    user_msg_val = MessageSchema(
        conversation_id = conversation_id, 
        sender = "user", 
        content = user_message,
        created_at = datetime.now(timezone.utc)
    )
    
    ai_msg_val = MessageSchema(
        conversation_id = conversation_id, 
        sender = "ai", 
        content = ai_result,
        created_at = datetime.now(timezone.utc)
    )

    docs_to_insert = [
        user_msg_val.model_dump(), 
        ai_msg_val.model_dump()
    ]

    for doc in docs_to_insert:
        doc["conversation_id"] = conv_obj_id

    await messages_collection.insert_many(docs_to_insert)

    await conversations_collection.update_one(
        {"_id": conv_obj_id},
        {"$set": {"updated_at": datetime.now(timezone.utc)}}
    )
    
    return True


async def get_chat_history(conversation_id:Any|ObjectId):
    cursor = await messages_collection.find({
        "conversation_id": conversation_id
    }).sort("created_at", -1).limit(6)

    recent = await cursor.to_list(length=6)
    recent.reverse()
    return "\n".join([f"{'User' if m['sender']=='user' else 'AI'}: {m['content']}" for m in recent])