from openai import AsyncOpenAI
from app.agents.prompts import INTENT_CLASSIFIER_AGENT_PROMPT
from json import loads
import os

intents = [
    "query_from_inventory",
    "query_from_image",
    "query_from_pdf",
    "query_from_input",
    # "add_inventory",
    "waste_reduction",
    "ask_storage_tip",
    "clarify"
]


async def get_user_intent(user_query:str):
    client = AsyncOpenAI(
        api_key = os.getenv("GEMINI_API_KEY"),
        base_url = os.getenv("GEMINI_BASE_URL")
    )

    response = await client.chat.completions.create(
        model = "gemini-3-flash-preview",
        messages = [
            {
                "role":"system",
                "content":INTENT_CLASSIFIER_AGENT_PROMPT
            },
            {
                "role":"user",
                "content":user_query
            }
        ]
    )
    # print(response.choices[0].message.content)
    try:
        parsed = loads(response.choices[0].message.content)
        intent = parsed.get("intent", "clarify")
        confidence = float(parsed.get("confidence", 0.6))
    except:
        intent = "clarify"
        confidence = 0.5

    return {
        "intent": intent,
        "confidence": confidence
    }