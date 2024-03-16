"use client";
import React from "react";
import { useRouter } from "next/navigation";
import config from "@/config";
import { useWebSocketContext } from "@/public/js/websocketContext";

const Logout = () => {
	const router = useRouter();
	const { sendJsonMessage } = useWebSocketContext();
	const handleLogout = () => {
		document.cookie = `${config.cookieName}=; path=/; max-age=0; Secure`;
		localStorage.clear();
		router.replace("/auth/signin");
		sendJsonMessage({ command: "logout" });
	};

	return (
		<div className=" cursor-pointer dark:text-white" onClick={handleLogout} style={{ width: "100%", height: "100%", fill: "black" }}>
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
				/>
			</svg>
		</div>
	);
};

export default Logout;
