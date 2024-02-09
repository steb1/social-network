import React from "react";
import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import { Rightbar } from "@/app/components/rightbar";
import MainProfile from "@/app/components/mainProfile";

const Profile = async ({ params: { id } }) => {
	let profileData = null;
	console.log("🚀 ~ Profile ~ profileData:", profileData);
	try {
		const response = await fetch(`${config.serverApiUrl}profile?id=${id}`, {
			method: "GET",
		});

		if (response.ok) {
			profileData = await response.json();
			console.log("Profile fetched successfully:", profileData);
		} else {
			const errorText = await response.text();
			console.error("Profile not fetched successfully:", errorText);
		}
	} catch (error) {
		console.error("Error during fetching profile:", error);
	}

	const myStyles = {
		marginRight: "1em",
		// Add more style properties as needed
	};

	return (
		<div id="wrapper" className="pt-15 space-x-2">
			{/* Header */}
			<Header />

			<div className="flex mt-5">
				{/* Fixed Sidebar */}
				<div className="fixed mt-2 left-0 top-12 max-sm:hidden max-md:hidden max-lg:hidden  overflow-y-visible touch-none h-full">
					<Sidebar />
				</div>

				<MainProfile />
			</div>
		</div>
	);
};

export default authMiddleware(Profile, config.serverApiUrl + "checkAuth");
