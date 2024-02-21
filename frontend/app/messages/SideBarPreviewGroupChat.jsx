import React from "react";
import Link from "next/link";

const SideBarPreviewGroupChat = ({ PrenomNom, avatar, To }) => {
	return (
		<Link href={`/messages/${To}`} className="relative flex items-center gap-4 p-2 duration-200 rounded-xl hover:bg-secondery">
			{/* <div className="relative w-14 h-14 shrink-0">
				<img src={`http://localhost:8080/img/${avatar}`} alt="" className="object-cover w-full h-full rounded-full" />
				<div className="w-4 h-4 absolute bottom-0 right-0  bg-green-500 rounded-full border border-white dark:border-slate-800"></div>
			</div> */}
			<div className="avatar-group -space-x-6 rtl:space-x-reverse">
				<div className="avatar">
					<div className="w-12">
						<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
					</div>
				</div>
				<div className="avatar">
					<div className="w-12">
						<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
					</div>
				</div>
				<div className="avatar">
					<div className="w-12">
						<img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
					</div>
				</div>
				<div className="avatar placeholder">
					<div className="w-12 bg-neutral text-neutral-content">
						<span>+5</span>
					</div>
				</div>
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-2 mb-1.5">
					<div className="mr-auto text-sm text-black dark:text-white font-medium">Team Ouz bi gang</div>
					{/* <div className="text-xs font-light text-gray-500 dark:text-white/70">09:40AM</div> */}
					{/* If message read remove this next line */}
					{/* <div className="w-2.5 h-2.5 bg-blue-600 rounded-full dark:bg-slate-700"></div> */}
				</div>
				{/* <div className="font-medium overflow-hidden text-ellipsis text-sm whitespace-nowrap">Love your photos 😍</div> */}
			</div>
		</Link>
	);
};

export default SideBarPreviewGroupChat;
