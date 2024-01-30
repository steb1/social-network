import Link from "next/link";
import Animation from "@/app/components/animation";
import SubmitAuth from "@/app/components/submitauth";
import authAnimation from "../../../public/assets/animations/authAnimation.json";

const SignupPage = () => {
	return (
		<div className="flex min-h-screen w-full items-center justify-center  bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-10 px-5 py-5 font-sans text-white">
			<div className="flex w-full items-stretch justify-between rounded-md border border-black/20 bg-white px-5 py-5 drop-shadow-xl xl:max-w-7xl xl:px-5">
				<div className="hidden items-center justify-center bg-cover bg-center sm:w-[60%] md:flex lg:w-[50%] ">
					<Animation animationData={authAnimation} />
				</div>
				<div className="mx-auto w-full py-5 md:p-10 md:py-0 lg:w-1/2">
					<h1 className="bg-gradient-to-r from-pink-500  via-purple-500 to-indigo-500 bg-clip-text text-center font-instalogo text-5xl text-transparent ">The Social Network</h1>
					<div className="mt-5 w-full sm:mt-8">
						<div className="mx-auto flex w-full flex-col gap-5 sm:max-w-md md:max-w-lg">
							<div className="flex flex-col gap-3 sm:flex-row">
								<input type="text" placeholder="First Name" className="input input-bordered input-primary w-full max-w-xs text-[#9BA3AF]" required />
								<input type="text" placeholder="Last Name" className="input input-bordered input-primary w-full max-w-xs text-[#9BA3AF]" required />
								<input type="text" placeholder="Nickname" className="input input-bordered input-primary w-full max-w-xs text-[#9BA3AF]" />
							</div>

							<input type="email" placeholder="Email" className="input input-bordered input-primary w-full text-[#9BA3AF]" required />

							<label className="form-control w-full max-w-lg">
								<div className="label">
									<span className="label-text">Your birthdate</span>
								</div>
								<input type="date" className="input input-bordered input-primary w-full text-[#9BA3AF]" required />
							</label>

							<div className="flex flex-col gap-3 sm:flex-row">
								<input type="Password" placeholder="Enter Your Password" className="input input-bordered input-primary w-full text-[#9BA3AF]" required />
								<input type="Password" placeholder="Confirm Your Password" className="input input-bordered input-primary w-full text-[#9BA3AF]" required />
							</div>

							<hr />

							<label className="form-control w-full max-w-lg">
								<div className="label">
									<span className="label-text">Your avatar</span>
								</div>
								<input type="file" className="file-input file-input-bordered w-full max-w-lg text-[#9BA3AF]" />
							</label>

							<textarea className="textarea textarea-secondary text-[#9BA3AF]" placeholder="Bio"></textarea>

							<div className="flex items-center justify-start  gap-1.5 pl-2">
								<h3 className="flex items-center whitespace-nowrap text-xs text-black">
									Welcome to the social network ! Made with
									<span className="text-[#4A07DA]">&nbsp;Love ❤️</span>
									&nbsp;and
									<span className="text-[#4A07DA]">&nbsp;coffee ☕</span>.
								</h3>
							</div>

							<div className="flex flex-col items-center justify-center gap-2 md:flex-row md:gap-4">
								<Link href="/auth/signup" className="btn btn-primary btn-active btn-block max-w-[200px]">
									Sign Up
								</Link>
								<Link href="/auth/signin" className="btn btn-outline btn-primary btn-block max-w-[200px]">
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

export default SignupPage;
