"use client";
import Link from "next/link";
import Animation from "../../components/animation";
import authAnimation from "../../../public/assets/animations/authAnimation.json";

import { useFormik } from "formik";
import * as Yup from "yup";

// Using Yup librairy schema to validate the form
const validationSchema = Yup.object().shape({
    emailOrNickname: Yup.string().required("Email is required").email("Invalid email"),
    password: Yup.string().required("Password is required"),
});

const SigninPage = () => {
    const formik = useFormik({
        initialValues: {
            emailOrNickname: "",
            password: "",
        },
        validationSchema,
        onSubmit: async ({ emailOrNickname, password }) => {
            const response = await fetch("http://localhost:8080/api/signin", {
                method: "POST",
                body: JSON.stringify({ emailOrNickname, password }),
            });

            // Handle response if necessary
            const data = await response.json();
            console.log(data);
        },
    });

    // Destructure the formik object
    const { errors, touched, values, handleChange, handleSubmit } = formik;

    return (
        <div className='flex min-h-screen w-full items-center justify-center  p-10 px-5 py-5 font-sans text-white'>
            <div className='flex w-full items-stretch justify-between rounded-md border border-black/20 bg-white px-5 py-5 drop-shadow-xl xl:max-w-7xl xl:px-5'>
                <div className='hidden items-center justify-center bg-cover bg-center sm:w-[60%] md:flex lg:w-[50%] '>
                    <Animation animationData={authAnimation} />
                </div>
                <div className='mx-auto w-full flex flex-col justify-center lg:w-1/2'>
                    <h1 className='bg-gradient-to-r from-pink-500   via-purple-500 to-indigo-500 bg-clip-text text-center font-instalogo text-5xl text-black '>
                        The Social Network
                    </h1>
                    <div className='mt-5 w-full sm:mt-8'>
                        <form
                            onSubmit={handleSubmit}
                            className='mx-auto flex w-full flex-col gap-5 sm:max-w-md md:max-w-lg'
                        >
                            <input
                                value={values.emailOrNickname}
                                onChange={handleChange}
                                name='emailOrNickname'
                                type='email'
                                placeholder='Email or Nickname'
                                className='input input-bordered input-primary w-full text-[#9BA3AF]'
                            />
                            {errors.emailOrNickname && touched.emailOrNickname && (
                                <span className='text-red-500 text-xs'>{errors.emailOrNickname}</span>
                            )}

                            <input
                                value={values.password}
                                onChange={handleChange}
                                name='password'
                                type='Password'
                                placeholder='Password'
                                className='input input-bordered input-primary w-full text-[#9BA3AF]'
                            />
                            {errors.password && touched.password && (
                                <span className='text-red-500 text-xs'>{errors.password}</span>
                            )}

                            <div className='flex justify-center'>
                                <button
                                    className='btn btn-primary btn-active btn-block max-w-[200px] text-white'
                                    type='submit'
                                >
                                    Sign In
                                </button>
                            </div>

                            <h4 className='font-sans text-base text-black'>
                                <span>Don't have an account yet ?</span>
                                <span className='ml-2'>
                                    <Link href='/auth/signup'>
                                        <span className='text-[#4A07DA]'>Sign up</span>
                                    </Link>
                                </span>
                            </h4>

                            <div className='flex items-center justify-start  gap-1.5 pl-2'>
                                <h3 className='flex items-center whitespace-nowrap text-xs text-black'>
                                    Welcome to the social network ! Made with
                                    <span className='text-[#4A07DA]'>&nbsp;Love ❤️</span>
                                    &nbsp;and
                                    <span className='text-[#4A07DA]'>&nbsp;coffee ☕</span>.
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
