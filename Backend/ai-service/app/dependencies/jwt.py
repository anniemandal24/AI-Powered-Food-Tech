import jwt
import os
from dotenv import load_dotenv
load_dotenv()
from fastapi import HTTPException,Header,status  

JWT_SECRET = os.getenv("JWT_SECRET_KEY")

async def verify_jwt(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "Invalid authorization header format. Must be 'Bearer <token>'"
        )
    
    token = authorization.split(" ")[1]
    
    try:
        payload = jwt.decode(token, JWT_SECRET)
        user_id = payload.get("_id")
        
        if not user_id:
            raise HTTPException(status_code=401, detail="Token payload invalid")
            
        return user_id
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")