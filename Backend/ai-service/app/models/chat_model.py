from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Literal
from bson import ObjectId
from app.db.mongo import db

def utc_now():
    return datetime.now(timezone.utc)

class ConversationSchema(BaseModel):
    user_id: str 
    title: str
    updated_at: datetime = Field(default_factory=utc_now)

class MessageSchema(BaseModel):
    conversation_id: str
    sender: Literal["user", "ai"] 
    content: str
    created_at: datetime = Field(default_factory=utc_now)


# Collections
conversations_collection = db.get_collection("conversations")
messages_collection = db.get_collection("messages")


async def save_chat_to_db(conversation_id:str,user_message:str,ai_result):
    conv_obj_id = ObjectId(conversation_id)

    user_msg_val = MessageSchema(
        conversation_id = str(conversation_id), 
        sender = "user", 
        content = user_message,
        created_at = datetime.now(timezone.utc)
    )
    
    ai_msg_val = MessageSchema(
        conversation_id = str(conversation_id), 
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


async def get_chat_history(conversation_id:str):
    conv_obj_id = ObjectId(conversation_id)

    cursor = messages_collection.find({
        "conversation_id": conv_obj_id
    }).sort("created_at", -1).limit(6)

    recent = await cursor.to_list(length=6)
    recent.reverse()
    return "\n".join([f"{'User' if m['sender']=='user' else 'AI'}: {m['content']}" for m in recent])


async def create_new_conversation(user_id:str, user_message:str):
    new_conv = await conversations_collection.insert_one({
            "user_id": ObjectId(user_id), 
            "title": user_message[:30] + "..."}
        )

    return new_conv.inserted_id