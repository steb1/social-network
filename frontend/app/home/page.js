"use client";
import React, { useEffect, useState } from "react";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import AddStory from "../components/addStory";
import { PostText, PostPlaceholder } from "../components/posts";
import { Modal } from "../components/modal";
import { Rightbar } from "../components/rightbar";
import "../../public/assets/js/script.js";
import "../../public/assets/js/simplebar.js";
import config from "@/config";

export const fetchFollowers = async (setFollowers) => {
  const response = await fetch(config.serverApiUrl + "getFollowers", {
    method: "GET",
    credentials: "include",
  });
  if (response.ok) {
    const followers = await response.json();
    console.log("response followers: ", followers);
    setFollowers(followers);
    return followers;
  }
};

const fetchAllPosts = async (setPosts, setServerError) => {
  try {
    const response = await fetch(config.serverApiUrl + "getAllPosts", {
      method: "GET",
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      setPosts(data);
      console.log("dtata", data);
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

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [serverError, setServerError] = useState(null);
  const [followers, setFollowers] = useState([]);
  useEffect(() => {
    fetchAllPosts(setPosts, setServerError);
    fetchFollowers(setFollowers);
  }, []); // Empty dependency array ensures this runs only once after the initial render
  const handleSubmit = async (e) => {
    e.preventDefault();
    const NewformData = new FormData(e.currentTarget);
    const response = await fetch(config.serverApiUrl + "createPost", {
      method: "POST",
      credentials: "include",
      body: NewformData,
    });
    try {
      const jsonData = await response.json();
      if (response.ok) {
        console.log("post response:", jsonData);
        console.log("post sent");
        UIkit.modal("#create-status").hide();
        setPosts([jsonData, ...posts]);
        const body = document.querySelector(".post_body");
        const checkboxes = document.querySelectorAll(
          "input.select_category:checked"
        );
        body.value = "";
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });
      }
    } catch (error) {
      console.error("Erreur lors de la lecture de la réponse JSON :", error);
    }
  };

  return (
    <div id="wrapper" className="pt-15 space-x-2">
      {/* Header */}
      <Header />
      <div className="flex mt-5">
        {/* Fixed Sidebar */}
        <div className="fixed mt-2 left-0 top-12 max-sm:hidden max-md:hidden max-lg:hidden  overflow-y-visible touch-none h-full">
          <Sidebar />
        </div>

        <div className="flex-1 pt-8 px-5 md:max-w-[580px] xl:space-y-6 space-y-3 ml-80 ">
          {/* Add Story Section */}
          <Modal onSubmit={handleSubmit} followers={followers} />
          <AddStory />
          {/* Posts Section */}
          {posts.map((post) => (
            <PostText key={post.post_id} post={post} setPosts={setPosts} />
          ))}
          {serverError && <div>Error: {serverError}</div>}
          <PostPlaceholder />
          {/* Modal */}
        </div>

        {/* Fixed Rightbar */}
        <div className="block h-full mt-20 ml-20 max-sm:hidden max-md:hidden max-lg:hidden ">
          <Rightbar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
