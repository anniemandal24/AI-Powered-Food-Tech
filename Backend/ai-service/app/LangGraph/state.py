from typing import TypedDict,Optional, Dict, List

class State(TypedDict):
    user_input:str
    user_id:str
    sid:str
    conversation_id:str

    conversation_history: Optional[Dict]
    memory_context:Optional[Dict]

    intent:Optional[Dict]
    confidence:Optional[float]
    is_direct_input:Optional[bool]

    image_url:Optional[str]
    file_name:Optional[str]
    family_members:Optional[Dict]

    image_data:Optional[str]
    pdf_data:Optional[List[dict]]

    inventory:Optional[List[dict]]
    has_inventory:Optional[bool]
    expiring_items:Optional[List[str]]

    action:Optional[str]
    response:Optional[str] 


