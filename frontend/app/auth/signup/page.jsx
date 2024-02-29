"use server";
import React from "react";
import Animation from "@/app/components/animation";
import authAnimation from "../../../public/assets/animations/authAnimation.json";
import FormSignupComp from "./FormSignupComp";
import AuthMiddleware from "@/middleware/authMiddleware";
import config from "@/config";

const SignupPage = () => {
	return (
		<div className="flex min-h-screen w-full items-center justify-center   p-10 px-5 py-5 font-sans text-white">
			<div className="flex w-full items-stretch justify-between rounded-md border border-black/20 bg-white px-5 py-5 drop-shadow-xl xl:max-w-7xl xl:px-5">
				<div className="hidden items-center justify-center bg-cover bg-center sm:w-[60%] md:flex lg:w-[50%] ">
					<Animation animationData={authAnimation} />
				</div>
				<div className="mx-auto w-full py-5 md:p-10 md:py-0 lg:w-1/2">
					<h1 className="bg-clip-text text-center font-instalogo text-5xl text-black ">The Social Network</h1>
					<div className="mt-5 w-full sm:mt-8">
						<FormSignupComp />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AuthMiddleware(SignupPage, config.serverApiUrl + "checkAuth", true);
