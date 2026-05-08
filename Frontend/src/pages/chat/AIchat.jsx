import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";
import useSocket from "../../hooks/socket/useSocket";

export default function AIchat() {
  const { socket, isConnected } = useSocket();
  const location = useLocation();

  const image = location.state?.image;
  const result = location.state?.result;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (!socket) return;

    // Listen for the final response from your graph.ainvoke
    socket.on("ai_complete", (data) => {
      setIsTyping(false);

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "ai",
          text: data.response, // Matches 'response' key from socket_api.py
          streaming: false,
        },
      ]);
    });

    socket.on("ai_error", (data) => {
      setIsTyping(false);
      console.error("AI Error:", data.error);
    });

    return () => {
      socket.off("ai_complete");
      socket.off("ai_error");
    };
  }, [socket]);

  // Auto-send image logic after fridge scan
  useEffect(() => {
    if (!socket || !isConnected || !image) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: "Scanning fridge image... what can I cook?",
    };

    setMessages([userMessage]);
    setIsTyping(true);

    socket.emit("ask_ai", {
      message: "Analyze this fridge and suggest recipes", // data.get("message")
      url: image, // Matches data.get("url") in socket_api.py
      conversation_id: conversationId,
    });
  }, [socket, isConnected, image]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !socket || !isConnected) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: inputMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    socket.emit("ask_ai", {
      message: inputMessage,
      url: null,
      conversation_id: conversationId,
    });

    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="p-4 border-b flex justify-between bg-white shadow-sm">
        <h1 className="font-bold text-lg text-green-700">FreshTrack AI Assistant</h1>
        <span className="text-sm font-medium">
          {isConnected ? "🟢 System Ready" : "🔴 Reconnecting..."}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.sender === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={`inline-block px-4 py-2 rounded-2xl max-w-[80%] shadow-sm ${msg.sender === "user" ? "bg-green-600 text-white" : "bg-white border text-gray-800"
                }`}
            >
              {msg.sender === "ai" ? (
                <div className="prose prose-sm">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500 animate-pulse">
            <Loader2 className="animate-spin" size={16} />
            Assistant is processing fridge data...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-2">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="What should I do with my expiring milk?"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={!isConnected || !inputMessage.trim()}
          className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full disabled:bg-gray-300 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}