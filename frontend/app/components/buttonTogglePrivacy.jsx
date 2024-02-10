"use client";
import React, { useState } from "react";
import config from "@/config";

const ButtonTogglePrivacy = ({ accountType, cookie }) => {
	const [isPrivate, setIsPrivate] = useState(accountType === "Private");

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
		<button className="button bg-primary flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1" onClick={togglePrivacy}>
			<ion-icon name="add-circle" className="text-xl"></ion-icon>
			<span className="text-sm">{buttonText}</span>
		</button>
	);
};

export default ButtonTogglePrivacy;
