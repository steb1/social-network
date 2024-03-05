"use client";
import React from "react";
import { useRouter } from "next/navigation";
import config from "@/config";
import { useWebSocketContext } from "@/public/js/websocketContext";

const Logout = () => {
    const router = useRouter();

    const handleLogout = () => {
        document.cookie = `${config.cookieName}=; path=/; max-age=0; Secure`;
        localStorage.clear();
        router.replace("/auth/signin");
        const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocketContext();
        closeWebSocket();
        sendJsonMessage({ command: "logout" });
    };

  return (
    // <div className="relative cursor-pointer shrink-0" onClick={handleLogout}>
    // 	<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16">
    // 		<path fill="currentColor" fillRule="evenodd" d="M11.02 3.77v1.56l1-.99V2.5l-.5-.5h-9l-.5.5v.486L2 3v10.29l.36.46l5 1.72L8 15v-1h3.52l.5-.5v-1.81l-1-1V13H8V4.71l-.33-.46L4.036 3h6.984zM7 14.28l-4-1.34V3.72l4 1.34zm6.52-5.8H8.55v-1h4.93l-1.6-1.6l.71-.7l2.47 2.46v.71l-2.49 2.48l-.7-.7z" clipRule="evenodd" />
    // 	</svg>
    // </div>
    <div
	className=" cursor-pointer "
      onClick={handleLogout}
      style={{ width: "100%", height: "100%", fill: "black" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        enableBackground="new 0 0 24 24"
        height={24}
        viewBox="0 0 24 24"
        width={32}
        focusable="false"
        style={{
          pointerEvents: "none",
          display: "block",
          width: "100%",
          height: "100%",
        }}
      >
        <path d="M20 3v18H8v-1h11V4H8V3h12zm-8.9 12.1.7.7 4.4-4.4L11.8 7l-.7.7 3.1 3.1H3v1h11.3l-3.2 3.3z" />
      </svg>
    </div>
  );
};

export default Logout;
