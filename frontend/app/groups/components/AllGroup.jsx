"use client";
import React, { useEffect, useState } from "react";
import { GroupOption } from "@/app/components/groupOption";

const AllGroup = ({ DataGroup }) => {
    console.log(DataGroup);
    const [groups, setPublicGroups] = useState([]);
    const [Owngroups, setOwnGroups] = useState([]);
    const [subcribedGroups, setSubcribedGroups] = useState([]);

    const [serverError, setServerError] = useState(null);

    useEffect(() => {
        setPublicGroups();
        setOwnGroups();
        setSubcribedGroups();
    }, [, ,]);

    return (
        <main id="site__main" className="2xl:ml-[--w-side]  xl:ml-[--w-side-sm] p-2.5 h-0 mt-0">
			<div className="max-w-[1065px] mx-auto max-lg:-m-2.5">

            <div className='flex flex-col flew-wrap mb-10'>
                <div className='flex flex-col'>
                    <h1 className='text-black text-xl font-bold'>Suggestions</h1>
                    <hr className='mt-3' />
                    <div className='carousel carousel-center w-[1000px] p-4 space-x-4 bg-neutral rounded-box'>
                        {groups ? (
                            groups.map((group) => <GroupOption key={group.id} group={group} />)
                        ) : (
                            <p>No groups available.</p>
                        )}
                    </div>
                </div>
                <div className='flex flex-col mt-10'>
                    <h1 className='text-black text-xl font-bold'>My groups</h1>
                    <hr className='mt-3' />
                    <div className='carousel carousel-center w-[1000px] p-4 space-x-4 bg-neutral rounded-box'>
                        {Owngroups ? (
                            Owngroups.map((group) => (
                                <a href={"/groups/" + group.group_id}>
                                    <div
                                        id={group.group_id}
                                        className='card card-compact w-96 bg-base-100 shadow-xl carousel-item w-96 h-64'
                                    >
                                        <figure>
                                            <img
                                                src='https://i0.wp.com/www.iedunote.com/img/28051/reference-groups.jpg?fit=1080%2C720&quality=100&ssl=1'
                                                alt='Shoes'
                                            />
                                        </figure>
                                        <div className='card-body'>
                                            <h2 className='card-title'>{group.title}</h2>
                                            <div className='card-actions justify-end'></div>
                                        </div>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <p>No groups available.</p>
                        )}
                    </div>
                </div>
                <div className='flex flex-col mt-10'>
                    <h1 className='text-black text-xl font-bold'>Subcribed Groups</h1>
                    <hr className='mt-3' />
                    <div className='carousel carousel-center w-[1000px] p-4 space-x-4 bg-neutral rounded-box'>
                        {subcribedGroups ? (
                            subcribedGroups.map((group) => (
                                <a href={"/groups/" + group.group_id}>
                                    <div
                                        id={group.group_id}
                                        className='card card-compact w-96 bg-base-100 shadow-xl carousel-item w-96 h-64'
                                    >
                                        <figure>
                                            <img
                                                src='https://i0.wp.com/www.iedunote.com/img/28051/reference-groups.jpg?fit=1080%2C720&quality=100&ssl=1'
                                                alt='Shoes'
                                            />
                                        </figure>
                                        <div className='card-body'>
                                            <h2 className='card-title'>{group.title}</h2>
                                            <div className='card-actions justify-end'></div>
                                        </div>
                                    </div>
                                </a>
                            ))
                        ) : (
                            <p>No groups available.</p>
                        )}
                    </div>
                </div>
            </div>
            </div>
        </main>
    );
};

export default AllGroup;
