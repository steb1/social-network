import Header from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";
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
        <div id='wrapper' className='h-full flex flex-col'>
            <Header />
            {/* Fixed Sidebar */}
            <div className='flex flex-row'>
                <div
                    className=' ml-2 left-0 max-sm:hidden max-md:hidden max-lg:hidden  overflow-y-visible touch-none h-80'
                    uk-sticky=''
                >
                    <Sidebar />
                </div>

                <PendingList Persons={persons} cookie={cookieStore.get("social-network").value} />
            </div>
        </div>
    );
}
export default authMiddleware(Notifications, config.serverApiUrl + "checkAuth");
