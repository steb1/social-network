import { cookies } from "next/headers";

const setSocialNetworkCookie = (value) => {
	cookies.set("social-network", value, {
		path: "/",
		expires: 3 / 24, // 3 hours in days
	});
};

export default setSocialNetworkCookie;
