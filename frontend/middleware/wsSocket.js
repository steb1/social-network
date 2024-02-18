// // websocket.js
// import { useCookies } from "next-client-cookies";

// const cookies = useCookies();
// const socketUrl = `ws://localhost:8080/api/socket?token=${cookies.get("social-network")}`;

// console.log("🚀 ~ cookies.get", cookies.get("social-network"));
// export const socket = new WebSocket(socketUrl);

// // socket.onopen = function () {
// // 	console.log("WebSocket connection opened");
// // };

// socket.onclose = function () {
// 	console.log("WebSocket connection closed");
// };

// socket.onerror = function (error) {
// 	console.error("WebSocket error:", error);
// };
