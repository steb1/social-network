import React from "react";
import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import MainMessage from "@/app/components/mainMessage";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const Messages = async ({ params: { id } }) => {
	return (
		<div id="wrapper">
			<Header />

			<Sidebar />

			<MainMessage />
		</div>
	);
};

export default authMiddleware(Messages, config.serverApiUrl + "checkAuth");
