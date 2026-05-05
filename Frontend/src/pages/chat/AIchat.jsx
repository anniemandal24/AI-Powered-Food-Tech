import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";
import useSocket from "../../hooks/socket/useSocket";

export default function AIchat() {
  const { socket, isConnected } = useSocket();
  const location = useLocation();

  // 🧠 Data from Scan Page
  const image = location.state?.image;
  const result = location.state?.result;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const messagesEndRef = useRef(null);

  // Auto scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // 🎧 Socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("ai_chunk", (data) => {
      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      setMessages((prev) => {
        const last = prev[prev.length - 1];

        if (last && last.sender === "ai" && last.streaming) {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...last,
            text: last.text + (data.chunk || ""),
          };
          return updated;
        }

        return [
          ...prev,
          {
            id: Date.now(),
            sender: "ai",
            text: data.chunk || "",
            streaming: true,
          },
        ];
      });
    });

    socket.on("ai_complete", () => {
      setIsTyping(false);

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];

        if (last?.sender === "ai") {
          updated[updated.length - 1] = {
            ...last,
            streaming: false,
          };
        }

        return updated;
      });
    });

    socket.on("ai_error", () => {
      setIsTyping(false);
    });

    return () => {
      socket.off("ai_chunk");
      socket.off("ai_complete");
      socket.off("ai_error");
    };
  }, [socket, conversationId]);

  // 🚀 AUTO SEND after scan
  useEffect(() => {
    if (!socket || !isConnected || !image) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: "Here is my fridge image. Suggest recipes.",
    };

    setMessages([userMessage]);
    setIsTyping(true);

    socket.emit("ask_ai", {
      message: "Analyze this fridge and suggest recipes",
      image,
      context: result,
      conversation_id: conversationId,
    });
  }, [socket, isConnected]);

  // ✉️ Manual send
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
      conversation_id: conversationId,
    });

    setInputMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b flex justify-between bg-white">
        <h1 className="font-bold text-lg">AI Recipe Assistant</h1>
        <span className="text-sm">
          {isConnected ? "🟢 Connected" : "🔴 Offline"}
        </span>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={msg.sender === "user" ? "text-right" : ""}
          >
            <div
              className={`inline-block px-4 py-2 rounded-xl max-w-[70%] ${
                msg.sender === "user"
                  ? "bg-green-500 text-white"
                  : "bg-white border"
              }`}
            >
              {msg.sender === "ai" ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 className="animate-spin" size={16} />
            AI is thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-2">
        <input
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask about recipes..."
          className="flex-1 border rounded px-3 py-2"
        />

        <button
          type="submit"
          disabled={!isConnected}
          className="bg-green-500 text-white px-4 rounded"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}