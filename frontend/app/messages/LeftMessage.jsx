import React from "react";
import config from "@/config";

const LeftMessage = ({ Avatar, Content }) => {
	return (
		<div className="chat chat-start">
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img alt="Avatar component" src={`${config.ServerApiImage}${Avatar}`} />
				</div>
			</div>
			<div className="chat-header">
				{/* {message.sender}
                <time className='text-xs opacity-50'>{message.sent_time}</time> */}
			</div>
			<div className="chat-bubble max-w-sm bg-secondery text-[#4B5563]">{Content}</div>
		</div>
	);
};

export default LeftMessage;
