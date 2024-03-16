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
        retryOnError: true,
        reconnectInterval: 3000,
        reconnectAttempts: 10,
      };

    const webSocket = useWebSocket(socketUrl, options);

    return <WebSocketContext.Provider value={webSocket}>{children}</WebSocketContext.Provider>;
};

// WebSocketContext.js
// import { createContext, useContext, useEffect } from 'react';
// import { useWebSocket as useWebSocketLibrary } from 'react-use-websocket';

// const WebSocketContext = createContext();

// export const useWebSocket = () => {
//   return useContext(WebSocketContext);
// };

// export const WebSocketProvider = ({ children }) => {
//   const { lastJonMessage, readyState, sendJonMessage } = useWebSocketLibrary(socketUrl);

//   useEffect(() => {
//     const connectWebSocket = () => {
//       // Implement your WebSocket connection logic here
//       console.log(`WebSocket readyState: ${readyState}`);
//       // Optionally handle other WebSocket events or send/receive messages

//       try {
//         const socket = new WebSocket(socketUrl);

//         socket.onopen = () => {
//           console.log('WebSocket connected ------------- ');
//           // Optionally, you can handle other WebSocket events or send/receive messages
//         };

//         socket.onmessage = (event) => {
//           // Handle incoming messages
//           console.log('WebSocket message received: -------------', event.data);
//         };

//         socket.onclose = (event) => {
//           console.log(`WebSocket closed with code: ${event.code}, reason: ${event.reason}`);
//           // Optionally, implement reconnection logic here
//         };

//         socket.onerror = (error) => {
//           console.error('WebSocket error:', error);
//           // Optionally, handle error or implement reconnection logic here
//         };
//       } catch (error) {
//         console.error('Error connecting to WebSocket:', error);
//         // Optionally, handle error or implement reconnection logic here
//       }
//     };

//     // Initial connection attempt
//     connectWebSocket();

//     // Set up interval to attempt reconnection every 2 seconds
//     const reconnectInterval = setInterval(() => {
//       connectWebSocket();
//     }, 2000);

//     // Cleanup interval on component unmount
//     return () => {
//       clearInterval(reconnectInterval);
//     };
//   }, [readyState]); // Include readyState in the dependency array

//   const value = {
//     lastJonMessage,
//     readyState,
//     sendJonMessage,
//     // Add any other WebSocket-related state or functions here
//   };

//   return (
//     <WebSocketContext.Provider value={value}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };
