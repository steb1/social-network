import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1 className="font-primary text-6xl font-bold">welcome</h1>
      <Link href="auth/signup" className="btn btn-primary ">
        Signup
      </Link>
      <Link href="allPost" className="btn btn-primary ">
        AllPost
      </Link>
      <Link href="createPost" className="btn btn-primary ">
       CreatePost
      </Link>
    </main>
  );
}
