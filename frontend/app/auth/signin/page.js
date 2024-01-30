import Link from "next/link";
// import { useRouter } from "next/router";
// import React, { useEffect } from "react";
import Animation from "../../components/animation";
import authAnimation from "../../../public/assets/animations/authAnimation.json";

const SigninPage = () => {
	return (
		<div className="flex min-h-screen w-full items-center justify-center  p-10 px-5 py-5 font-sans text-white">
			<div className="flex w-full items-stretch justify-between rounded-md border border-black/20 bg-white px-5 py-5 drop-shadow-xl xl:max-w-7xl xl:px-5">
				<div className="hidden items-center justify-center bg-cover bg-center sm:w-[60%] md:flex lg:w-[50%] ">
					<Animation animationData={authAnimation} />
				</div>
				<div className="mx-auto w-full flex flex-col justify-center lg:w-1/2">
					<h1 className="bg-gradient-to-r from-pink-500   via-purple-500 to-indigo-500 bg-clip-text text-center font-instalogo text-5xl text-black ">The Social Network</h1>
					<div className="mt-5 w-full sm:mt-8">
						<form className="mx-auto flex w-full flex-col gap-5 sm:max-w-md md:max-w-lg">
							<input type="email" placeholder="Email or Nickname" className="input input-bordered input-primary w-full text-[#9BA3AF]" required />

							<input type="Password" placeholder="Password" className="input input-bordered input-primary w-full text-[#9BA3AF]" required />
							<div className="flex justify-center">
								<button className="btn btn-primary btn-active btn-block max-w-[200px] text-white" type="submit">
									Sign In
								</button>
							</div>

							<h4 className="font-sans text-base text-black">
								<span>Don't have an account yet ?</span>
								<span className="ml-2">
									<Link href="/auth/signup">
										<span className="text-[#4A07DA]">Sign up</span>
									</Link>
								</span>
							</h4>

							<div className="flex items-center justify-start  gap-1.5 pl-2">
								<h3 className="flex items-center whitespace-nowrap text-xs text-black">
									Welcome to the social network ! Made with
									<span className="text-[#4A07DA]">&nbsp;Love ❤️</span>
									&nbsp;and
									<span className="text-[#4A07DA]">&nbsp;coffee ☕</span>.
								</h3>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SigninPage;
