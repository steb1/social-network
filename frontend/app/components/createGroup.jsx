"use client";
import config from "@/config";
import Link from "next/link";
import { useEffect } from "react";

export const CreateGroup = () => {
    useEffect(() => {
        let name = document.getElementById("GroupName");
        let description = document.getElementById("GroupDescription");
        let button = document.getElementById("createGroup");

        const handleSubmit = (e) => {
            if (name.value.trim().length > 0 && description.value.trim().length > 0) {
                button.classList.remove("btn-disabled");
            } else if (name.value.trim().length == 0 || description.value.trim().length == 0) {
                button.classList.add("btn-disabled");
            }
        };

        if (name) {
            name.addEventListener("input", handleSubmit);
        }
        if (description) {
            description.addEventListener("input", handleSubmit);
        }
        if (button) {
            button.addEventListener("click", handleCreateGroup);
        }
    }, []);

    return (
        <Link href='#' className='dark:hover:text-slate-800' prefetch={false}>
            <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
                <path
                    fill='currentColor'
                    d='M11 17h2v-4h4v-2h-4V7h-2v4H7v2h4zm1 5q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20m0-8'
                />
            </svg>
            <li
                onClick={() => document.getElementById("my_modal_3").showModal()}
                className='dark:hover:text-slate-800'
                uk-scrollspy-class='uk-animation-fade'
            >
                <div className='rounded-lg cursor-pointer dark:text-white dark:hover:text-slate-800'>
                    <div className=' text-sm cursor-pointer dark:hover:text-slate-800 font-medium'>
                        Create Group
                        <dialog id='my_modal_3' className='modal'>
                            <div className='modal-box overflow-y-visible'>
                                <form method='dialog'>
                                    {/* if there is a button in form, it will close the modal */}
                                    <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'></button>
                                </form>
                                <div>
                                    <label className='form-control w-full max-w-xs'>
                                        <div className='label'>
                                            <span className='label-text'>Name</span>
                                        </div>
                                        <input
                                            id='GroupName'
                                            type='text'
                                            placeholder='Example : zone 01'
                                            required
                                            className='input input-bordered w-full max-w-xs'
                                        />
                                    </label>
                                    <label className='form-control'>
                                        <div className='label'>
                                            <span className='label-text mt-4'>Description</span>
                                        </div>
                                        <textarea
                                            id='GroupDescription'
                                            className='textarea textarea-bordered h-24'
                                            required
                                            placeholder='Something ...'
                                        ></textarea>
                                    </label>

                                    <button id='createGroup' className='btn btn-disabled btn-active btn-neutral mt-5'>
                                        Create
                                    </button>
                                </div>
                            </div>
                        </dialog>
                    </div>
                </div>
            </li>
        </Link>
    );
};

async function handleCreateGroup() {
    let name = document.getElementById("GroupName");
    let description = document.getElementById("GroupDescription");
    let button = document.getElementById("createGroup");

    if (name.value.trim().length == 0 || description.value.trim().length == 0) {
        return;
    }

    let requestData = {
        name: name.value.trim(),
        description: description.value.trim(),
    };

    let token = document.cookie.split("=")[1];

    if (token) {
        // Use the token as needed
        console.log("Token:", token);
    } else {
        console.log("Token not found in cookies");
    }

    try {
        const response = await fetch(config.serverApiUrl + "createGroup", {
            method: "POST",
            cache: "no-cache",
            headers: {
                Authorization: token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
        });

        if (response.ok) {
            console.log("ooook");
            name.value = "";
            description.value = "";
            button.classList.add("btn-disabled");
        }
    } catch (error) {
        console.error("Error while fetching groups:", error);
    }
}
