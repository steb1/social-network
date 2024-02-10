"use client";
import config from "@/config";
import { useRouter } from "next/navigation";

const ButtonTogglePrivacy = ({ accountType, cookie }) => {
	const router = useRouter();

	const togglePrivacy = async () => {
		try {
			const targetType = accountType === "Private" ? "Public" : "Private";
			const response = await fetch(`${config.serverApiUrl}toggleProfilePrivacy?type=${targetType}`, {
				method: "GET",
				headers: {
					Authorization: `${cookie}`,
				},
			});

			if (response.ok) {
			} else {
				const errorText = await response.text();
				console.error("Profile not changed successfully:", errorText);
			}
		} catch (error) {
			console.error("Error during changing profile privacy:", error);
		}
	};

	return (
		<button className="button bg-primary flex items-center gap-2 text-white py-2 px-3.5 max-md:flex-1" onClick={togglePrivacy}>
			<ion-icon name="add-circle" className="text-xl"></ion-icon>
			<span className="text-sm">{accountType === "Private" ? "Turn my account to public" : "Turn my account to private"}</span>
		</button>
	);
};

export default ButtonTogglePrivacy;
