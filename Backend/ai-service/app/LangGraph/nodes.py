from LangGraph.state import State
from langchain.chat_models import init_chat_model
from app.services.mem import search_in_memory, add_memory
from app.models.chat_model import get_chat_history, conversations_collection, save_chat_to_db
from app.agents.select_intent_agent import get_user_intent
from app.agents.vision_agent import get_image_data
from app.rag.retrieve import get_vector_search_result
from app.services.internal_service import get_inventory
from app.agents.prompts import get_system_prompt
from app.api.socket_api import sio
from bson import ObjectId


llm = init_chat_model(
    model = "gemini-3-flash-preview",
    model_provider = "google_genai"
)


async def get_memory_node(state:State):
    memory = await search_in_memory(
        user_id = state["user_id"],
        user_query = state["user_input"]
    )

    return {**state, "memory_context":memory}

async def get_chat_history_node(state:State):
    conversation_id_str = state["conversation_id"]
    user_id = state["user_id"]
    user_message = state["user_input"]
    sid = state["sid"]

    if not conversation_id_str:
        new_conv = await conversations_collection.insert_one({
            "user_id": ObjectId(user_id), 
            "title": user_message[:30] + "..."}
        )

        conversation_id = new_conv.inserted_id

        await sio.emit("conversation_started", {
            "conversation_id": str(conversation_id)
            }, room=sid)
        
        return {**state, "conversation_history":None}
    
    else:

        history = await get_chat_history(
            conversation_id = conversation_id_str,
        )

        return {
            **state,
            "conversation_history":history
        }
    
async def add_chat_node(state:State):
    await save_chat_to_db(
        conversation_id = state["conversation_id"],
        user_message = state["user_input"],
        ai_result = state["response"]
    )

    return state

async def intent_classifier(state:State):
    user_input = state["user_input"]
    intent_dict = await get_user_intent(user_query = user_input)

    return {
        **state, 
        "intent":intent_dict["intent"],
        "confidence":intent_dict["confidence"]
    }

def planner(state:State):
    intent = state["intent"]

    if intent == "generate_recipe_from_inventory":
        return { **state, "action": "fetch_inventory" }
    
    elif intent == "generate_recipe_from_image":
        return {**state, "action": "get_image_data"}
    
    elif intent == "generate_recipe_from_pdf":
        return {**state, "action": "get_pdf_data"}
    
    # elif intent == "add_inventory":
    #     return {**state, "action": "update_inventory"}
    
    else:
        return {**state, "action": "generate_response"} 

def clarify_node(state:State):
    return {
        **state,
        "response": "Can you tell me what ingredients you have?"
    }
    
async def memory_write_node(state:State):
    await add_memory(
        user_id = state["user_id"],
        user_query = state["user_input"]
    )

    return state

async def image_data_node(state:State):
    image_url = state["image_url"]
    data = await get_image_data(image_url)

    return {
        **state,
        "image_data":data
    }

async def pdf_data_node(state:State):
    data = await get_vector_search_result(
        user_id = state["user_id"],
        user_query = state["user_input"],
        filename = state["file_name"]
    )

    return {**state, "pdf_data":data}

async def get_inventory_node(state:State):
    data = await get_inventory(user_id = state["user_id"])

    expiring_items = state["expiring_items"]

    for item_dict in data:
        if item_dict["isEstimatedExpiry"] == True:
            expiring_items.append(item_dict["item_name"])

    if data:
        return {
            **state,
            "inventory":data,
            "has_inventory":True
        }
    
    else:
        return {**state, "has_inventory":None}

    
async def generate_response(state:State):
    user_id = state["user_id"]

    system_prompt = get_system_prompt(
        state["user_input"],
        state["memory_context"],
        state["conversation_history"],
        state["inventory"],
        state["expiring_items"],
        state["image_data"],
        state["pdf_data"],
        state["is_direct_input"],
        state["has_inventory"]
    )

    response = await llm.invoke(system_prompt)

    return {**state, "response":response}

def formatter(state):
    return state
    



