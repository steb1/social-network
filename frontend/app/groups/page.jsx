import React from "react";
import { cookies } from "next/headers";
import AllGroup from "./components/AllGroup";

export async function fetchAllGroups() {
    const cookieStore = cookies();
    const token = cookieStore.get("social-network").value;
    if (token) {
        // Use the token as needed
        console.log("Token:", token);
    } else {
        console.log("Token not found in cookies");
    }

    try {
        const response = await fetch(config.serverApiUrl + "getAllGroups", {
            method: "GET",
            headers: {
                Authorization: token,
            },
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Wshhhhhhh ?????");
            console.log(data, "----------- data");
            return data;
        } else {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.error || "An error occurred.";
            console.error("No Group retrieved:", errorMessage);
            setServerError(`No Group retrieved: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error while fetching groups:", error);
    }
}

const Group = async () => {
    const data = await fetchAllGroups();
    console.log(data);
    return (
        <div>
            <AllGroup DataGroup={data} />
        </div>
    );
};

export default Group;
