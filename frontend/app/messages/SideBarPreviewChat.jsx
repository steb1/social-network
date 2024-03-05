import React from "react";
import Link from "next/link";
import config from "@/config";

const SideBarPreviewChat = ({ PrenomNom, avatar, To, Time, Message }) => {
    return (
        <Link
            href={`/messages/${To}`}
            className='relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-slate-800'
        >
            <div className='relative w-14 h-14 shrink-0'>
                <img
                    src={`${config.ServerApiImage}/${avatar}`}
                    alt=''
                    className='object-cover w-full h-full rounded-full'
                />
                <div className='w-4 h-4 absolute bottom-0 right-0  bg-green-500 rounded-full border border-white dark:border-slate-800'></div>
            </div>
            <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1.5'>
                    <div className='mr-auto text-sm text-black dark:text-white font-medium'>{PrenomNom}</div>
                    <div className='text-xs font-light text-gray-500 dark:text-white/70'>{formatDate(Time)}</div>
                    {/* If message read remove this next line */}
                    {/* <div className="w-2.5 h-2.5 bg-blue-600 rounded-full dark:bg-slate-700"></div> */}
                </div>
                <div className='font-light overflow-hidden text-ellipsis text-sm whitespace-nowrap'>
                    {IfMessage(Message)}
                </div>
            </div>
        </Link>
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
