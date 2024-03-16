import React from "react";
import config from "@/config";

const SideBarPreviewChat = ({
  PrenomNom,
  avatar,
  To,
  Time,
  Message,
  setMessages,
  setChatter,
  setGroupChatter,
  cmsRef,
}) => {
  const LoadMessage = async () => {
    let token = document.cookie.split("=")[1];
    if (!token) {
      return;
    }

    if (token) {
      // Use the token as needed
      console.log("Token:", token);
    } else {
      console.log("Token not found in cookies");
    }

    try {
      const response = await fetch(config.serverApiUrl + `messages/${To}`, {
        method: "GET",
        cache: "no-cache",
        headers: {
          Authorization: token,
        },
        credentials: "include",
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log(data, "-------datam-----------");
          console.log(To, "-------to-----------");
          setMessages("");
          setMessages(data.messages);
          setChatter(data.user);
          setGroupChatter("");

          cmsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        } else {
          console.error("Response is not in JSON format");
        }
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error || "An error occurred.";
        console.error("No Group retrieved:", errorMessage);
      }
    } catch (error) {
      console.error("Error while fetching groups:", error);
    }
  };
  return (
    <div
      onClick={LoadMessage}
      className="relative flex items-center cursor-pointer gap-4 p-2 duration-200 rounded-xl hover:bg-slate-800"
      prefetch={false}
    >
      <div className="relative w-14 h-14 shrink-0">
        <img
          src={`${config.ServerApiImage}/${avatar}`}
          alt=""
          className="object-cover w-full h-full rounded-full"
        />
        <div className="w-4 h-4 absolute bottom-0 right-0  bg-green-500 rounded-full border border-white dark:border-slate-800"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="mr-auto text-sm text-black dark:text-white font-medium">
            {PrenomNom}
          </div>
          <div className="text-xs font-light text-gray-500 dark:text-white/70">
            {formatDate(Time)}
          </div>
          {/* If message read remove this next line */}
          {/* <div className="w-2.5 h-2.5 bg-blue-600 rounded-full dark:bg-slate-700"></div> */}
        </div>
        <div className="font-light overflow-hidden text-ellipsis text-sm whitespace-nowrap">
          {IfMessage(Message)}
        </div>
      </div>
    </div>
  );
};

export default SideBarPreviewChat;

function IfMessage(message) {
  if (message === "") {
    return "No message yet.";
  }
  return message;
}
function formatDate(dateString) {
  if (dateString === "") {
    return "";
  }
  var parsedDate = new Date(dateString);

  var options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  var outputDateString = parsedDate.toLocaleDateString("en-US", options);

  return outputDateString;
}
