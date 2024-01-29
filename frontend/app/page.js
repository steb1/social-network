import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<main>
			<h1 className="text-6xl font-bold ">welcome</h1>
			<Link href="auth/signup" className="btn btn-primary ">
				Signup
			</Link>
		</main>
	);
}
