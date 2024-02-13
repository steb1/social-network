import React from "react";

const NoPostUI = () => {
	return (
		<div className="bg-white rounded-xl shadow-sm text-sm font-medium border1 min-w-[600px] h-96 dark:bg-dark2">
			<div className="sm:px-4 p-2.5 pt-0">
				<div className="relative w-full lg:h-96 h-full sm:px-4 flex flex-col  items-center justify-center">
					<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M12.012 2.004C6.492 2 2.013 6.474 2.01 11.994S6.48 21.993 12 21.996a9.996 9.996 0 0 0 10.002-9.99c.003-5.52-4.47-9.999-9.99-10.002m0 18.992A8.996 8.996 0 1 1 12 3.004a8.996 8.996 0 0 1 .012 17.992M12.707 12l3.182-3.182a.5.5 0 0 0-.707-.707L12 11.293L8.818 8.111a.5.5 0 0 0-.707.707L11.293 12l-3.182 3.182a.5.5 0 0 0 .707.707L12 12.707l3.182 3.182a.5.5 0 0 0 .707-.707z"
						/>
					</svg>
					<br />
					<h1 className="text-xl text-gray-500">NO PUBLICATION</h1>
				</div>
			</div>
		</div>
	);
};

export default NoPostUI;
