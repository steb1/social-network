import Link from "next/link";
import React from "react";
import Animation from "../../components/animation";
import authAnimation from "../../../public/assets/animations/authAnimation.json";

const SigninPage = () => {
	return (
		<div className="flex justify-center items-center w-full min-h-screen  px-5 py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-10 text-white font-sans">
			<div className="xl:max-w-7xl bg-white drop-shadow-xl border border-black/20 w-full rounded-md flex justify-between items-stretch px-5 xl:px-5 py-5">
				{/* <div className="sm:w-[60%] lg:w-[50%] bg-cover bg-center items-center justify-center hidden md:flex ">
					// Add usericon image
					<Animation animationData={authAnimation} />
				</div> */}
				<div className="mx-auto w-full lg:w-1/2 md:p-10 py-5 md:py-0">
					<h1 className="text-center text-3xl font-sans  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">The Social Network</h1>
					<div className="w-full mt-5 sm:mt-8">
						<div className="mx-auto w-full sm:max-w-md md:max-w-lg flex flex-col gap-5">
							<input type="text" placeholder="Email or Nickname" className="input input-bordered input-primary w-full" />

							<input type="Password" placeholder="Password" className="input input-bordered input-primary w-full" />

							<div className="flex items-center gap-1.5  justify-start pl-2">
								<h3 className="flex items-center whitespace-nowrap text-xs text-black">
									Welcome to the social network ! Made with
									<span className="text-[#4A07DA]">&nbsp;Love ❤️</span>
									&nbsp;and
									<span className="text-[#4A07DA]">&nbsp;coffee ☕</span>.
								</h3>
							</div>

							<div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center">
								<Link href="/auth/signup" className="btn btn-outline btn-primary btn-block max-w-[200px]">
									Sign Up
								</Link>
								<Link href="/auth/signin" className="btn btn-active btn-primary btn-block max-w-[200px]">
									Sign In
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SigninPage;
