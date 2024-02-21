import React from "react";

const RightMessage = ({ Avatar, Content }) => {
	return (
		<div className="flex gap-2 flex-row-reverse items-end">
			<img src={`http://localhost:8080/img/${Avatar}`} alt="" className="w-5 h-5 rounded-full shadow" />
			<div className="px-4 py-2 rounded-[20px] max-w-sm bg-gradient-to-tr from-sky-500 to-blue-500 text-white shadow">
				<pre> {Content} </pre>
			</div>
		</div>
	);
};

export default RightMessage;
