from openai import AsyncOpenAI
from app.agents.prompts import VISION_AGENT_SYSTEM_PROMPT
import os

client = AsyncOpenAI(
    api_key = os.getenv("GEMINI_API_KEY"),
    base_url = os.getenv("GEMINI_BASE_URL")
)

async def get_image_data(url:str):
    print("get_image_data has been called")

    response = await client.chat.completions.create(
        model="gemini-2.5-flash",
        messages=[
            {
                "role": "user",
                "content":[
                    {
                        "type":"image_url",
                        "image_url":{
                            "url":url
                        }
                    }
                ]
            },
            {
                "role":"assistant",
                "content":VISION_AGENT_SYSTEM_PROMPT
            }
        ]
    )

    return response.choices[0].message.content
