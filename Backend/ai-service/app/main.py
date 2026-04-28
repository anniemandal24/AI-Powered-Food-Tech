from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.docs_api import router
from app.api.socket_api import sio
import app.db.mongo 
import socketio
import uvicorn
import os
load_dotenv()

app = FastAPI(
    title="AI Powered Food Tech Backend",
    description="FastAPI server handling RAG, Mem0, and Socket.IO Chat",
    version="1.0.0"
)

app.add_middleware(CORSMiddleware,
    allow_origins=[os.getenv("INTERNAL_BASE_URL")], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(router=router, prefix="/api/v1/docs")

@app.get('/api/ai-server-health-check', tags=["System"])
async def handle_health_check():
    return {
        "status":"ok",
        "code":200,
        "message":"ai-service is up"
    }

socket_app = socketio.ASGIApp(sio,other_asgi_app=app)

def main():
    uvicorn.run(
        app,
        port = 8000,
        host = "0.0.0.0"
    )

if __name__ == "__main__":
    main()


