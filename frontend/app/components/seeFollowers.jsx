"use client";
import React, { useState } from "react";
import Link from "next/link";

const SeeFollowers = ({ followers, visibility }) => {
	const handleClick = () => {
		if (visibility !== "Private" && followers.length > 0) {
			document.getElementById("my_modal_2").showModal();
		}
	};

	return (
		<div>
			<button onClick={handleClick}>
				<span className={`${visibility === "Private" ? "cursor-text" : "cursor-pointer"}`}>Follower(s)</span> <span className={`text-black text-sm pl-2 font-bold lg:inline-block hidden ${visibility === "Private" ? "cursor-text" : "cursor-pointer"}`}>{followers ? followers.length : 0}</span>
			</button>

			<dialog id="my_modal_2" className="modal">
				<div className="modal-box">
					<h3 className="font-bold text-lg">Follower(s)</h3>

					<div className="grid grid-cols-3 gap-2 gap-y-5 text-center text-sm mt-4 mb-2">
						{followers &&
							followers.map((follower) => (
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

export default SeeFollowers;
