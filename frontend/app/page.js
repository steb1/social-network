import Link from "next/link";
import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";
import HomePage from "./home/page";

function Home() {
    return <HomePage />;
}

export default Home;

//export default authMiddleware(Home, config.serverApiUrl + "checkAuth");
