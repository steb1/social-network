import React from "react";
import Link from "next/link";
import config from "@/config";

const SideBarPreviewGroupChat = ({ ID, GroupName, Users, Message, Time }) => {
    const displayedUsers = Users.slice(0, 3);
    const remainingUsersCount = Users.length - displayedUsers.length;

    return (
        <Link
            href={`/messages/${ID}`}
            className='relative flex items-center gap-4 p-2 duration-200 rounded-xl dark:hover:white-400'
        >
            <div className='avatar-group -space-x-6 rtl:space-x-reverse'>
                {displayedUsers.map((user, index) => (
                    <div key={index} className='avatar'>
                        <div className='w-12'>
                            <img src={`${config.ServerApiImage}/${user.Avatar}`} alt={`User ${index + 1}`} />
                        </div>
                    </div>
                ))}
                {remainingUsersCount > 0 && (
                    <div key='placeholder' className='avatar placeholder'>
                        <div className='w-12 bg-neutral text-neutral-content'>
                            <span>+{remainingUsersCount}</span>
                        </div>
                    </div>
                )}
            </div>

            <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1.5'>
                    <div className='mr-auto text-sm text-black dark:text-white font-medium'>{GroupName}</div>
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

export default SideBarPreviewGroupChat;

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
