"use client";
import React, { useState } from "react";
import Link from "next/link";

const SeeFollowersFollowees = ({ followersFollowees, visibility, text, modalId }) => {
	const handleClick = () => {
		if (visibility !== "Private" && followersFollowees && followersFollowees.length > 0) {
			document.getElementById(modalId).showModal();
		}
	};

	return (
		<div>
			<button onClick={handleClick}>
				<span className={`${visibility === "Private" ? "cursor-text" : "cursor-pointer"}`}>{text}</span> <span className={`text-black text-sm pl-2 font-bold lg:inline-block hidden ${visibility === "Private" ? "cursor-text" : "cursor-pointer"}`}>{followersFollowees ? followersFollowees.length : 0}</span>
			</button>

			<dialog id={modalId} className="modal overflow-auto max-h-[100vh]">
				<div className="modal-box">
					<h3 className="font-bold text-lg">{text}</h3>

					<div className="grid grid-cols-3 gap-2 gap-y-5 text-center text-sm mt-4 mb-2">
						{followersFollowees &&
							followersFollowees.map((follower) => (
								<Link href={`/profile/${follower.user_id}`} key={follower.user_id}>
									<div>
										<div className="relative w-full aspect-square rounded-lg overflow-hidden">
											<img src={`http://localhost:8080/img/${follower.avatar}`} alt="" className="object-cover w-full h-full inset-0" />
										</div>
										<div className="mt-2 line-clamp-1">{`${follower.first_name} ${follower.last_name}`}</div>
									</div>
								</Link>
							))}
					</div>
				</div>
				<form method="dialog" className="modal-backdrop">
					<button>close</button>
				</form>
			</dialog>
		</div>
	);
};

export default SeeFollowersFollowees;
