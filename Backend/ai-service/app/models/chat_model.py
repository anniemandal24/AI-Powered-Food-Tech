from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Literal

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