// middleware/authMiddleware.js
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const authMiddleware = (handler, serverUrl) => async (req, res) => {
	const cookieStore = cookies();
	const token = cookieStore.get("social-network");

	!token ? redirect("/auth/signin") : null;

	const response = await fetch(serverUrl, {
		method: "GET",
		headers: {
			Authorization: `${token.value}`,
		},
	});

	if (response.status === 200) {
		const isSignInOrSignUpPage = req.url === "/auth/signin" || req.url === "/auth/signup";

		if (isSignInOrSignUpPage) {
			console.log(req.url);
			// redirect("/");
		}

		return handler(req, res);
	} else {
		redirect("/auth/signin");
	}
};

export default authMiddleware;
