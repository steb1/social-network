import AuthMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { PendingList } from "../components/PendingList";
import Layout from "../components/Layout";

async function Notifications() {
	const cookieStore = cookies();
	let persons;
	try {
		const response = await fetch(`${config.serverApiUrl}pendingrequests`, {
			cache: "no-cache",
			method: "GET",
			headers: {
				Authorization: cookieStore.get("social-network").value,
			},
		});
		if (response.ok) {
			const data = await response.json();
			if (data) {
				persons = data;
			} else {
				persons = [];
			}
		} else {
			console.log(response);
		}
	} catch (error) {
		console.error("Error fetching data:", error);
	}

	return (
		<Layout>
			<div className="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-0 mt-0">
				<PendingList Persons={persons} cookie={cookieStore.get("social-network").value} />
			</div>
		</Layout>
	);
}
export default AuthMiddleware(Notifications, config.serverApiUrl + "checkAuth");
