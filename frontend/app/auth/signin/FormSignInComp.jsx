"use client";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import config from "@/config";
import * as Yup from "yup";
import React from "react";

// Using Yup librairy schema to validate the form
const validationSchema = Yup.object().shape({
  emailOrNickname: Yup.string().required("Email or nickname is required"),
  password: Yup.string().required("Password is required"),
});

const FormSignInComp = () => {
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
          cache: "no-cache",
          body: JSON.stringify({ emailOrNickname, password }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          // TODO SET AUTREMENT

          document.cookie = `${config.cookieName}=${data.token}; path=/; max-age=${3 * 60 * 60}`;
          localStorage.setItem("avatar", data.user?.avatar);
          localStorage.setItem("nickname", data.user?.nickname);
          localStorage.setItem("firstname", data.user?.first_name);
          localStorage.setItem("lastname", data.user?.last_name);
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
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full flex-col gap-5 sm:max-w-md md:max-w-lg"
    >
      <input
        value={values.emailOrNickname}
        onChange={handleChange}
        name="emailOrNickname"
        type="text"
        placeholder="Email or Nickname"
        className="input input-bordered input-primary w-full text-[#9BA3AF]"
      />
      {errors.emailOrNickname && touched.emailOrNickname && (
        <span className="text-red-500 text-xs">{errors.emailOrNickname}</span>
      )}

      <input
        value={values.password}
        onChange={handleChange}
        name="password"
        type="password"
        placeholder="Password"
        className="input input-bordered input-primary w-full text-[#9BA3AF]"
      />
      {errors.password && touched.password && (
        <span className="text-red-500 text-xs">{errors.password}</span>
      )}

      <div className="flex flex-col items-center justify-center">
        {serverError && (
          <span className="text-red-500 text-xs mb-2">{serverError}</span>
        )}
        <button
          className="btn btn-primary btn-active btn-block max-w-[200px] text-white"
          type="submit"
        >
          Sign In
        </button>
      </div>

      <h4 className="font-sans text-base text-black">
        <span>Don't have an account yet ?</span>

        <span
          onClick={() => router.replace("/auth/signup")}
          className="text-[#4A07DA] ml-2 cursor-pointer"
        >
          Sign up
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
  );
};

export default FormSignInComp;
