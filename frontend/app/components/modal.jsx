"use client";
import config from "@/config";
import React, { useEffect, useState } from "react";

export const fetchFollowers = async (setFollowers) => {
    let token = document.cookie.split("=")[1]
    const response = await fetch(config.serverApiUrl + "getFollowers", {
        cache: "no-cache",
        method: "GET",
        headers: {
            'Authorization': token,
          },
    });
    if (response.ok) {
        const followers = await response.json();
        setFollowers(followers);
        return followers;
    }
};

export const Modal = ({ setPosts, posts }) => {
    let [followers, setFollowers] = useState([]);
    useEffect(() => {
        fetchFollowers(setFollowers);
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let token = document.cookie.split("=")[1]
        const NewformData = new FormData(e.currentTarget);
        const response = await fetch(config.serverApiUrl + "createPost", {
            method: "POST",
            headers: {
                'Authorization': token,
              },
            body: NewformData,
        });
        try {
            const jsonData = await response.json();
            if (response.ok) {
                console.log("post sent");
                UIkit.modal("#create-status").hide();
                setPosts([jsonData, ...posts]);
                const body = document.querySelector(".post_body");
                const checkboxes = document.querySelectorAll("input.select_category:checked");
                body.value = "";
                checkboxes.forEach((checkbox) => {
                    checkbox.checked = false;
                });
            }
        } catch (error) {
            console.error("Erreur lors de la lecture de la réponse JSON :", error);
        }
    };

    if (followers == null) {
        followers = [];
    }

    const displayFriend = () => {
        const select = document.getElementById("selectVisibility");
        var selectElement = document.getElementById("friend");
        if (select.value == "almost private") {
            selectElement.classList.remove("hidden");
        } else {
            selectElement.classList.add("hidden");
        }
    };
    return (
        <div>
            {/* open chat box */}
            <div>
                <button
                    type='button'
                    className='sm:m-10 m-5 z-50 px-4 py-2.5 rounded-2xl bg-gradient-to-tr from-blue-500 to-blue-700 text-white shadow fixed bottom-0 right-0 group flex items-center gap-2'
                >
                    <svg
                        className='w-6 h-6 group-aria-expanded:hidden duration-500'
                        xmlns='http://www.w3.org/2000/svg'
                        fill='none'
                        viewBox='0 0 24 24'
                        strokeWidth={2}
                        stroke='currentColor'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            d='M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z'
                        />
                    </svg>
                    <div className='text-base font-semibold max-sm:hidden'> Chat </div>
                    <svg
                        className='w-6 h-6 -mr-1 hidden group-aria-expanded:block'
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                    >
                        <path
                            fillRule='evenodd'
                            d='M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z'
                            clipRule='evenodd'
                        />
                    </svg>
                </button>
                <div
                    className='bg-white rounded-xl drop-shadow-xl  sm:w-80 w-screen border-t dark:bg-dark3 dark:border-slate-600'
                    id='chat__box'
                    uk-drop='offset:10;pos: bottom-right; animate-out: true; animation: uk-animation-scale-up uk-transform-origin-bottom-right; mode: click'
                >
                    <div className='relative'>
                        <div className='p-5'>
                            <h1 className='text-lg font-bold text-black'> Chats </h1>
                        </div>
                        {/* search input defaul is hidden */}
                        <div
                            className='bg-white p-3 absolute w-full top-11 border-b flex gap-2 hidden dark:border-slate-600 dark:bg-slate-700 z-10'
                            uk-scrollspy='cls:uk-animation-slide-bottom-small ; repeat: true; duration:0'
                            id='search__chat'
                        >
                            <div className='relative w-full'>
                                <input
                                    type='text'
                                    className='w-full rounded-3xl dark:!bg-white/10'
                                    placeholder='Search'
                                />
                                <button
                                    type='button'
                                    className='absolute  right-0  rounded-full shrink-0 px-2 -translate-y-1/2 top-1/2'
                                    uk-toggle='target: #search__chat ; cls: hidden'
                                >
                                    <ion-icon name='close-outline' className='text-xl flex' />
                                </button>
                            </div>
                        </div>
                        {/* button actions */}
                        <div className='absolute top-0 -right-1 m-5 flex gap-2 text-xl'>
                            <button uk-toggle='target: #search__chat ; cls: hidden'>
                                <ion-icon name='search-outline' />
                            </button>
                            <button uk-toggle='target: #chat__box ; cls: uk-open'>
                                <ion-icon name='close-outline' />
                            </button>
                        </div>
                        {/* tabs */}
                        <div className='page-heading bg-slat e-50 '>
                            <nav className='nav__underline -mt-7 px-5'>
                                <ul
                                    className='group'
                                    uk-switcher='connect: #chat__tabs ; animation: uk-animation-slide-right-medium, uk-animation-slide-left-medium'
                                >
                                    <li>
                                        {" "}
                                        <a
                                            href='#'
                                            className='inline-block py-[18px] border-b-2 border-transparent aria-expanded:text-black aria-expanded:border-black aria-expanded:dark:text-white aria-expanded:dark:border-white'
                                        >
                                            {" "}
                                            Friends
                                        </a>{" "}
                                    </li>
                                    <li>
                                        {" "}
                                        <a href='#'> Groups </a>{" "}
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        {/* tab 2 optional */}
                        <div
                            className='grid grid-cols-2 px-3 py-2 bg-slate-50  -mt-12 relative z-10 text-sm border-b  hidden'
                            uk-switcher='connect: #chat__tabs; toggle: * > button ; animation: uk-animation-slide-right uk-animation-slide-top'
                        >
                            <button className='bg-white shadow rounded-md py-1.5'> Friends </button>
                            <button> Groups </button>
                        </div>
                        {/* chat list */}
                        <div className='uk-switcher overflow-hidden rounded-xl -mt-8' id='chat__tabs'>
                            {/* tab list 1 */}
                            <div className='space-y -m t-5 p-3 text-sm font-medium h-[280px] overflow-y-auto'>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-1.jpg' className='w-7 rounded-full' />
                                        <div> Jesse Steeve </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-2.jpg' className='w-7 rounded-full' />
                                        <div> John Michael </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-3.jpg' className='w-7 rounded-full' />
                                        <div> Monroe Parker </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-5.jpg' className='w-7 rounded-full' />
                                        <div> James Lewis </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-4.jpg' className='w-7 rounded-full' />
                                        <div> Martin Gray </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-6.jpg' className='w-7 rounded-full' />
                                        <div> Alexa stella </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-1.jpg' className='w-7 rounded-full' />
                                        <div> Jesse Steeve </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-2.jpg' className='w-7 rounded-full' />
                                        <div> John Michael </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-3.jpg' className='w-7 rounded-full' />
                                        <div> Monroe Parker </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-5.jpg' className='w-7 rounded-full' />
                                        <div> James Lewis </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-4.jpg' className='w-7 rounded-full' />
                                        <div> Martin Gray </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-6.jpg' className='w-7 rounded-full' />
                                        <div> Alexa stella </div>
                                    </div>
                                </a>
                            </div>
                            {/* tab list 2 */}
                            <div className='space-y -m t-5 p-3 text-sm font-medium h-[280px] overflow-y-auto'>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-1.jpg' className='w-7 rounded-full' />
                                        <div> Jesse Steeve </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-2.jpg' className='w-7 rounded-full' />
                                        <div> John Michael </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-3.jpg' className='w-7 rounded-full' />
                                        <div> Monroe Parker </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-5.jpg' className='w-7 rounded-full' />
                                        <div> James Lewis </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-4.jpg' className='w-7 rounded-full' />
                                        <div> Martin Gray </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-6.jpg' className='w-7 rounded-full' />
                                        <div> Alexa stella </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-1.jpg' className='w-7 rounded-full' />
                                        <div> Jesse Steeve </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-2.jpg' className='w-7 rounded-full' />
                                        <div> John Michael </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-3.jpg' className='w-7 rounded-full' />
                                        <div> Monroe Parker </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-5.jpg' className='w-7 rounded-full' />
                                        <div> James Lewis </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-4.jpg' className='w-7 rounded-full' />
                                        <div> Martin Gray </div>
                                    </div>
                                </a>
                                <a href='#' className='block'>
                                    <div className='flex items-center gap-3.5 rounded-lg p-2 hover:bg-secondery dark:hover:bg-white/10'>
                                        <img src='assets/images/avatars/avatar-6.jpg' className='w-7 rounded-full' />
                                        <div> Alexa stella </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='w-3.5 h-3.5 absolute -bottom-2 right-5 bg-white rotate-45 dark:bg-dark3' />
                </div>
            </div>
            {/* post preview modal */}
            <div className='hidden lg:p-20 max-lg:!items-start' id='preview_modal' uk-modal=''>
                <div className='uk-modal-dialog tt relative mx-auto overflow-hidden shadow-xl rounded-lg lg:flex items-center ax-w-[86rem] w-full lg:h-[80vh]'>
                    {/* image previewer */}
                    <div className='lg:h-full lg:w-[calc(100vw-400px)] w-full h-96 flex justify-center items-center relative'>
                        <div className='relative z-10 w-full h-full'>
                            <img src='assets/images/post/post-1.jpg' className='w-full h-full object-cover absolute' />
                        </div>
                        {/* close button */}
                        <button
                            type='button'
                            className='bg-white rounded-full p-2 absolute right-0 top-0 m-3 uk-animation-slide-right-medium z-10 dark:bg-slate-600 uk-modal-close'
                        >
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                fill='none'
                                viewBox='0 0 24 24'
                                strokeWidth='1.5'
                                stroke='currentColor'
                                className='w-6 h-6'
                            >
                                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>
                    {/* right sidebar */}
                    <div className='lg:w-[400px] w-full bg-white h-full relative  overflow-y-auto shadow-xl dark:bg-dark2 flex flex-col justify-between'>
                        <div className='p-5 pb-0'>
                            {/* story heading */}
                            <div className='flex gap-3 text-sm font-medium'>
                                <img src='assets/images/avatars/avatar-5.jpg' className='w-9 h-9 rounded-full' />
                                <div className='flex-1'>
                                    <h4 className='text-black font-medium dark:text-white'> Steeve </h4>
                                    <div className='text-gray-500 text-xs dark:text-white/80'> 2 hours ago</div>
                                </div>
                                {/* dropdown */}
                                <div className='-m-1'>
                                    <button type='button' className='button__ico w-8 h-8'>
                                        {" "}
                                        <ion-icon className='text-xl' name='ellipsis-horizontal' />{" "}
                                    </button>
                                    <div
                                        className='w-[253px]'
                                        uk-dropdown='pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true'
                                    >
                                        <nav>
                                            <a href='#'>
                                                {" "}
                                                <ion-icon className='text-xl shrink-0' name='bookmark-outline' /> Add to
                                                favorites{" "}
                                            </a>
                                            <a href='#'>
                                                {" "}
                                                <ion-icon
                                                    className='text-xl shrink-0'
                                                    name='notifications-off-outline'
                                                />{" "}
                                                Mute Notification{" "}
                                            </a>
                                            <a href='#'>
                                                {" "}
                                                <ion-icon className='text-xl shrink-0' name='flag-outline' /> Report
                                                this post{" "}
                                            </a>
                                            <a href='#'>
                                                {" "}
                                                <ion-icon className='text-xl shrink-0' name='share-outline' /> Share
                                                your profile{" "}
                                            </a>
                                            <hr />
                                            <a
                                                href='#'
                                                className='text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/50'
                                            >
                                                {" "}
                                                <ion-icon
                                                    className='text-xl shrink-0'
                                                    name='stop-circle-outline'
                                                />{" "}
                                                Unfollow{" "}
                                            </a>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                            <p className='font-normal text-sm leading-6 mt-4'>
                                {" "}
                                Photography is the art of capturing light with a camera. it can be fun, challenging. It
                                can also be a hobby, a passion. 📷{" "}
                            </p>
                            <div className='shadow relative -mx-5 px-5 py-3 mt-3'>
                                <div className='flex items-center gap-4 text-xs font-semibold'>
                                    <div className='flex items-center gap-2.5'>
                                        <button
                                            type='button'
                                            className='button__ico text-red-500 bg-red-100 dark:bg-slate-700'
                                        >
                                            {" "}
                                            <ion-icon className='text-lg' name='heart' />{" "}
                                        </button>
                                        <a href='#'>1,300</a>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <button type='button' className='button__ico bg-slate-100 dark:bg-slate-700'>
                                            {" "}
                                            <ion-icon className='text-lg' name='chatbubble-ellipses' />{" "}
                                        </button>
                                        <span>260</span>
                                    </div>
                                    <button type='button' className='button__ico ml-auto'>
                                        {" "}
                                        <ion-icon className='text-xl' name='share-outline' />{" "}
                                    </button>
                                    <button type='button' className='button__ico'>
                                        {" "}
                                        <ion-icon className='text-xl' name='bookmark-outline' />{" "}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='p-5 h-full overflow-y-auto flex-1'>
                            {/* comment list */}
                            <div className='relative text-sm font-medium space-y-5'>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-2.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            Steeve{" "}
                                        </a>
                                        <p className='mt-0.5'>What a beautiful, I love it. 😍 </p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-3.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            Monroe{" "}
                                        </a>
                                        <p className='mt-0.5'> You captured the moment.😎 </p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-7.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            Alexa{" "}
                                        </a>
                                        <p className='mt-0.5'> This photo is amazing! </p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-4.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            John
                                        </a>
                                        <p className='mt-0.5'> Wow, You are so talented 😍 </p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-5.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            Michael{" "}
                                        </a>
                                        <p className='mt-0.5'> I love taking photos 🌳🐶</p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-3.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            Monroe{" "}
                                        </a>
                                        <p className='mt-0.5'> Awesome. 😊😢 </p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-5.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            Jesse{" "}
                                        </a>
                                        <p className='mt-0.5'> Well done 🎨📸 </p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-2.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            Steeve{" "}
                                        </a>
                                        <p className='mt-0.5'>What a beautiful, I love it. 😍 </p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-7.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            Alexa{" "}
                                        </a>
                                        <p className='mt-0.5'> This photo is amazing! </p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-4.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            John
                                        </a>
                                        <p className='mt-0.5'> Wow, You are so talented 😍 </p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-5.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            Michael{" "}
                                        </a>
                                        <p className='mt-0.5'> I love taking photos 🌳🐶</p>
                                    </div>
                                </div>
                                <div className='flex items-start gap-3 relative'>
                                    <img
                                        src='assets/images/avatars/avatar-3.jpg'
                                        className='w-6 h-6 mt-1 rounded-full'
                                    />
                                    <div className='flex-1'>
                                        <a href='#' className='text-black font-medium inline-block dark:text-white'>
                                            {" "}
                                            Monroe{" "}
                                        </a>
                                        <p className='mt-0.5'> Awesome. 😊😢 </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='bg-white p-3 text-sm font-medium flex items-center gap-2'>
                            <img src='assets/images/avatars/avatar-2.jpg' className='w-6 h-6 rounded-full' />
                            <div className='flex-1 relative overflow-hidden '>
                                <textarea
                                    placeholder='Add Comment....'
                                    rows={1}
                                    className='w-full resize-  px-4 py-2 focus:!border-transparent focus:!ring-transparent resize-y'
                                    defaultValue={""}
                                />
                                <div className='flex items-center gap-2 absolute bottom-0.5 right-0 m-3'>
                                    <ion-icon className='text-xl flex text-blue-700' name='image' />
                                    <ion-icon className='text-xl flex text-yellow-500' name='happy' />
                                </div>
                            </div>
                            <button
                                type='submit'
                                className='hidden text-sm rounded-full py-1.5 px-4 font-semibold bg-secondery'
                            >
                                {" "}
                                Replay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* create status */}
            <div className='hidden lg:p-20 uk- open closed' id='create-status' uk-modal=''>
                <form id='create-post-form' encType='multipart/form-data' onSubmit={handleFormSubmit} action=''>
                    <div className='uk-modal-dialog tt relative overflow-hidden mx-auto bg-white shadow-xl rounded-lg md:w-[520px] w-full dark:bg-dark2'>
                        <div className='text-center py-4 border-b mb-0 dark:border-slate-700'>
                            <h2 className='text-sm font-medium text-black'> Create Status </h2>
                            {/* close button */}
                            <button type='button' className='button-icon absolute top-0 right-0 m-2.5 uk-modal-close'>
                                <svg
                                    xmlns='http://www.w3.org/2000/svg'
                                    fill='none'
                                    viewBox='0 0 24 24'
                                    strokeWidth='1.5'
                                    stroke='currentColor'
                                    className='w-6 h-6'
                                >
                                    <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        </div>
                        <div className='space-y-5 mt-3 p-2'>
                            <textarea
                                name='body'
                                className='post_body w-full !text-black placeholder:!text-black !bg-white !border-transparent focus:!border-transparent focus:!ring-transparent !font-normal !text-xl   dark:!text-white dark:placeholder:!text-white dark:!bg-slate-800'
                                rows={6}
                                placeholder='What do you have in mind?'
                                defaultValue={""}
                                
                            />
                        </div>
                        <div className='flex items-center gap-2 text-sm py-2 px-4 font-medium flex-wrap'>
                            <button
                                type='button'
                                className='flex items-center gap-1.5 bg-sky-50 text-sky-600 rounded-full py-1 px-2 border-2 border-sky-100 dark:bg-sky-950 dark:border-sky-900'
                            >
                                <ion-icon name='image' className='text-base' />
                                <input
                                    name='media_post'
                                    type='file'
                                    className='file-input file-input-bordered file-input-xs w-full max-w-xs'
                                   
                                />
                            </button>
                            <div className='btn' onClick={() => document.getElementById("my_modal_1").showModal()}>
                                Categories
                            </div>
                            <dialog id='my_modal_1' className='modal'>
                                <div className='modal-box w-[400px]'>
                                    <div className='modal-action flex flex-col dark:border-slate-700'>
                                        <div className='p-5 flex justify-between items-center'>
                                            <input
                                                className='checkbox checkbox-info select_category'
                                                type='checkbox'
                                                name='category'
                                                id='Technology'
                                                value='Technology'
                                            />
                                            <label htmlFor='Technology'>Technology</label>
                                            <input
                                                className='checkbox checkbox-info select_category'
                                                type='checkbox'
                                                name='category'
                                                id='Health'
                                                value='Health'
                                            />
                                            <label htmlFor='Health'>Health</label>
                                            <input
                                                className='checkbox checkbox-info select_category'
                                                type='checkbox'
                                                name='category'
                                                id='Politic'
                                                value='Politics'
                                            />
                                            <label htmlFor='Politic'>Politics</label>
                                        </div>
                                        <div className='p-5 flex justify-between items-center'>
                                            <input
                                                className='checkbox checkbox-info select_category'
                                                type='checkbox'
                                                name='category'
                                                id='Sport'
                                                value='Sports'
                                            />
                                            <label htmlFor='Sport'>Sports</label>
                                            <input
                                                className='checkbox checkbox-info select_category'
                                                type='checkbox'
                                                name='category'
                                                id='Religion'
                                                value='Religion'
                                            />
                                            <label htmlFor='Religion'>Religion</label>
                                            <input
                                                className='checkbox checkbox-info select_category'
                                                type='checkbox'
                                                name='category'
                                                id='Other'
                                                value='Others'
                                            />
                                            <label htmlFor='Other'>Others</label>
                                        </div>
                                        <form method='dialog'>
                                            {/* if there is a button in form, it will close the modal */}
                                            <button className='btn'>Close</button>
                                        </form>
                                    </div>
                                </div>
                            </dialog>
                        </div>
                        <div className='p-5 flex justify-between items-center'>
                            <select
                                id='selectVisibility'
                                onChange={displayFriend}
                                name='visibility'
                                className='select select-bordered w-26 max-w-xs'
                            >
                                <option disabled defaultValue='Public'>
                                    Audience
                                </option>
                                <option value='public'>Public</option>
                                <option value='private'>Private</option>
                                <option value='almost private'>Almost private</option>
                            </select>
                            <select
                                name='followers'
                                id='friend'
                                className='select hidden select-bordered  w-26 max-w-xs'
                                multiple
                            >
                                <option disabled defaultValue='option1'>
                                    Select Friends
                                </option>
                                {followers.map((follow) => (
                                    <option key={follow.user_id} value={follow.user_id}>
                                        <label>
                                            {follow.first_name} {follow.last_name}{" "}
                                        </label>
                                    </option>
                                ))}
                            </select>
                            <div className='flex items-center gap-2'>
                                <button
                                    type='submit'
                                    id='but'
                                    className='button bg-blue-500 text-white py-2 px-12 text-[14px]'
                                >
                                    {" "}
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};
