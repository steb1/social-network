// config.js

const config = {
	serverApiUrl:process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/",
	ServerApiImage:process.env.NEXT_PUBLIC_API_URL_IMG || "http://localhost:8080/img/",
	cookieName: "social-network",
};

export default config;
