"use server";
import Animation from "../../components/animation";
import authAnimation from "../../../public/assets/animations/authAnimation.json";
import FormSignInComp from "./FormSignInComp";
import AuthMiddleware from "@/middleware/authMiddleware";
import config from "@/config";

const SigninPage = () => {
	return (
		<div className="flex min-h-screen w-full items-center justify-center dark:bg-slate-800  p-10 px-5 py-5 font-sans text-white">
			<div className="flex w-full dark:bg-slate-800  items-stretch justify-between rounded-md border border-black/20 bg-white px-5 py-5 drop-shadow-xl xl:max-w-7xl xl:px-5">
				<div className="hidden items-center justify-center bg-cover bg-center sm:w-[60%] md:flex lg:w-[50%] ">
					<Animation animationData={authAnimation} />
				</div>
				<div className="mx-auto w-full flex flex-col justify-center lg:w-1/2">
					<h1 className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-center font-instalogo text-5xl text-black ">The Social Network</h1>
					<div className="mt-5 w-full sm:mt-8">
						<FormSignInComp />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthMiddleware(SigninPage, config.serverApiUrl + "checkAuth", true);
