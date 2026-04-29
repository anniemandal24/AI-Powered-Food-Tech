from langchain.chat_models import init_chat_model
from app.services.mem import search_in_memory, add_memory
from app.models.chat_model import get_chat_history, create_new_conversation, save_chat_to_db
from app.agents.select_intent_agent import get_user_intent
from app.agents.vision_agent import get_image_data
from app.rag.retrieve import get_vector_search_result
from app.services.internal_service import get_inventory
from app.agents.prompts import get_system_prompt
from app.LangGraph.state import State


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

    if not conversation_id_str:
        conversation_id = await create_new_conversation(user_id=user_id, user_message=user_message)
        
        return {
            **state, 
            "conversation_history":None,
            "conversation_id":conversation_id
        }
    
    else:

        history = get_chat_history(
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

    if intent == "query_from_inventory":
        return { **state, "action": "fetch_inventory" }
    
    elif intent == "query_from_image":
        return {**state, "action": "get_image_data"}
    
    elif intent == "query_from_pdf":
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
        user_query = state["user_input"],
        ai_response = state["response"]
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
    
    system_prompt = get_system_prompt(
        state.get("user_input"),
        state.get("memory_context"),
        state.get("conversation_history"),
        state.get("inventory"),       
        state.get("expiring_items"),   
        state.get("image_data"),       
        state.get("pdf_data"),   
        state.get("is_direct_input"),
        state.get("has_inventory", False)
    )

    response = await llm.ainvoke(system_prompt)
    content_data = response.content if hasattr(response, "content") else response

    if isinstance(content_data, list):
        final_ai_string = "".join([
            block.get("text", "") 
            for block in content_data 
            if isinstance(block, dict)
        ])
    else:
        final_ai_string = str(content_data)

    print(final_ai_string)
    return {**state, "response":final_ai_string}

def formatter(state):
    return state

