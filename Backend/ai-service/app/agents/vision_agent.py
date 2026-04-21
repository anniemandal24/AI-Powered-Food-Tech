from openai import OpenAI
import os

client = OpenAI(
    api_key = os.getenv("GEMINI_API_KEY"),
    base_url = os.getenv("GEMINI_BASE_URL")
)


SYSTEM_PROMPT = """
    You are a helpful culinary and inventory AI assistant. 
    The user has provided an image (such as a grocery receipt, a photo of a fridge shelf, or a picture of a specific food item). 

    Your task is to analyze the image and generate a clear, highly readable plain text summary of the food items present.
    If you find or see any recipe or multiple recipes also tell benifits and facts about the recipe. 

    CRITICAL INSTRUCTIONS:
    1. Identify Food: List all clearly visible edible items. Ignore non-food items (like cleaning supplies, paper goods, or background clutter).
    2. Clean Terminology: Translate any receipt shorthand into natural, readable language (e.g., change "ORG SBM GRP" to "Organic Seedless Grapes").
    3. Estimate Freshness/Expiry: For each item, provide a brief, standard food-safety estimate on how long it usually lasts (e.g., "Usually lasts 
    1 week in the fridge"). If you see a printed expiration date in the image, state that exact date instead.
    4. Formatting: Output the results as a clean, bulleted list. Do not use complex markdown tables or JSON. Be conversational but concise.

    EXAMPLE OUTPUT:
    Here is what I found in your image:
    * Organic Bananas (Usually last 5-7 days on the counter)
    * Whole Milk (Expires exactly on 11/24 as printed)
    * Ground Beef (Usually lasts 1-2 days in the fridge, or freeze for later)
"""


def get_image_data(url:str):
    response = client.chat.completions.create(
        model="gemini-3-flash-preview",
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
                "content":SYSTEM_PROMPT
            }
        ]
    )

    return response.choices[0].message.content

