import React from "react";
import config from "@/config";
import { GetTime } from "./RightMessage";

const LeftMessage = ({ Avatar, Content, Sender, Time }) => {
	return (
		<div className="chat chat-start">
			<div className="chat-image avatar">
				<div className="w-10 rounded-full">
					<img alt="Avatar component" src={`${config.ServerApiImage}${Avatar}`} />
				</div>
			</div>
			<div className="chat-header">
				&nbsp;{Sender}
				&nbsp;<time className="text-xs opacity-50">{GetTime(Time)}</time>
			</div>
			<div className="chat-bubble max-w-sm bg-secondery text-[#4B5563] break-words whitespace-pre-line">{Content}</div>
		</div>
	);
};

export default LeftMessage;
