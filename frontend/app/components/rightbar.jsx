'use client'
import config from "@/config";
import { useState, useEffect } from "react";

const fetchCategories = async (setCategories) => {
    let token = document.cookie.split("=")[1]
    try {
        const response = await fetch(config.serverApiUrl + "getRightBarCategories", {
            cache: "no-cache",
            method: "GET",
            headers: {
                'Authorization': token,
              },
        });
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
}

export const Rightbar = () => {
    let [categories, setCategories] = useState([]);
    useEffect(() => {
        fetchCategories(setCategories);
    }, []);

    return (
        <div className='w-96' uk-sticky=''>
            <div>
                <div className='box p-5 px-6 border1 dark:bg-dark2'>
                    <div className='flex justify-between text-black dark:text-white'>
                        <h3 className='font-bold text-base'> Online Friends </h3>
                        <button type='button'>
                            {" "}
                            <ion-icon name='sync-outline' className='text-xl' />{" "}
                        </button>
                    </div>
                    <div className='grid grid-cols-6 gap-3 mt-4'>
                        <a href='timeline.html'>
                            <div className='w-10 h-10 relative'>
                                <img
                                    src='assets/images/avatars/avatar-2.jpg'
                                    className='w-full h-full absolute inset-0 rounded-full'
                                />
                                <div className='absolute bottom-0 right-0 m-0.5 bg-green-500 rounded-full w-2 h-2' />
                            </div>
                        </a>
                        <a href='timeline.html'>
                            <div className='w-10 h-10 relative'>
                                <img
                                    src='assets/images/avatars/avatar-3.jpg'
                                    className='w-full h-full absolute inset-0 rounded-full'
                                />
                                <div className='absolute bottom-0 right-0 m-0.5 bg-green-500 rounded-full w-2 h-2' />
                            </div>
                        </a>
                        <a href='timeline.html'>
                            <div className='w-10 h-10 relative'>
                                <img
                                    src='assets/images/avatars/avatar-4.jpg'
                                    className='w-full h-full absolute inset-0 rounded-full'
                                />
                                <div className='absolute bottom-0 right-0 m-0.5 bg-green-500 rounded-full w-2 h-2' />
                            </div>
                        </a>
                        <a href='timeline.html'>
                            <div className='w-10 h-10 relative'>
                                <img
                                    src='assets/images/avatars/avatar-5.jpg'
                                    className='w-full h-full absolute inset-0 rounded-full'
                                />
                                <div className='absolute bottom-0 right-0 m-0.5 bg-green-500 rounded-full w-2 h-2' />
                            </div>
                        </a>
                        <a href='timeline.html'>
                            <div className='w-10 h-10 relative'>
                                <img
                                    src='assets/images/avatars/avatar-6.jpg'
                                    className='w-full h-full absolute inset-0 rounded-full'
                                />
                                <div className='absolute bottom-0 right-0 m-0.5 bg-green-500 rounded-full w-2 h-2' />
                            </div>
                        </a>
                        <a href='timeline.html'>
                            <div className='w-10 h-10 relative'>
                                <img
                                    src='assets/images/avatars/avatar-7.jpg'
                                    className='w-full h-full absolute inset-0 rounded-full'
                                />
                                <div className='absolute bottom-0 right-0 m-0.5 bg-green-500 rounded-full w-2 h-2' />
                            </div>
                        </a>
                    </div>
                </div>
                <div className='box p-5 px-6 border1  mt-10 dark:bg-dark2'>
                    <div className='flex justify-between text-black dark:text-white'>
                        <h3 className='font-bold text-base'> Trends for you </h3>
                    </div>
                    <div className='space-y-3.5 capitalize text-xs font-normal mt-5 mb-2 text-gray-600 dark:text-white/80'>
                        <>
                            {categories ? categories.map((category) => (
                                <a href='#' key={category.categoryName}>
                                    <div className='flex items-center gap-3 p'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth='1.5'
                                            stroke='currentColor'
                                            className='w-5 h-5 -mt-2'
                                        >
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5'
                                            />
                                        </svg>
                                        <div className='flex-1'>
                                            <h4 className='font-semibold text-black dark:text-white text-sm'>
                                                {" "}
                                                {category.categoryName}{" "}
                                            </h4>
                                            <div className='mt-0.5'> {category.postCount} posts </div>
                                        </div>
                                    </div>
                                </a>
                            )) : ""}
                        </>

                    </div>
                </div>
            </div>
        </div>
    );
};
