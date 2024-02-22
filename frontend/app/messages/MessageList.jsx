"use client";
import React, { useEffect } from "react";
import RightMessage from "./RightMessage";
import LeftMessage from "./LeftMessage";

const [messages, setMessages] = useState([]);

const MessageList = ({ Messages, Avatar, Content, Chatter }) => {
    useEffect(() => {
        // Update the local state when the prop changes
        setMessages(Messages);
    }, [Messages]);
    return (
        <>
            {messages && messages.length > 0 ? (
                <div id='cms' ref={cmsRef} className='text-sm font-medium space-y-6'>
                    {messages.map((message) => {
                        if (message.sender === Sender) {
                            <RightMessage Avatar={AvatarSender} Content={message.content} />;
                        } else {
                            <LeftMessage Avatar={Chatter[0].avatar} Content={message.content} />;
                        }
                    })}
                </div>
            ) : (
                <p>No messages.</p>
            )}
        </>
    );
};

export default MessageList;
