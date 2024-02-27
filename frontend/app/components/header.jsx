"use client";
import Link from "next/link";
import config from "@/config";
import { useEffect } from "react";
import Logout from "./Logout";
import useWebSocket from "react-use-websocket";
import { socketUrl } from "@/public/js/socket";

const Header = () => {
    const {} = useWebSocket(socketUrl, {
        onOpen: () => console.log("opened"),
        onClose: () => console.log("closed"),
        onMessage: () => (event) => {
            const message = JSON.parse(event.data);
            console.log(message);
        },
        share: false,
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => true,
    });

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

    return (
        <header className='z-[100] h-[--m-top] fixed top-0 left-0 w-full flex items-center bg-white/80 sky-50 backdrop-blur-xl border-b border-slate-200 dark:bg-dark2 dark:border-slate-800'>
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
                <div className='flex-1 relative'>
                    <div className='max-w-[1220px] mx-auto flex items-center'>
                        <div className='flex items-center sm:gap-4 gap-2 absolute right-5 top-1/2 -translate-y-1/2 text-black'>
                            <Logout />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

async function handleCreateGroup() {
    let name = document.getElementById("GroupName");
    let description = document.getElementById("GroupDescription");
    let button = document.getElementById("createGroup");

    if (name.value.trim().length == 0 || description.value.trim().length == 0) {
        return;
    }

    console.log("clicked");
    let requestData = { name: name.value.trim(), description: description.value.trim() };

    let token = document.cookie.split("=")[1];

    if (token) {
        // Use the token as needed
        console.log("Token:", token);
    } else {
        console.log("Token not found in cookies");
    }

    try {
        const response = await fetch(config.serverApiUrl + "createGroup", {
            method: "POST",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(requestData),
        });

        console.log(response.ok, "--------ok");

        if (response.ok) {
            console.log("ooook");
            name.value = "";
            description.value = "";
            button.classList.add("btn-disabled");
        }
    } catch (error) {
        console.error("Error while fetching groups:", error);
    }
}

export default Header;
