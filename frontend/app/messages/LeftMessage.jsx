import React from "react";

const LeftMessage = ({ Avatar, Content }) => {
	return (
		<div className="flex gap-3">
			<img src={`http://localhost:8080/img/${Avatar}`} alt="" className="w-9 h-9 rounded-full shadow" />
			<div className="px-4 py-2 rounded-[20px] max-w-sm bg-secondery">
				<pre> {Content} </pre>
			</div>
		</div>
	);
};

export default LeftMessage;
