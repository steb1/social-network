// middleware/authMiddleware.js
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const authMiddleware = (handler, serverUrl) => async (req, res) => {
	const cookieStore = cookies();
	const token = cookieStore.get("cocial-network");

	console.log(token);

	if (!token) {
		redirect("/auth/signin");
	}

	const response = await fetch(serverUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ token }),
	});

	if (response.status === 200) {
		// Si le serveur renvoie OK, laisser passer la requête
		return handler(req, res);
	} else {
		// Si le serveur renvoie 401, rediriger vers la page de login
		redirect("/auth/signin");
	}
};

export default authMiddleware;
