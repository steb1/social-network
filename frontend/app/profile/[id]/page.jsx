import React from "react";
import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
import MainProfile from "@/app/components/mainProfile";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

const Profile = async ({ params: { id } }) => {
	const cookieStore = cookies();
	let profileData = null;

	try {
		const response = await fetch(`${config.serverApiUrl}profile?id=${id}`, {
			method: "GET",
			headers: {
				Authorization: cookieStore.get("social-network").value,
			},
		});

		if (response.ok) {
			profileData = await response.json();
		} else {
			return notFound();
		}
	} catch {
		return notFound();
	}

	let Visibility = "";

	if (profileData.accountType === "Private") {
		Visibility =
			profileData.id_requester == profileData.user_id
				? "Public"
				: // if followers array exists and is not null
					profileData.followers && Array.isArray(profileData.followers) && profileData.followers.length > 0
					? profileData.followers.some((follower) => follower.user_id == profileData.id_requester)
						? "Public"
						: "Private"
					: "Private";
	}

	return (
		<div id="wrapper" className="pt-15 space-x-2">
			{/* Header */}
			<Header />

			<div className="flex mt-5">
				{/* Fixed Sidebar */}
				<div className="fixed mt-2 left-0 top-12 max-sm:hidden max-md:hidden max-lg:hidden  overflow-y-visible touch-none h-full">
					<Sidebar />
				</div>

				<MainProfile props={profileData} Visibility={Visibility} />
			</div>
		</div>
	);
};

export default authMiddleware(Profile, config.serverApiUrl + "checkAuth");
