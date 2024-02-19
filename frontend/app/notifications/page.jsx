import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { PendingList } from "../components/PendingList";

async function Notifications() {
    const cookieStore = cookies();
    let persons;
    try {
        const response = await fetch(`${config.serverApiUrl}pendingrequests`, {
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
        <>
            <PendingList Persons={persons} cookie={cookieStore.get("social-network").value} />
        </>
    );
}
export default authMiddleware(Notifications, config.serverApiUrl + "checkAuth");
