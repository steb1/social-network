import Link from "next/link";
import React from "react";
import Animation from "../../components/animation";
import authAnimation from "../../../public/assets/animations/authAnimation.json";

const SigninPage = () => {
	return (
		<div className="flex min-h-screen w-full items-center justify-center  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-10 px-5 py-5 font-sans text-white">
			<div className="flex w-full items-stretch justify-between rounded-md border border-black/20 bg-white px-5 py-5 drop-shadow-xl xl:max-w-7xl xl:px-5">
				<div className="hidden items-center justify-center bg-cover bg-center sm:w-[60%] md:flex lg:w-[50%] ">
					<Animation animationData={authAnimation} />
				</div>
				<div className="mx-auto w-full flex flex-col justify-center lg:w-1/2">
					<h1 className="bg-gradient-to-r from-pink-500   via-purple-500 to-indigo-500 bg-clip-text text-center font-instalogo text-5xl text-black ">The Social Network</h1>
					<div className="mt-5 w-full sm:mt-8">
						<div className="mx-auto flex w-full flex-col gap-5 sm:max-w-md md:max-w-lg">
							<input type="email" placeholder="Email or Nickname" className="input input-bordered input-primary w-full text-[#9BA3AF]" />

							<input type="Password" placeholder="Password" className="input input-bordered input-primary w-full text-[#9BA3AF]" />

							<div className="flex items-center justify-start  gap-1.5 pl-2">
								<h3 className="flex items-center whitespace-nowrap text-xs text-black">
									Welcome to the social network ! Made with
									<span className="text-[#4A07DA]">&nbsp;Love ❤️</span>
									&nbsp;and
									<span className="text-[#4A07DA]">&nbsp;coffee ☕</span>.
								</h3>
							</div>

							<div className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
								<Link href="/auth/signup" className="btn btn-outline btn-primary btn-block max-w-[200px]">
									Sign Up
								</Link>
								<Link href="/auth/signin" className="btn btn-primary btn-active btn-block max-w-[200px]">
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
