"use client";

// WebSocketContext.js
import React, { createContext, useContext, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { socketUrl } from "./socket";
const WebSocketContext = createContext();

export const useWebSocketContext = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
    const options = {
        // Additional options can be specified here
        shouldReconnect: true,
        share: true,
    };

    const webSocket = useWebSocket(socketUrl, options);

    return <WebSocketContext.Provider value={webSocket}>{children}</WebSocketContext.Provider>;
};
