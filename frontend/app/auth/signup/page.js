"use client";
import Link from "next/link";
import Animation from "@/app/components/animation";
import authAnimation from "../../../public/assets/animations/authAnimation.json";
import { useFormik } from "formik";
import * as Yup from "yup";

// Using Yup librairy schema to validate the form
const validationSchema = Yup.object().shape({
	firstname: Yup.string().required("Firstname is required"),
	lastname: Yup.string().required("Lastname is required"),
	nickname: Yup.string(),
	email: Yup.string().required("Email is required").email("Invalid email"),
	birthdate: Yup.date().required("Birthdate is required"),
	password: Yup.string()
		.required("Password is required")
		.matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d.*\d.*\d.*\d).*$/, "Password must contain at least one uppercase letter, one special character, and at least 4 digits"),
	cPassword: Yup.string()
		.required("Confirm your password")
		.oneOf([Yup.ref("password"), null], "Passwords must match"),
	avatar: Yup.mixed(),
	bio: Yup.string(),
});

const SignupPage = () => {
	const formik = useFormik({
		initialValues: {
			firstname: "",
			lastname: "",
			nickname: "",
			email: "",
			birthdate: "",
			password: "",
			cPassword: "",
			avatar: null,
			bio: "",
		},
		validationSchema,
		onSubmit: async ({ firstname, lastname, nickname, email, birthdate, password, cPassword, avatar, bio }) => {
			console.log(firstname, lastname, nickname, email, birthdate, password, cPassword, avatar, bio);
			// TODO: Make a request to your backend to store the data
		},
	});

	// Destructure the formik object
	const { errors, touched, values, handleChange, handleSubmit } = formik;
	return (
		<div className="flex min-h-screen w-full items-center justify-center   p-10 px-5 py-5 font-sans text-white">
			<div className="flex w-full items-stretch justify-between rounded-md border border-black/20 bg-white px-5 py-5 drop-shadow-xl xl:max-w-7xl xl:px-5">
				<div className="hidden items-center justify-center bg-cover bg-center sm:w-[60%] md:flex lg:w-[50%] ">
					<Animation animationData={authAnimation} />
				</div>
				<div className="mx-auto w-full py-5 md:p-10 md:py-0 lg:w-1/2">
					<h1 className="bg-clip-text text-center font-instalogo text-5xl text-black ">The Social Network</h1>
					<div className="mt-5 w-full sm:mt-8">
						<form onSubmit={handleSubmit} className="mx-auto flex w-full flex-col gap-5 sm:max-w-md md:max-w-lg">
							<div className="flex flex-col gap-3 sm:flex-row">
								<input
									value={values.firstname}
									onChange={handleChange}
									type="text"
									name="firstname"
									placeholder="First Name"
									className="input input-bordered input-primary w-full max-w-xs text-[#9BA3AF]"
								/>
								<input
									value={values.lastname}
									onChange={handleChange}
									type="text"
									name="lastname"
									placeholder="Last Name"
									className="input input-bordered input-primary w-full max-w-xs text-[#9BA3AF]"
								/>
								<input
									value={values.nickname}
									onChange={handleChange}
									type="text"
									name="nickname"
									placeholder="Nickname"
									className="input input-bordered input-primary w-full max-w-xs text-[#9BA3AF]"
								/>
							</div>
							<div className="flex flex-col gap-3 sm:flex-row">
								{errors.firstname && touched.firstname && <span className="text-red-500 text-xs">{errors.firstname}</span>}
								{errors.lastname && touched.lastname && <span className="text-red-500 text-xs ml-10">{errors.lastname}</span>}
								{errors.nickname && touched.nickname && <span className="text-red-500 text-xs">{errors.nickname}</span>}
							</div>

							<input value={values.email} onChange={handleChange} type="email" name="email" placeholder="Email" className="input input-bordered input-primary w-full text-[#9BA3AF]" />
							{errors.email && touched.email && <span className="text-red-500 text-xs">{errors.email}</span>}

							<label className="form-control w-full max-w-lg">
								<div className="label">
									<span className="label-text">Your birthdate</span>
								</div>
								<input value={values.birthdate} onChange={handleChange} type="date" name="birthdate" className="input input-bordered input-primary w-full text-[#9BA3AF]" />
							</label>
							{errors.birthdate && touched.birthdate && <span className="text-red-500 text-xs">{errors.birthdate}</span>}

							<div className="flex flex-col gap-3 sm:flex-row">
								<input
									value={values.password}
									onChange={handleChange}
									type="Password"
									name="password"
									placeholder="Enter Your Password"
									className="input input-bordered input-primary w-full text-[#9BA3AF]"
								/>
								<input
									value={values.cPassword}
									onChange={handleChange}
									type="Password"
									name="cPassword"
									placeholder="Confirm Your Password"
									className="input input-bordered input-primary w-full text-[#9BA3AF]"
								/>
							</div>
							<div className="flex flex-col gap-3 sm:flex-row">
								{errors.password && touched.password && <span className="text-red-500 text-xs">{errors.password}</span>}
								{errors.cPassword && touched.cPassword && <span className="text-red-500 text-xs">{errors.cPassword}</span>}
							</div>

							<hr />

							<label className="form-control w-full max-w-lg">
								<div className="label">
									<span className="label-text">Your avatar</span>
								</div>
								<input type="file" name="avatar" className="file-input file-input-bordered w-full max-w-lg text-[#9BA3AF]" />
							</label>
							{/* {errors.avatar && touched.avatar && <span className="text-red-500 text-xs">{errors.avatar}</span>} */}

							<textarea value={values.bio} onChange={handleChange} name="bio" className="textarea textarea-secondary text-[#9BA3AF]" placeholder="Bio"></textarea>
							{errors.bio && touched.bio && <span className="text-red-500 text-xs">{errors.bio}</span>}

							<div className="flex justify-center">
								<button className="btn btn-primary btn-active btn-block max-w-[200px] text-white" type="submit">
									Sign up
								</button>
							</div>

							<h4 className="font-sans text-base text-black">
								<span>Already have an account ?</span>
								<span className="ml-2">
									<Link href="/auth/signin">
										<span className="text-[#4A07DA]">Sign in</span>
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

export default SignupPage;
