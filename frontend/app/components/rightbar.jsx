"use client";
import config from "@/config";
import { useState, useEffect } from "react";

const fetchCategories = async (setCategories) => {
  let token = document.cookie.split("=")[1];
  try {
    const response = await fetch(
      config.serverApiUrl + "getRightBarCategories",
      {
        cache: "no-cache",
        method: "GET",
        headers: {
          Authorization: token,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setCategories(data);
    } else {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.error || "An error occurred.";
      console.error("No categories retrieved:", errorMessage);
    }
  } catch (error) {
    console.error("Error while fetching categories:", error);
  }
};

export const Rightbar = () => {
  let [categories, setCategories] = useState([]);
  useEffect(() => {
    fetchCategories(setCategories);
  }, []);

  return (
    <div className="w-96" uk-sticky="">
      <div>
        <div className="box p-5 px-6 border1  mt-10 dark:bg-dark2">
          <div className="flex justify-between text-black dark:text-white">
            <h3 className="font-bold text-base"> Trends for you </h3>
          </div>
          <div className="space-y-3.5 capitalize text-xs font-normal mt-5 mb-2 text-gray-600 dark:text-white/80">
            <>
              {categories && Array.isArray(categories)
                ? categories.map((category) => (
                    <a href="#" key={category.categoryName}>
                      <div className="flex items-center gap-3 p">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-5 h-5 -mt-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
                          />
                        </svg>
                        <div className="flex-1">
                          <h4 className="font-semibold text-black dark:text-white text-sm">
                            {" "}
                            {category.categoryName}{" "}
                          </h4>
                          <div className="mt-0.5">
                            {" "}
                            {category.postCount} posts{" "}
                          </div>
                        </div>
                      </div>
                    </a>
                  ))
                : ""}
            </>
          </div>
        </div>
      </div>
    </div>
  );
};
