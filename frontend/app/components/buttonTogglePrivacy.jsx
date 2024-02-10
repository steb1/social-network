"use client";
import React, { useState } from "react";
import config from "@/config";

const ButtonTogglePrivacy = ({ accountType, cookie }) => {
	const [isPrivate, setIsPrivate] = useState(accountType === "Private");
	const [showAlert, setShowAlert] = useState(false);

	const togglePrivacy = async () => {
		try {
			const targetType = isPrivate ? "Public" : "Private";
			const response = await fetch(`${config.serverApiUrl}toggleProfilePrivacy?type=${targetType}`, {
				method: "GET",
				headers: {
					Authorization: `${cookie}`,
				},
			});

			if (response.ok) {
				setIsPrivate(!isPrivate);
				setShowAlert(true);
			} else {
				const errorText = await response.text();
				console.error("Profile not changed successfully:", errorText);
			}
		} catch (error) {
			console.error("Error during changing profile privacy:", error);
		}
	};

	const buttonText = isPrivate ? "Turn my account to public" : "Turn my account to private";

	return (
		<div>
			<button className="button bg-primary flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1" onClick={togglePrivacy}>
				<ion-icon name="add-circle" className="text-xl"></ion-icon>
				<span className="text-sm">{buttonText}</span>
			</button>

			{showAlert && <CustomAlert message={<span>{`Your account successfully turned ${isPrivate ? "private" : "public"}`}</span>} onClose={() => setShowAlert(false)} />}
		</div>
	);
};

export default ButtonTogglePrivacy;

const CustomAlert = ({ message, onClose }) => {
	return (
		<div className="fixed top-4 right-4 z-[300]">
			<div role="alert" className="alert">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				{message}
				<div>
					<button className="btn btn-sm btn-outline btn-info" onClick={onClose}>
						OK
					</button>
				</div>
			</div>
		</div>
	);
};
