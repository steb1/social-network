import Link from "next/link";
import AuthMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import HomePage from "./home/page";

function Home() {
	return <HomePage />;
}

export default AuthMiddleware(Home, config.serverApiUrl + "checkAuth");
