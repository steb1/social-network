"use client";
import React, { useState } from "react";
import config from "@/config";
import { useWebSocketContext } from "@/public/js/websocketContext";

const FollowButton = ({ FollowStatus, userId, cookie }) => {
  const [followStatus, setFollowStatus] = useState(FollowStatus);
  //const [showAlert, setShowAlert] = useState(false);

  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocketContext();

  const follow = async () => {
    console.log("--------nnnn", userId);
    const message = {
      userId: userId,
      time: Date.now(),
    };

    const WebSocketMessage = {
      command: "followPrivate",
      body: message,
    };

    try {
      const response = await fetch(`${config.serverApiUrl}follow`, {
        method: "POST",
        cache: "no-cache",
        headers: {
          Authorization: `${cookie}`,
          "Content-type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          userId: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        if (data.type === "Followed") {
          setFollowStatus("Unfollow");
        }
        if (data.type === "Unfollow") {
          setFollowStatus("Follow");
        }
        if (data.type === "Pending") {
          setFollowStatus("Pending");
          sendJsonMessage(WebSocketMessage);
        }
      } else {
        const errorText = await response.text();
        console.error("Profile not changed successfully:", errorText);
      }
    } catch (error) {
      console.error("Error during changing profile privacy:", error);
    }
  };

  return (
    <div>
      <button
        onClick={follow}
        className="button bg-primary hover:bg-sky-700 flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1"
      >
        {followStatus == "Follow" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 32 32"
          >
            <path
              fill="currentColor"
              d="M32 14h-4v-4h-2v4h-4v2h4v4h2v-4h4zM12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7z"
            />
          </svg>
        )}
        {followStatus == "Unfollow" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M14 14.252v2.09A6 6 0 0 0 6 22H4a8 8 0 0 1 10-7.749M12 13c-3.315 0-6-2.685-6-6s2.685-6 6-6s6 2.685 6 6s-2.685 6-6 6m0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4m7 6.586l2.121-2.121l1.415 1.414L20.414 19l2.121 2.121l-1.414 1.415L19 20.414l-2.121 2.121l-1.415-1.414L17.587 19l-2.121-2.121l1.414-1.415z"
            />
          </svg>
        )}
        {followStatus == "Pending" && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
          >
            <path
              fill="#888888"
              d="M6.998 13q.415 0 .709-.291q.293-.291.293-.707q0-.415-.291-.709Q7.418 11 7.002 11q-.415 0-.709.291q-.293.291-.293.707q0 .415.291.709q.291.293.707.293m5 0q.415 0 .709-.291q.293-.291.293-.707q0-.415-.291-.709q-.291-.293-.707-.293q-.415 0-.709.291q-.293.291-.293.707q0 .415.291.709q.291.293.707.293m5 0q.415 0 .709-.291q.293-.291.293-.707q0-.415-.291-.709q-.291-.293-.707-.293q-.415 0-.709.291q-.293.291-.293.707q0 .415.291.709q.291.293.707.293m-4.995 8q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924q-1.216-1.214-1.925-2.856Q3 13.87 3 12.003q0-1.866.708-3.51q.709-1.643 1.924-2.859q1.214-1.216 2.856-1.925Q10.13 3 11.997 3q1.866 0 3.51.708q1.643.709 2.859 1.924q1.216 1.214 1.925 2.856Q21 10.13 21 11.997q0 1.866-.708 3.51q-.709 1.643-1.924 2.859q-1.214 1.216-2.856 1.925Q13.87 21 12.003 21M12 20q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20m0-8"
            />
          </svg>
        )}

        <span className="text-sm">{followStatus}</span>
      </button>
    </div>
  );
};

export default FollowButton;
