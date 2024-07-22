"use client";
import config from "@/config";
import { Modal } from "../components/modal";
import React, { useEffect, useState } from "react";
import { PostText } from "./PostText";

const fetchAllPosts = async (setPosts, setServerError) => {
    let token = document.cookie.split("=")[1]
    try {
        const response = await fetch(config.serverApiUrl + "getAllPosts", {
            cache: "no-cache",
            method: "GET",
            headers: {
                'Authorization': token,
              },
        });
        if (response.ok) {
            const data = await response.json();
            setPosts(data);
        } else {
            const errorResponse = await response.json();
            const errorMessage = errorResponse.error || "An error occurred.";
            console.error("No posts retrieved:", errorMessage);
            setServerError(`No posts retrieved: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error while fetching posts:", error);
    }
};

export const AllPostText = () => {
    let [posts, setPosts] = useState([]);
    useEffect(() => {
        fetchAllPosts(setPosts);
    }, []);

    return (
        <>
            <Modal setPosts={setPosts} posts={posts} />
            <PostText setPosts={setPosts} posts={posts} />
        </>
    );
};

export const PostPlaceholder = () => {
    return (
        <div className="rounded-xl shadow-sm p-4 space-y-4 bg-slate-200/40 animate-pulse border1 dark:bg-dark2">
            <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-300/20" />
                <div className="flex-1 space-y-3">
                    <div className="w-40 h-5 rounded-md bg-slate-300/20" />
                    <div className="w-24 h-4 rounded-md bg-slate-300/20" />
                </div>
                <div className="w-6 h-6 rounded-full bg-slate-300/20" />
            </div>
            <div className="w-full h-52 rounded-lg bg-slate-300/10 my-3"> </div>
            <div className="flex gap-3">
                <div className="w-16 h-5 rounded-md bg-slate-300/20" />
                <div className="w-14 h-5 rounded-md bg-slate-300/20" />
                <div className="w-6 h-6 rounded-full bg-slate-300/20 ml-auto" />
                <div className="w-6 h-6 rounded-full bg-slate-300/20  " />
            </div>
        </div>
    );
};
