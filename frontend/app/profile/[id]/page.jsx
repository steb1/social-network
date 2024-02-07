import React from "react";
import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";

const Profile = async ({ params: { id } }) => {
	let profileData = null;
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

	return (
		<>
			<h1>Profile</h1>
			<br />
			<h2>{`${profileData.firstName} ${profileData.lastName} alias ${profileData.nickname}`}</h2>
			<br />
			<h2>{profileData.aboutMe}</h2>
			<br />
			<div className></div>
			<div className="flex flex-row align-items">
				<div className="avatar">
					<div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
						<img src={`http://localhost:8080/img/${profileData.avatar}`} alt="User Avatar" />
					</div>
				</div>
			</div>
			<br />
			<div className="flex flex-col align-items">
				<h2>{!profileData.followers ? "0 followers" : null}</h2>
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
							<span>+99</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default authMiddleware(Profile, config.serverApiUrl + "checkAuth");
