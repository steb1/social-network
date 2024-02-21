import React from "react";
import "../../public/assets/css/typing.css";

const TypingIndicator = ({ Avatar }) => {
	return (
		<div id="indicator" className="flex gap-3 items-end">
			<img src={`http://localhost:8080/img/${Avatar}`} alt="" className="w-9 h-9 rounded-full shadow" />
			<div className="px-4 py-2 rounded-[20px] max-w-sm ">
				<div className="typing-indicator">
					<div class="three col">
						<div class="loader" id="loader-2">
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TypingIndicator;
