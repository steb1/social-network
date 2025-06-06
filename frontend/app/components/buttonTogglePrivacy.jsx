"use client";
import React, { useState } from "react";
import config from "@/config";
import { CustomAlert } from "@/app/components/CustomAlert";

const ButtonTogglePrivacy = ({ accountType, cookie }) => {
	const [isPrivate, setIsPrivate] = useState(accountType === "Private");
	const [showAlert, setShowAlert] = useState(false);

	const togglePrivacy = async () => {
		try {
			const targetType = isPrivate ? "Public" : "Private";
			const response = await fetch(`${config.serverApiUrl}toggleProfilePrivacy?type=${targetType}`, {
				method: "GET",
				cache: "no-cache",
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
				<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24">
					<path
						fill="currentColor"
						d="M14.5 23q-.625 0-1.062-.437T13 21.5v-7q0-.625.438-1.062T14.5 13h7q.625 0 1.063.438T23 14.5v7q0 .625-.437 1.063T21.5 23zm0-1.5h7v-.8q-.625-.775-1.525-1.237T18 19q-1.075 0-1.975.463T14.5 20.7zM18 18q.625 0 1.063-.437T19.5 16.5q0-.625-.437-1.062T18 15q-.625 0-1.062.438T16.5 16.5q0 .625.438 1.063T18 18m-5.95-9.5q-1.45 0-2.475 1.025T8.55 12q0 1.2.675 2.1T11 15.35V13.1q-.2-.2-.325-.513T10.55 12q0-.625.438-1.062t1.062-.438q.35 0 .625.138t.475.362h2.25q-.325-1.1-1.237-1.8t-2.113-.7M9.25 22l-.4-3.2q-.325-.125-.612-.3t-.563-.375L4.7 19.375l-2.75-4.75l2.575-1.95Q4.5 12.5 4.5 12.338v-.675q0-.163.025-.338L1.95 9.375l2.75-4.75l2.975 1.25q.275-.2.575-.375t.6-.3l.4-3.2h5.5l.4 3.2q.325.125.613.3t.562.375l2.975-1.25l2.75 4.75L19.925 11H17.4q-.025-.125-.05-.262t-.075-.263l2.15-1.625l-.975-1.7l-2.475 1.05q-.55-.575-1.213-.962t-1.437-.588L13 4h-1.975l-.35 2.65q-.775.2-1.437.588t-1.213.937L5.55 7.15l-.975 1.7l2.15 1.6q-.125.375-.175.75t-.05.8q0 .4.05.775t.175.75l-2.15 1.625l.975 1.7l2.475-1.05q.6.625 1.35 1.05T11 17.4V22z"
					/>
				</svg>
				<span className="text-sm">{buttonText}</span>
			</button>

			{showAlert && <CustomAlert message={<span>{`Your account successfully turned ${isPrivate ? "private" : "public"}`}</span>} onClose={() => setShowAlert(false)} />}
		</div>
	);
};

export default ButtonTogglePrivacy;
