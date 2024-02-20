"use client";
import Animation from "../../components/animation";
import authAnimation from "../../../public/assets/animations/authAnimation.json";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import config from "@/config";
import * as Yup from "yup";
import { checkAuth } from "../utils";

// Using Yup librairy schema to validate the form
const validationSchema = Yup.object().shape({
    emailOrNickname: Yup.string().required("Email or nickname is required"),
    password: Yup.string().required("Password is required"),
});

const SigninPage = () => {
    const router = useRouter();

    const [serverError, setServerError] = useState(null); // State pour stocker le message d'erreur du serveur

    const formik = useFormik({
        initialValues: {
            emailOrNickname: "",
            password: "",
        },
        validationSchema,
        onSubmit: async ({ emailOrNickname, password }) => {
            try {
                const response = await fetch(config.serverApiUrl + "signin", {
                    method: "POST",
                    body: JSON.stringify({ emailOrNickname, password }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // Set cookie on the client side
                    document.cookie = `${config.cookieName}=${data.token}; path=/; max-age=${3 * 60 * 60}`;
                    router.replace("/");
                } else {
                    const errorResponse = await response.json();
                    const errorMessage = errorResponse.error || "An error occurred.";
                    console.error("Authentication failed:", errorMessage);
                    setServerError(`Authentication failed: ${errorMessage}`);
                }
            } catch (error) {
                console.error("Error during authentication:", error);
            }
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
                                type='text'
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
                                type='password'
                                placeholder='Password'
                                className='input input-bordered input-primary w-full text-[#9BA3AF]'
                            />
                            {errors.password && touched.password && (
                                <span className='text-red-500 text-xs'>{errors.password}</span>
                            )}

                            <div className='flex flex-col items-center justify-center'>
                                {serverError && <span className='text-red-500 text-xs mb-2'>{serverError}</span>}
                                <button
                                    className='btn btn-primary btn-active btn-block max-w-[200px] text-white'
                                    type='submit'
                                >
                                    Sign In
                                </button>
                            </div>

                            <h4 className='font-sans text-base text-black'>
                                <span>Don't have an account yet ?</span>

                                <span
                                    onClick={() => router.replace("/auth/signup")}
                                    className='text-[#4A07DA] ml-2 cursor-pointer'
                                >
                                    Sign up
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
