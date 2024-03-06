"use client";
import Link from "next/link";
import config from "@/config";
import { useEffect } from "react";
import { Element } from "./elements";
import  {useWebSocketContext}  from "@/public/js/websocketContext";


const Header = () => {
    const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocketContext();
    // ---------------------------------- INIT SOCKET ----------------------------------------------
    useEffect(() => {
        // Check if a new JSON message has been received
        console.log(lastJsonMessage, "----------------not");
        switch (lastJsonMessage?.command) {
                case "messageforuser":
                    console.log("messageforuser");
                    break
                case "handleGroupRequest":
                    console.log("handleGroupRequest");
                    break
                case "inviteUser":
                    console.log("inviteUser");
                    break
                case "followPrivate" : 
                    console.log("followPrivate")
        }
    
  });

  useEffect(() => {
    let name = document.getElementById("GroupName");
    let description = document.getElementById("GroupDescription");
    let button = document.getElementById("createGroup");

    const handleSubmit = (e) => {
      if (name.value.trim().length > 0 && description.value.trim().length > 0) {
        button.classList.remove("btn-disabled");
      } else if (
        name.value.trim().length == 0 ||
        description.value.trim().length == 0
      ) {
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
    <header className="z-[100] h-[--m-top] fixed top-0 left-0 w-full flex items-center bg-white/80 sky-50 backdrop-blur-xl border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center w-full xl:px-6 px-2 max-lg:gap-10">
        <div className="2xl:w-[--w-side] lg:w-[--w-side-sm]">
          <div className="flex items-center gap-1">
            <button
              uk-toggle="target: #site__sidebar ; cls :!-translate-x-0"
              className="flex items-center justify-center w-8 h-8 text-xl rounded-full hover:bg-gray-100 xl:hidden dark:hover:bg-slate-600 group"
            >
              <ion-icon
                name="menu-outline"
                className="text-2xl group-aria-expanded:hidden"
              />
              <ion-icon
                name="close-outline"
                className="hidden text-2xl group-aria-expanded:block"
              />
            </button>
            <Link href="/" id="logo">
              <h1 className="bg-clip-text text-center font-instalogo text-3xl text-black">
                The Social Network
              </h1>
            </Link>
          </div>
        </div>
        <Element/>
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
  let requestData = {
    name: name.value.trim(),
    description: description.value.trim(),
  };

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
