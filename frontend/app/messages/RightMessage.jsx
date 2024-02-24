import React from "react";
import config from "@/config";

const RightMessage = ({ Avatar, Content }) => {
    return (
        <div className='chat chat-end'>
            <div className='chat-image avatar'>
                <div className='w-10 rounded-full'>
                    <img alt='Avatar Img' src={`${config.ServerApiImage}${Avatar}`} />
                </div>
            </div>
            <div className='chat-header'>
                {/* {message.sender}
				<time className="text-xs opacity-50"> {message.sent_time}</time> */}
            </div>
            <div className='chat-bubble max-w-sm bg-sky-500/100 from-sky-500 to-blue-500 text-white'>{Content}</div>
        </div>
    );
};

export default RightMessage;
