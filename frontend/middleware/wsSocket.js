// websocket.js
export const socket = new WebSocket("ws://localhost:8080/api/socket");

export const InitWebSocket = () => {
	socket.onopen = function () {
		console.log("WebSocket connection opened");
	};

	socket.onclose = function () {
		console.log("WebSocket connection closed");
	};

	socket.onerror = function (error) {
		console.error("WebSocket error:", error);
	};
};
