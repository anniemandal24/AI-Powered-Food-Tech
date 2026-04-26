import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Camera, Send, Loader2, X, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Initialize socket outside component to avoid reconnects on every render,
// or initialize it inside useEffect. We'll do it inside useEffect to manage cleanup properly.

function App() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeToolStatus, setActiveToolStatus] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null); // { filename: string, url?: string }
  const [isUploading, setIsUploading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, activeToolStatus]);

  // Setup Socket Connection
  useEffect(() => {
    const newSocket = io('http://localhost:8000', {
      transports: ['websocket', 'polling'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    newSocket.on('ai_chunk', (data) => {
      // data: { chunk: string, conversation_id?: string }
      if (data.conversation_id && !conversationId) {
        setConversationId(data.conversation_id);
      }

      setMessages((prev) => {
        const lastMsg = prev[prev.length - 1];
        if (lastMsg && lastMsg.sender === 'ai' && lastMsg.isStreaming) {
          // Append to the existing streaming message
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...lastMsg,
            text: lastMsg.text + (data.chunk || ''),
          };
          return newMessages;
        } else {
          // Create a new streaming message
          return [
            ...prev,
            {
              id: Date.now().toString(),
              sender: 'ai',
              text: data.chunk || '',
              isStreaming: true,
            },
          ];
        }
      });
    });

    newSocket.on('ai_status', (data) => {
      // data: { status: string }
      setActiveToolStatus(data.status || data.message || 'Thinking...');
    });

    newSocket.on('ai_complete', (data) => {
      // data: { conversation_id?: string }
      if (data && data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      setIsTyping(false);
      setActiveToolStatus(null);
      
      // Mark the last AI message as no longer streaming
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg && lastMsg.sender === 'ai') {
          newMessages[newMessages.length - 1] = { ...lastMsg, isStreaming: false };
        }
        return newMessages;
      });
    });

    newSocket.on('ai_error', (data) => {
      console.error('AI Error:', data);
      setIsTyping(false);
      setActiveToolStatus(null);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'system',
          text: data.error || data.message || 'An error occurred while processing your request.',
          isError: true,
        },
      ]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/v1/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      // Expecting JSON like { "filename": "..." }
      setUploadedFile({ filename: data.filename, url: data.url });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !uploadedFile) return;

    const newMsgId = Date.now().toString();
    const newUserMsg = {
      id: newMsgId,
      sender: 'user',
      text: inputMessage.trim(),
      file: uploadedFile,
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setIsTyping(true);
    setActiveToolStatus('Connecting...');

    // Emit socket event
    const payload = {
      message: inputMessage.trim(),
    };
    
    if (uploadedFile?.filename) payload.filename = uploadedFile.filename;
    if (uploadedFile?.url) payload.url = uploadedFile.url;
    if (conversationId) payload.conversation_id = conversationId;

    socket?.emit('ask_ai', payload);

    // Reset input
    setInputMessage('');
    setUploadedFile(null);
  };

  return (
    <div className="flex flex-col h-screen bg-sage-50">
      {/* Header */}
      <header className="bg-white border-b border-sage-200 py-4 px-6 shadow-sm flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-citrus-500 rounded-full flex items-center justify-center text-white shadow-md">
            <span className="text-xl">🌿</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-sage-900 tracking-tight">AI Food Tech</h1>
            <p className="text-sm text-sage-500 font-medium">Your Culinary Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           {socket?.connected ? (
             <span className="flex items-center gap-1.5 text-xs font-medium text-sage-600 bg-sage-100 px-2.5 py-1 rounded-full">
               <span className="w-2 h-2 rounded-full bg-green-500"></span> Connected
             </span>
           ) : (
             <span className="flex items-center gap-1.5 text-xs font-medium text-sage-600 bg-sage-100 px-2.5 py-1 rounded-full">
               <span className="w-2 h-2 rounded-full bg-red-400"></span> Disconnected
             </span>
           )}
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 scrollbar-thin">
        <div className="max-w-3xl mx-auto space-y-6">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full mt-20 text-center space-y-4">
              <div className="w-20 h-20 bg-citrus-100 rounded-full flex items-center justify-center mb-2">
                <span className="text-4xl">🍳</span>
              </div>
              <h2 className="text-2xl font-bold text-sage-800">What are we cooking today?</h2>
              <p className="text-sage-500 max-w-md">
                Upload a photo of your fridge, ask for recipe ideas, or get nutritional advice.
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-citrus-500 text-white rounded-tr-sm'
                    : msg.sender === 'system'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-white border border-sage-200 text-sage-800 rounded-tl-sm'
                }`}
              >
                {/* Render attached file in user message */}
                {msg.file && (
                  <div className="flex items-center gap-2 mb-2 p-2 bg-black/10 rounded-lg max-w-fit">
                    <FileText size={16} className={msg.sender === 'user' ? 'text-white' : 'text-sage-500'} />
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {msg.file.filename}
                    </span>
                  </div>
                )}
                
                {msg.sender === 'ai' ? (
                  <div className="prose prose-sage max-w-none prose-p:leading-relaxed prose-pre:bg-sage-100 prose-pre:text-sage-900">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                    {msg.isStreaming && (
                      <span className="inline-block w-1.5 h-4 ml-1 bg-sage-400 animate-pulse align-middle"></span>
                    )}
                  </div>
                ) : (
                  <div className="whitespace-pre-wrap font-medium">
                    {msg.text}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Tool Status Badge */}
          {activeToolStatus && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-sage-100 border border-sage-200 rounded-full px-4 py-2 flex items-center gap-2 text-sage-700 shadow-sm">
                <Loader2 size={16} className="animate-spin text-citrus-500" />
                <span className="text-sm font-medium">{activeToolStatus}</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-sage-200 p-4 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto">
          {/* Upload Preview */}
          {uploadedFile && (
            <div className="mb-3 flex items-center gap-2 bg-sage-50 border border-sage-200 rounded-lg p-2 max-w-fit animate-in fade-in">
              <CheckCircle2 size={16} className="text-citrus-500" />
              <span className="text-sm text-sage-700 font-medium truncate max-w-[200px]">
                {uploadedFile.filename}
              </span>
              <button 
                onClick={removeUploadedFile}
                className="ml-2 text-sage-400 hover:text-red-500 transition-colors"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-end gap-2 relative">
            <div className="relative flex-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.txt"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isTyping}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-sage-400 hover:text-citrus-500 hover:bg-sage-50 rounded-full transition-all disabled:opacity-50"
                aria-label="Upload file"
              >
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
              </button>
              
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about a recipe, ingredients..."
                disabled={isTyping}
                className="w-full bg-sage-50 border border-sage-200 text-sage-900 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-citrus-300 focus:border-citrus-300 transition-all placeholder:text-sage-400 font-medium disabled:opacity-70"
              />
            </div>
            
            <button
              type="submit"
              disabled={isTyping || (!inputMessage.trim() && !uploadedFile)}
              className="bg-citrus-500 hover:bg-citrus-600 text-white p-3 rounded-2xl shadow-sm transition-all disabled:opacity-50 disabled:hover:bg-citrus-500 flex items-center justify-center"
              aria-label="Send message"
            >
              <Send size={20} className={inputMessage.trim() || uploadedFile ? "translate-x-0.5 -translate-y-0.5 transition-transform" : ""} />
            </button>
          </form>
          <div className="mt-2 text-center">
             <span className="text-xs text-sage-400">AI can make mistakes. Consider verifying important nutritional information.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
