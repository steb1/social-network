"use client";
import config from "@/config";
import { useEffect } from "react";
import { useWebSocketContext } from "@/public/js/websocketContext";
import { CustomAlert } from "./CustomAlert";

export const GroupOption = ({ group, setGroups, setServerError }) => {
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocketContext();
    // ---------------------------------- INIT SOCKET ----------------------------------------------
    useEffect(() => {
        // Check if a new JSON message has been received
        // console.log(lastJsonMessage, "--------group option--------not");
        switch (lastJsonMessage?.command) {
            case "messageforuser":
                break;
            case "handleGroupRequest":
                break;
            case "inviteUser":
                break;
        }
    });

    async function handleGroupRequest(e, groupid, setGroups, setServerError) {
        let token = document.cookie.split("=")[1];
        if (!token) {
            return;
        }

        const message = {
            groupId: groupid,
            time: Date.now(),
        };

        const WebSocketMessage = {
            command: "handleGroupRequest",
            body: message,
        };

        try {
            const response = await fetch(config.serverApiUrl + "createMembership", {
                method: "POST",
                cache: "no-cache",
                headers: {
                    Authorization: token,
                },
                credentials: "include",
                body: JSON.stringify({ groupid: groupid }),
            });

            if (response.ok) {
                e.target.classList.add("btn-disabled");
                e.target.classList.remove("bg-primary");
                sendJsonMessage(WebSocketMessage);
            }
        } catch (error) {
            console.error("Error while fetching groups:", error);
        }
    }

    return (
        <div id={group.group_id} className='card card-compact bg-white-100 shadow-xl carousel-item w-96 h-64'>
            <figure>
                <img
                    src='https://i0.wp.com/www.iedunote.com/img/28051/reference-groups.jpg?fit=1080%2C720&quality=100&ssl=1'
                    alt='Shoes'
                />
            </figure>
            <div className='card-body'>
                <h2 className='card-title'>{group.title}</h2>
                <p>{group.description}</p>
                <div className='card-actions justify-end'>
                    <button
                        onClick={(e) => handleGroupRequest(e, group.group_id, setGroups, setServerError)}
                        className='btn btn-xs btn-primary '
                    >
                        Send request
                    </button>
                </div>
            </div>
        </div>
    );
};
