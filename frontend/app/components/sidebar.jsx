"use server";

import Link from "next/link";
import React from "react";
import config from "@/config";
import { cookies } from "next/headers";
import { CreateGroup } from "./createGroup";
import { notFound } from "next/navigation";

const Sidebar = async () => {
	const cookieStore = cookies();
	let user = null;

	try {
		const response = await fetch(`${config.serverApiUrl}checkAuth`, {
			method: "GET",
			headers: {
				Authorization: cookieStore.get("social-network").value,
			},
		});

		if (response.ok) {
			user = await response.json();
		} else {
			return notFound();
		}
	} catch {
		return notFound();
	}

	return (
		<div id="site__sidebar" className="fixed top-0 left-0 z-[99] pt-[--m-top] overflow-hidden transition-transform xl:duration-500 max-xl:w-full max-lg:-translate-x-full">
			<div className="p-2 max-xl:bg-white shadow-sm 2xl:w-72 sm:w-64 w-[80%] h-[calc(100vh-64px)] relative z-30 max-lg:border-r dark:max-xl:!bg-slate-700 dark:border-slate-700 dark:!bg-slate-800 ">
				<div className="pr-6 pt-10" data-simplebar>
					<nav id="side">
						<ul className="grid gap-y-5">
							<li className="dark:hover:text-slate-800">
								<Link href="/">
									<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" className="w-6">
										<path
											fill="currentColor"
											d="M12 16.688q.142 0 .276-.043q.134-.043.247-.14q.606-.56 1.148-1.088q.542-.527.954-1.033q.412-.506.66-.983q.25-.478.25-.928q0-.834-.57-1.385q-.57-.55-1.367-.55q-.494 0-.897.205t-.701.515q-.26-.31-.678-.515q-.418-.205-.875-.205q-.8 0-1.372.548q-.571.548-.571 1.38q0 .453.238.937q.239.484.651.985q.413.502.952 1.031q.539.53 1.134 1.077q.111.106.245.15q.134.042.276.042M6.615 20q-.666 0-1.14-.475Q5 19.051 5 18.385v-7.53l-1.538 1.199q-.177.134-.366.104q-.188-.031-.323-.208t-.11-.365q.024-.189.195-.323l8.148-6.26q.224-.162.478-.242q.254-.081.519-.081q.264 0 .51.08q.246.081.462.243l8.173 6.26q.171.134.192.323q.022.188-.113.369q-.135.167-.323.198q-.189.03-.36-.104L19 10.856v7.529q0 .666-.475 1.14q-.474.475-1.14.475z"
										/>
									</svg>
									<span className="text-base "> Home </span>
								</Link>
							</li>
							<li className="dark:hover:text-slate-800">
								<Link href="/groups">
									<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24">
										<path
											fill="currentColor"
											d="M10.27 12h3.46a1.5 1.5 0 0 0 1.48-1.75l-.3-1.79a2.951 2.951 0 0 0-5.82.01l-.3 1.79c-.15.91.55 1.74 1.48 1.74m-8.61-.89c-.13.26-.18.57-.1.88c.16.69.76 1.03 1.53 1h1.95c.83 0 1.51-.58 1.51-1.29c0-.14-.03-.27-.07-.4c-.01-.03-.01-.05.01-.08c.09-.16.14-.34.14-.53c0-.31-.14-.6-.36-.82c-.03-.03-.03-.06-.02-.1c.07-.2.07-.43.01-.65a1.12 1.12 0 0 0-.99-.74a.09.09 0 0 1-.07-.03C5.03 8.14 4.72 8 4.37 8c-.3 0-.57.1-.75.26c-.03.03-.06.03-.09.02a1.24 1.24 0 0 0-1.7 1.03c0 .02-.01.04-.03.06c-.29.26-.46.65-.41 1.05c.03.22.12.43.25.6c.03.02.03.06.02.09m14.58 2.54c-1.17-.52-2.61-.9-4.24-.9c-1.63 0-3.07.39-4.24.9A2.988 2.988 0 0 0 6 16.39V18h12v-1.61c0-1.18-.68-2.26-1.76-2.74m-15.02.93A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29c-.37-.06-.74-.1-1.13-.1c-.99 0-1.93.21-2.78.58m21.56 0A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1c.4.68.63 1.46.63 2.29V18H24v-1.57c0-.81-.48-1.53-1.22-1.85M22 11v-.5c0-1.1-.9-2-2-2h-2c-.42 0-.65.48-.39.81l.7.63c-.19.31-.31.67-.31 1.06c0 1.1.9 2 2 2s2-.9 2-2"
										/>
									</svg>
									<span className="text-base"> Groups </span>
								</Link>
							</li>
							<li className="dark:hover:text-slate-800">
								<Link href={`/messages/${user?.nickname ? user.nickname : user.email}`}>
									<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
										<path fill="currentColor" d="M15.85 8.14c.39 0 .77.03 1.14.08C16.31 5.25 13.19 3 9.44 3c-4.25 0-7.7 2.88-7.7 6.43c0 2.05 1.15 3.86 2.94 5.04L3.67 16.5l2.76-1.19c.59.21 1.21.38 1.87.47c-.09-.39-.14-.79-.14-1.21c-.01-3.54 3.44-6.43 7.69-6.43M12 5.89a.96.96 0 1 1 0 1.92a.96.96 0 0 1 0-1.92M6.87 7.82a.96.96 0 1 1 0-1.92a.96.96 0 0 1 0 1.92" />
										<path fill="currentColor" d="M22.26 14.57c0-2.84-2.87-5.14-6.41-5.14s-6.41 2.3-6.41 5.14s2.87 5.14 6.41 5.14c.58 0 1.14-.08 1.67-.2L20.98 21l-1.2-2.4c1.5-.94 2.48-2.38 2.48-4.03m-8.34-.32a.96.96 0 1 1 .96-.96c.01.53-.43.96-.96.96m3.85 0a.96.96 0 1 1 0-1.92a.96.96 0 0 1 0 1.92" />
									</svg>
									<span className="text-base"> Messages </span>
								</Link>
							</li>

							<CreateGroup />

							<li className="dark:hover:text-slate-800">
								<Link href={`/profile/${user?.user_id}`}>
									<div className="avatar">
										<div className="w-7 rounded-full">
											<img src={`${config.ServerApiImage}${user?.avatar}`} />
										</div>
									</div>
									<span className="text-base"> {user?.nickname || user?.email} </span>
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>

			<div id="site__sidebar__overly" className="absolute top-0 left-0 z-20 w-screen h-screen sm:hidden backdrop-blur-sm" uk-toggle="target: #site__sidebar ; cls :!-translate-x-0"></div>
		</div>
	);
};

export default Sidebar;
