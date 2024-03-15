"use client";
import config from "@/config";
import React, { useEffect, useState } from "react";

export const fetchFollowers = async (setFollowers) => {
  let token = document.cookie.split("=")[1];
  const response = await fetch(config.serverApiUrl + "getFollowers", {
    cache: "no-cache",
    method: "GET",
    headers: {
      Authorization: token,
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
    let token = document.cookie.split("=")[1];
    const NewformData = new FormData(e.currentTarget);
    const response = await fetch(config.serverApiUrl + "createPost", {
      method: "POST",
      cache: "no-cache",
      headers: {
        Authorization: token,
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
      {/* create status */}
      <div
        className="hidden lg:p-20 uk- open closed"
        id="create-status"
        uk-modal=""
      >
        <form
          id="create-post-form"
          encType="multipart/form-data"
          onSubmit={handleFormSubmit}
          action=""
        >
          <div className="uk-modal-dialog tt relative overflow-hidden mx-auto bg-white shadow-xl rounded-lg md:w-[520px] w-full dark:bg-dark2">
            <div className="text-center py-4 border-b mb-0 dark:border-slate-700">
              <h2 className="text-sm font-medium text-black">
                {" "}
                Create Status{" "}
              </h2>
              {/* close button */}
              <button
                type="button"
                className="button-icon absolute top-0 right-0 m-2.5 uk-modal-close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-5 mt-3 p-2">
              <textarea
                name="body"
                className="post_body w-full !text-black placeholder:!text-black !bg-white !border-transparent focus:!border-transparent focus:!ring-transparent !font-normal !text-xl   dark:!text-white dark:placeholder:!text-white dark:!bg-slate-800"
                rows={6}
                placeholder="What do you have in mind?"
                defaultValue={""}
              />
            </div>
            <div className="flex items-center gap-2 text-sm py-2 px-4 font-medium flex-wrap">
              <button
                type="button"
                className="flex items-center gap-1.5 bg-sky-50 text-sky-600 rounded-full py-1 px-2 border-2 border-sky-100 dark:bg-sky-950 dark:border-sky-900"
              >
                <ion-icon name="image" className="text-base" />
                <input
                  name="media_post"
                  type="file"
                  className="file-input file-input-bordered file-input-xs w-full max-w-xs"
                />
              </button>
              <div
                className="btn"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                Categories
              </div>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box w-[400px]">
                  <div className="modal-action flex flex-col dark:border-slate-700">
                    <div className="p-5 flex justify-between items-center">
                      <input
                        className="checkbox checkbox-info select_category"
                        type="checkbox"
                        name="category"
                        id="Technology"
                        value="Technology"
                      />
                      <label htmlFor="Technology">Technology</label>
                      <input
                        className="checkbox checkbox-info select_category"
                        type="checkbox"
                        name="category"
                        id="Health"
                        value="Health"
                      />
                      <label htmlFor="Health">Health</label>
                      <input
                        className="checkbox checkbox-info select_category"
                        type="checkbox"
                        name="category"
                        id="Politic"
                        value="Politics"
                      />
                      <label htmlFor="Politic">Politics</label>
                    </div>
                    <div className="p-5 flex justify-between items-center">
                      <input
                        className="checkbox checkbox-info select_category"
                        type="checkbox"
                        name="category"
                        id="Sport"
                        value="Sports"
                      />
                      <label htmlFor="Sport">Sports</label>
                      <input
                        className="checkbox checkbox-info select_category"
                        type="checkbox"
                        name="category"
                        id="Religion"
                        value="Religion"
                      />
                      <label htmlFor="Religion">Religion</label>
                      <input
                        className="checkbox checkbox-info select_category"
                        type="checkbox"
                        name="category"
                        id="Other"
                        value="Others"
                      />
                      <label htmlFor="Other">Others</label>
                    </div>
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
            <div className="p-5 flex justify-between items-center">
              <select
                id="selectVisibility"
                onChange={displayFriend}
                name="visibility"
                className="select select-bordered w-26 max-w-xs"
              >
                <option disabled defaultValue="Public">
                  Audience
                </option>
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="almost private">Almost private</option>
              </select>
              <select
                name="followers"
                id="friend"
                className="select hidden select-bordered  w-26 max-w-xs"
                multiple
              >
                <option disabled defaultValue="option1">
                  Select Friends
                </option>
                {followers &&
                  Array.isArray(followers) &&
                  followers.map((follow) => (
                    <option key={follow.user_id} value={follow.user_id}>
                      <label>
                        {follow.first_name} {follow.last_name}{" "}
                      </label>
                    </option>
                  ))}
              </select>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  id="but"
                  className="button bg-blue-500 text-white py-2 px-12 text-[14px]"
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
