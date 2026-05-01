# 🍳 AI-Powered-Food-Tech

> An intelligent, real-time household management and food waste reduction API powered by LangGraph, Express, WebSockets, and Neo4j.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Neo4j](https://img.shields.io/badge/Neo4j-008CC1?style=for-the-badge&logo=neo4j&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=langchain&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Google Gemini](https://img.shields.io/badge/google%20gemini-8E75B2?style=for-the-badge&logo=google%20gemini&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571.svg?style=for-the-badge&logo=fastapi)

This repository contains the backend infrastructure for a Food Tech application designed to track pantry inventory, reduce household waste, and generate hyper-personalized AI recipes. It utilizes a hybrid REST/WebSocket architecture and an advanced AI agent routing system.

## ✨ Core Features

*   **Real-Time Expiration Alerts:** Two-tier Cron jobs combined with JWT-authenticated Socket.IO rooms instantly push expiration warnings to active users.
*   **Context-Aware AI Culinary Agent:** Powered by LangGraph and Gemini 1.5 Pro, the AI dynamically checks real-time inventory and tailors recipes based on household size, dietary restrictions, and allergies.
*   **Knowledge Graph & Memory:** Utilizes **Neo4j** to map complex relationships between users, household members, pantries, and recipes, alongside **Qdrant** for semantic vector search.
*   **Append-Only Analytics Ledger:** Tracks the exact lifecycle of food items (Consumed vs. Expired) to generate financial and environmental impact reports.
*   **Secure Household Multiplayer:** Data is isolated and synced across household members, preventing duplicate purchases and enabling shared kitchen management.

## 🏗️ Architecture Stack

*   **Core:** Node.js, Express, TypeScript
*   **Databases:** MongoDB (Mongoose), Neo4j (Graph)
*   **Real-Time Comm:** Socket.IO v4
*   **AI & Memory:** LangGraph, LangChain, Mem0
*   **Vector Store:** Qdrant
*   **Authentication:** JSON Web Tokens (JWT)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local machine:
*   [Node.js](https://nodejs.org/en/) (v18+ recommended)
*   [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas URI)
*   [Neo4j Aura](https://neo4j.com/cloud/platform/aura-graph-database/) (Cloud Instance)

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/smart-kitchen-backend.git](https://github.com/your-username/smart-kitchen-backend.git)
```



### 2. core-api Service 
```bash
cd core-api
```

# install depedencies
```bash
npm install
```

# Compile TypeScript to JavaScript
```bash
npm run build
```

# Start the compiled production server
```bash
npm start
```

# run command
```bash
npm run dev
```

### 3. ai-service 
```bash
cd ai-service
```

# 1. Create a virtual environment
```bash
python -m venv venv
```

# 2. Activate the virtual environment
```bash
venv\Scripts\activate
```

# 3. Install all dependencies
```bash
pip install -r requirements.txt
```

# 4. run command
```bash
uvicorn app.main:socket_app --host 0.0.0.0 --port 8000 --reload
```

# 5. Optional: Generating your requirements.txt
```bash
pip freeze > requirements.txt
```


