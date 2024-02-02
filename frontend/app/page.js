import Link from "next/link";
import authMiddleware from "@/middleware/authMiddleware";
import config from "@/config";

function Home() {
	return (
		<main>
			<h1 className="font-primary text-6xl font-bold">welcome</h1>
			<Link href="auth/signup" className="btn btn-primary ">
				Signup
			</Link>
		</main>
	);
}

export default authMiddleware(Home, config.serverApiUrl + "home");
