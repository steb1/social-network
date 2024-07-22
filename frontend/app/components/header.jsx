"use client";
import Link from "next/link";
import config from "@/config";
import { useEffect, useState } from "react";
import { Element } from "./elements";
import { useWebSocketContext } from "@/public/js/websocketContext";
import { CustomAlert } from "./CustomAlert";

const Header = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    let { sendJsonMessage, lastJsonMessage, readyState } = useWebSocketContext();
    // ---------------------------------- INIT SOCKET ----------------------------------------------

    useEffect(() => {
        // Attach the onClose callback
        // Check if a new JSON message has been received
        switch (lastJsonMessage?.command) {
            case "handleGroupRequest":
                setShowAlert(true);
                setAlertMessage(
                    `${lastJsonMessage.body.sender} is interested in joining your group "${lastJsonMessage.body.group_name}".`
                );
                break;
            case "inviteUser":
                setShowAlert(true);
                setAlertMessage(
                    `${lastJsonMessage.body.sender} has invited you to join the group "${lastJsonMessage.body.group_name}".`
                );
                break;
            case "followPrivate":
                setShowAlert(true);
                setAlertMessage(`${lastJsonMessage.body.sender} wants to follow your private account.`);
                break;
            case "eventCreated":
                setShowAlert(true);
                setAlertMessage(
                    `${lastJsonMessage.body.sender} created an event in ${lastJsonMessage.body.group_name}.`
                );
                break;
            case "messageforgroup":
                setShowAlert(true);
                setAlertMessage(`${lastJsonMessage.body.sender} sent a message in group.`);
                break; 
            case "messageforuser":
                setShowAlert(true);
                setAlertMessage(`${lastJsonMessage.body.sender} sent a message.`);
                break;
        }
    }, [lastJsonMessage]);

    useEffect(() => {
        let name = document.getElementById("GroupName");
        let description = document.getElementById("GroupDescription");
        let button = document.getElementById("createGroup");

        const handleSubmit = (e) => {
            if (name.value.trim().length > 0 && description.value.trim().length > 0) {
                button.classList.remove("btn-disabled");
            } else if (name.value.trim().length == 0 || description.value.trim().length == 0) {
                button.classList.add("btn-disabled");
            }
        };

        if (name) {
            name.addEventListener("input", handleSubmit);
        }
        if (description) {
            description.addEventListener("input", handleSubmit);
        }
        if (button) {
            button.addEventListener("click", handleCreateGroup);
        }
    }, []);

    function sendMessageWeb(command, body) {
        const WebSocketMessage = {
            command: command,
            body: body,
        };

        sendJsonMessage(WebSocketMessage);
    }

    return (
        <div>
            <header className='z-[100] h-[--m-top] fixed top-0 left-0 w-full flex items-center bg-white/80 sky-50 backdrop-blur-xl border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800'>
                <div className='flex items-center w-full xl:px-6 px-2 max-lg:gap-10'>
                    <div className='2xl:w-[--w-side] lg:w-[--w-side-sm]'>
                        <div className='flex items-center gap-1'>
                            <button
                                uk-toggle='target: #site__sidebar ; cls :!-translate-x-0'
                                className='flex items-center justify-center w-8 h-8 text-xl rounded-full hover:bg-gray-100 xl:hidden dark:hover:bg-slate-600 group'
                            >
                                <ion-icon name='menu-outline' className='text-2xl group-aria-expanded:hidden' />
                                <ion-icon name='close-outline' className='hidden text-2xl group-aria-expanded:block' />
                            </button>
                            <Link href='/' id='logo'>
                                <h1 className='bg-clip-text text-center font-instalogo text-3xl text-black'>
                                    The Social Network
                                </h1>
                            </Link>
                        </div>
                    </div>
                    <Element />
                </div>
            </header>
            {showAlert && <CustomAlert message={alertMessage} onClose={() => setShowAlert(false)} />}
        </div>
    );
};

async function handleCreateGroup() {
    let name = document.getElementById("GroupName");
    let description = document.getElementById("GroupDescription");
    let button = document.getElementById("createGroup");

    if (name.value.trim().length == 0 || description.value.trim().length == 0) {
        return;
    }

    ("clicked");
    let requestData = {
        name: name.value.trim(),
        description: description.value.trim(),
    };

    let token = document.cookie.split("=")[1];
    if (!token) {
        return;
    }

    try {
        const response = await fetch(config.serverApiUrl + "createGroup", {
            method: "POST",
            cache: "no-cache",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            name.value = "";
            description.value = "";
            button.classList.add("btn-disabled");
        }
    } catch (error) {
        console.error("Error while fetching groups:", error);
    }
}

export default Header;
