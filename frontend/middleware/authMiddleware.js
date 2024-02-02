// middleware/authMiddleware.js
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const authMiddleware = (handler, serverUrl) => async (req, res) => {
    const cookieStore = cookies();
    const token = cookieStore.get("social-network");

    console.log(token);

    if (!token) {
        console.log("No token");
        redirect("/auth/signin");
    }

    const response = await fetch(serverUrl, {
        method: "GET",
        headers: {
            Authorization: `${token}`,
        },
    });

    if (response.status === 200) {
        // Si le serveur renvoie OK, laisser passer la requête
        console.log("OKKK");
        return handler(req, res);
    } else if (response.status === 400) {
        // Si le serveur renvoie 401, rediriger vers la page de login
        console.log("401");
        redirect("/auth/signin");
    } else {
        console.log(response);
    }
};

export default authMiddleware;
