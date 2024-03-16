"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import config from "@/config";
import * as Yup from "yup";

// Using Yup librairy schema to validate the form
const validationSchema = Yup.object().shape({
  first_name: Yup.string().required("Firstname is required"),
  last_name: Yup.string().required("Lastname is required"),
  nickname: Yup.string().max(20, "Nickname at most 20 char"),
  email: Yup.string().required("Email is required").email("Invalid email"),
  birthdate: Yup.date().required("Birthdate is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(
      /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
      "Password must contain at least 1 uppercase letter, 1 special char, 1 digit, and 8 char long"
    ),
  cPassword: Yup.string()
    .required("Confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
  avatar: Yup.mixed()
    .nullable()
    .test("fileSize", "File size is too large", (value) =>
      value ? value.size <= 5000000 : true
    ),
  about_me: Yup.string(),
});

const FormSignupComp = () => {
  const router = useRouter();

  const [serverLog, setServerLog] = useState({
    message: null,
    isErr: false,
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      nickname: "",
      email: "",
      birthdate: "",
      password: "",
      cPassword: "",
      avatar: null,
      about_me: "",
    },
    validationSchema,
    onSubmit: async () => {},
  });

  const { errors, touched, values, handleChange, handleSubmit } = formik;

  async function onSubmit(event) {
    try {
      event.preventDefault();
      handleSubmit();

      const formHasErrors = Object.values(errors).some((error) => !!error);

      if (formHasErrors) {
        console.log("Form has some errors; will not trigger the server.");
        return;
      }

      const formData = new FormData(event.target);
      const response = await fetch(config.serverApiUrl + "signup", {
        method: "POST",
        cache: "no-cache",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setServerLog({ message: `${data.message}`, isErr: false });
        setTimeout(() => router.replace("/auth/signin"), 3000);
      } else {
        const errorResponse = await response.json();
        const errorMessage = errorResponse.error || "An error occurred.";
        setServerLog({ message: `${errorMessage}`, isErr: true });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setServerLog({ message: "Error occurring", isErr: true });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full dark:bg-slate-800  flex-col gap-5 sm:max-w-md md:max-w-lg"
    >
      <div className="flex flex-col dark:bg-slate-800  gap-3 sm:flex-row">
        <input
          value={values.first_name}
          onChange={handleChange}
          type="text"
          name="first_name"
          placeholder="First Name"
          className="input input-bordered input-primary w-full max-w-xs text-[#9BA3AF]"
        />
        <input
          value={values.last_name}
          onChange={handleChange}
          type="text"
          name="last_name"
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
      <div className="flex flex-col dark:bg-slate-800 gap-3 sm:flex-row">
        {errors.first_name && touched.first_name && (
          <span className="text-red-500 text-xs">{errors.first_name}</span>
        )}
        {errors.last_name && touched.last_name && (
          <span className="text-red-500 text-xs ml-10">{errors.last_name}</span>
        )}
        {errors.nickname && touched.nickname && (
          <span className="text-red-500 text-xs">{errors.nickname}</span>
        )}
      </div>

      <input
        value={values.email}
        onChange={handleChange}
        type="email"
        name="email"
        placeholder="Email"
        className="input input-bordered input-primary w-full text-[#9BA3AF]"
      />
      {errors.email && touched.email && (
        <span className="text-red-500 text-xs">{errors.email}</span>
      )}

      <label className="form-control w-full max-w-lg">
        <div className="label">
          <span className="label-text">Your birthdate</span>
        </div>
        <input
          value={values.birthdate}
          onChange={handleChange}
          type="date"
          name="birthdate"
          className="input input-bordered input-primary w-full text-[#9BA3AF]"
        />
      </label>
      {errors.birthdate && touched.birthdate && (
        <span className="text-red-500 text-xs">{errors.birthdate}</span>
      )}

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
        {errors.password && touched.password && (
          <span className="text-red-500 text-xs">{errors.password}</span>
        )}
        {errors.cPassword && touched.cPassword && (
          <span className="text-red-500 text-xs">{errors.cPassword}</span>
        )}
      </div>

      <hr />

      <label className="form-control w-full max-w-lg">
        <div className="label">
          <span className="label-text">Your avatar</span>
        </div>
        <input
          type="file"
          name="avatar"
          className="file-input file-input-bordered w-full max-w-lg text-[#9BA3AF] cursor-pointer"
        />
      </label>
      {errors.avatar && touched.avatar && (
        <span className="text-red-500 text-xs">{errors.avatar}</span>
      )}

      <textarea
        value={values.about_me}
        onChange={handleChange}
        name="about_me"
        className="textarea textarea-secondary text-[#9BA3AF]"
        placeholder="About me"
      ></textarea>
      {errors.about_me && touched.about_me && (
        <span className="text-red-500 text-xs">{errors.about_me}</span>
      )}

      <div className="flex  flex-col items-center justify-center">
        {serverLog && (
          <span
            className={
              serverLog.isErr
                ? "text-red-500 text-xs mb-2"
                : "text-green-500 text-xs mb-2"
            }
          >
            {serverLog.message}
          </span>
        )}
        <button
          className="btn btn-primary btn-active btn-block max-w-[200px] text-white"
          type="submit"
        >
          Sign up
        </button>
      </div>

      <h4 className="font-sans text-base text-black">
        <span>Already have an account ?</span>
        <span
          onClick={() => router.replace("/auth/signin")}
          className="text-[#4A07DA] ml-2 cursor-pointer"
        >
          Sign in
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

export default FormSignupComp;
