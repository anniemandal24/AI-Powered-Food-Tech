from app.api.socket_api import sio
from app.models.chat_model import conversations_collection, get_chat_history, save_chat_to_db
from app.agents.chat_agent import chat_client, CHAT_AGENT_SYSTEM_PROMPT
from app.agents.vision_agent import get_image_data
from app.rag.retrieve import get_vector_search_result
from app.services.mem import search_in_memory, add_memory
from app.services.internal_service import get_data_from_inventory, get_items_tobe_expire
from json import dumps,loads
from bson import ObjectId
import re

@sio.on("ask_ai")
async def ask_ai_handler(sid, data):

    if not sid:
        return await sio.emit("ai_error", {
            "error": "No sid provided"
        }, room=sid)

    if not data:
        return await sio.emit("ai_error", {
            "error": "No data provided"
        }, room=sid)

    session = await sio.get_session(sid)
    user_id = session.get("user_id")
    user_message = data.get("message")
    image_url = data.get("url")
    file_name = data.get("filename")
    conversation_id_str = data.get("conversation_id")
    # print(user_id, user_message, image_url, file_name, conversation_id_str)

    if not user_message: 
        return await sio.emit("ai_error", {
            "error": "No message provided"
        }, room=sid)

    try:
        if not conversation_id_str:
            new_conv = await conversations_collection.insert_one({
                "user_id": ObjectId(user_id), 
                "title": user_message[:30] + "..."}
            )

            conversation_id = new_conv.inserted_id

            await sio.emit("conversation_started", {
                "conversation_id": str(conversation_id)
            }, room=sid)

        else:
            conversation_id = ObjectId(conversation_id_str)

        chat_history = await get_chat_history(conversation_id=conversation_id)
        final_output = ""
        ai_response = None

        messages_history = [
            {
                "role":"user",
                "content":user_message
            },
            {
                "role":"system",
                "content":CHAT_AGENT_SYSTEM_PROMPT
            }
        ]

        while True:
            
            # memories = await search_in_memory(
            #     user_id=user_id,
            #     user_query=user_message,
            #     conversation_id=str(conversation_id)
            # )

            # SYSTEM_PROMPT = f"""
            #     Here is the recent chat:{chat_history}
            #     Here is context about user: {dumps(memories)}
            # """

            response = await chat_client.chat.completions.create(
                model="gemini-3-flash-preview",
                messages = messages_history,
                response_format = {
                    "type":"json_object"
                }
            )

            current_output = response.choices[0].message.content

            messages_history.append({
                "role": "assistant",
                "content": current_output
            })

            objects = re.findall(r'\{[^{}]+\}',current_output)
            result = [loads(obj) for obj in objects]

            if(isinstance(result,list)):
                parsed_output = result[-1]
            else:
                parsed_output = result

            step = parsed_output.get("step")
            await sio.emit("ai_status", {
                "status": f"Step:{step}, content:{parsed_output.get('content')}"
            }, room=sid)

            if step and "OUTPUT" in step:
                final_output = parsed_output.get("content", current_output)
                ai_response = {
                    "role": "assistant",
                    "content": dumps({
                        "step": step,
                        "content": final_output
                    })
                }
                await sio.emit("ai_complete", {"done": "true"}, room=sid)
                break

            tool = parsed_output.get("tool")
            tool_input = parsed_output.get("input")
            tool_data = None

            if tool and "get_image_data" in tool:
                tool_data = await get_image_data(image_url)

            elif tool and "get_vector_search_result" in tool:
                tool_data = await get_vector_search_result(
                    user_id = user_id,
                    user_query = user_message,
                    filename = file_name
                )

            elif tool and "get_data_from_invenntory" in tool:
                tool_data = await get_data_from_inventory(
                    user_id = user_id,
                    status = parsed_output.get("status")
                )

            elif tool and "get_items_tobe_expire" in tool:
                tool_data = await get_items_tobe_expire(user_id=user_id)

            if(tool):
                ai_response = {
                    "role":"user",
                    "content": dumps({
                        "step":"TOOL",
                        "tool":tool,
                        "input":tool_input,
                        "content":tool_data
                    })
                }

                messages_history.append(ai_response)

            else:
                ai_response = {
                    "role":"assistant", 
                    "content":{
                        "step":parsed_output.get("step"),
                        "content":parsed_output.get("content")
                    }
                }

            # await add_memory(
            #     user_id=user_id,
            #     user_query=user_message,
            #     conversation_id=str(conversation_id),
            #     ai_response=ai_response
            # )

        await save_chat_to_db(
            conversation_id=str(conversation_id),
            user_message=user_message,
            ai_result=final_output
        )


    except Exception as e:
        print(f"Master Loop Error: {e}")
        await sio.emit("ai_error", {
            "error": "An error occurred while processing your request."
        }, room=sid)