import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export default function useSocket() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); //GET TOKEN

    const newSocket = io(SOCKET_URL, {
      transports: ["polling","websocket"],
      auth: {
        token: token, //SEND TOKEN HERE
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket error:", err.message);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, isConnected };
}