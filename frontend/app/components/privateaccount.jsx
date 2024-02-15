import React from "react";

const PrivateAccountUI = () => {
	return (
		<div className="flex flex-col items-center  gap-y-2  h-[300px]">
			<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24" className="mt-4">
				<path fill="currentColor" d="M5.5 7.5a6.5 6.5 0 0 1 13 0V9H21v14H3V9h2.5zm2 1.5h9V7.5a4.5 4.5 0 1 0-9 0zM5 11v10h14V11zm2 1.504h2.004V15H7zM7 16.5h2.004v2.504H7z" />
			</svg>
			<h1 className="text-black text-center  text-lg">This account is private</h1>
			<h1 className="text-black text-center  text-lg"> Follow to see his post(s) and infos.</h1>
		</div>
	);
};

export default PrivateAccountUI;
