// websocketContext.js
"use client";
import { createContext, useContext } from "react";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children, url }) => {
    return <WebSocketContext.Provider value={{ url }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketConfig = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocketConfig must be used within a WebSocketProvider");
    }
    return context;
};
