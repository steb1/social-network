"use client";
"use client";
import config from "@/config";
import Link from "next/link";
import { useState } from "react";
import { PostPlaceholder } from "./posts";

export const PostText = ({ posts, setPosts }) => {
  const [showAllComments, setShowAllComments] = useState({});
  const [imageSelected, setImageSelected] = useState(false);

  const handleFileInputChange = (postId) => {
    const fileInput = document.getElementById(`chooseImageC-${postId}`);
    if (fileInput.files.length > 0) {
      setImageSelected((prevSelected) => ({
        ...prevSelected,
        [postId]: true,
      }));
    } else {
      setImageSelected((prevSelected) => ({
        ...prevSelected,
        [postId]: false,
      }));
    }
  };

  const toggleCommentsVisibility = (postId) => {
    setShowAllComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };
  const handleSubmitComment = async (post_id) => {
    let token = document.cookie.split("=")[1];
    const formId = `create-comment-form-${post_id}`;
    const form = document.getElementById(formId);
    const commentContent = form
      .querySelector('textarea[name="comment_body"]')
      .value.trim();
    if (commentContent === "") {
      console.log("Comment cannot be empty");
      return;
    }
    if (commentContent.length > 400) {
      console.log("Comment exceeds character limit (400 characters)");
      return;
    }
    const commentImg = form.querySelector(
      `input[name="media_post_c"][id="chooseImageC-${post_id}"]`
    ).files[0];

    const formDataJson = new FormData(form);
    formDataJson.append("post_id", post_id);
    formDataJson.append("media_post_c", commentImg);

    const response = await fetch(config.serverApiUrl + "createComment", {
      method: "POST",
      cache: "no-cache",
      headers: {
        Authorization: token,
      },
      headers: {
        Authorization: token,
      },
      body: formDataJson,
    });
    try {
      const jsonData = await response.json();
      if (response.ok) {
        console.log("comment sent");
        form.reset();
        setImageSelected((prevSelected) => ({
          ...prevSelected,
          [post_id]: false,
        }));
        setImageSelected((prevSelected) => ({
          ...prevSelected,
          [post_id]: false,
        }));
        setPosts(jsonData.posts);
      } else {
        console.error("Failed to submit comment:", jsonData);
      }
    } catch (error) {
      console.error("Error while submitting comment:", error);
    }
  };

  const handleLikeClick = async (post_id) => {
    let token = document.cookie.split("=")[1];
    const response = await fetch(config.serverApiUrl + "likePost", {
      method: "POST",
      cache: "no-cache",
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        post_id: post_id,
      }),
    });
    try {
      const jsonData = await response.json();
      if (response.ok) {
        console.log("like sent");
        setPosts(jsonData.posts);
      } else {
        console.error("Failed to like post:", jsonData);
      }
    } catch (error) {
      console.error("Error while sending like:", error);
    }
  };

  const handleCommentLikeClick = async (comment_id) => {
    let token = document.cookie.split("=")[1];
    const response = await fetch(config.serverApiUrl + "likeComment", {
      method: "POST",
      cache: "no-cache",
      headers: {
        Authorization: token,
      },
      body: JSON.stringify({
        comment_id: comment_id,
      }),
    });
    try {
      const jsonData = await response.json();
      if (response.ok) {
        console.log("like comment sent");
        setPosts(jsonData.posts);
      } else {
        console.error("Failed to like comment:", jsonData);
      }
    } catch (error) {
      console.error("Error while sending like comment:", error);
    }
  };

  return (
    <>
      {posts && Array.isArray(posts) ? (
        posts.map((post) => (
          <div
            key={post.post_id}
            className="bg-white rounded-xl shadow-sm text-sm font-medium border1 dark:bg-dark2"
          >
            {/* post heading */}
            <div className="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
              <Link href={`/profile/${post.author_id}`}>
                {" "}
                <img
                  src={`${config.ServerApiImage}/${post.User.avatar}`}
                  className="w-9 h-9 rounded-full"
                />{" "}
              </Link>
              <div className="flex-1">
                <Link href={`/profile/${post.author_id}`}>
                  {" "}
                  <h4 className="text-black dark:text-white">
                    {" "}
                    {post.User.first_name} {post.User.last_name}{" "}
                    {post.User.nickname && `(${post.User.nickname})`}{" "}
                  </h4>{" "}
                </Link>
                <div className="text-xs text-gray-500 dark:text-white/80">
                  {" "}
                  {post.created_at}
                </div>
              </div>
            </div>
            <div className="sm:px-4 p-2.5 pt-0">
              <p className="font-normal"> {post.content}</p>
              {/* categories */}
              <div className="flex gap-1 text-xs font-semibold">
                {post.category.map((category, index) => (
                  <span key={index} className="text-blue-500">
                    #{category}
                  </span>
                ))}
              </div>
            </div>
            {/* post image */}
            {post.has_image === 1 ? (
              <div>
                <div className="relative w-full lg:h-96 h-full sm:px-4">
                  <img
                    src={`${config.serverApiUrl}/imgPost?id=${post.post_id}`}
                    className="sm:rounded-lg w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              ""
            )}
            {/* post icons */}
            <div className="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
              <div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleLikeClick(post.post_id)}
                    className={`button-icon  ${post.is_liked ? "bg-red-100 text-red-500" : "bg-gray-200"} dark:bg-slate-700`}
                  >
                    {" "}
                    <ion-icon className="text-lg" name="heart" />{" "}
                  </button>
                  <span>{post.like}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="button-icon bg-slate-200/70 dark:bg-slate-700"
                >
                  {" "}
                  <ion-icon
                    className="text-lg"
                    name="chatbubble-ellipses"
                  />{" "}
                </button>
                <span>{post.Comments.length}</span>
              </div>
            </div>
            {/* comments */}
            <div
              className="sm:p-4 p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40 overflow-hidden"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {post.Comments.slice(
                0,
                showAllComments[post.post_id] ? post.Comments.length : 2
              ).map((comment, index) => (
                <div
                  key={comment.comment_id}
                  className="flex items-start gap-3 relative"
                >
                  <Link href={`/profile/${comment.author_id}`}>
                    <img
                      src={`${config.ServerApiImage}/${comment.User.avatar}`}
                      className="w-6 h-6 mt-1 rounded-full"
                    />
                  </Link>
                  <div className="flex-1 relative">
                    <Link
                      href={`/profile/${comment.author_id}`}
                      className="text-black font-medium inline-block dark:text-white"
                    >
                      {comment.User.first_name} {comment.User.last_name}
                    </Link>
                    <div className="mt-0.5 break-all w-4/5">
                      <p> {comment.content} </p>
                      {/* comment image */}
                      {comment.has_image === 1 ? (
                        <div className="avatar">
                          <div className="relative w-32 rounded ">
                            <img
                              src={`${config.serverApiUrl}/imgComment?id=${comment.comment_id}`}
                              className="sm:rounded-lg w-full h-full object-cover p-1"
                            />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {/* Like Button for Comment */}
                    <div className="flex items-center absolute top-1 right-1 gap-2 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() =>
                          handleCommentLikeClick(comment.comment_id)
                        }
                        className={`button-icon ${comment.is_liked ? "bg-red-100 text-red-500" : "bg-gray-200"} dark:bg-slate-700`}
                      >
                        <ion-icon className="text-lg" name="heart" />
                      </button>
                      <span className="ml-1">{comment.like}</span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Show more comments button */}
              {post.Comments.length > 2 && (
                <button
                  onClick={() => toggleCommentsVisibility(post.post_id)}
                  className="flex items-center gap-1"
                >
                  {showAllComments[post.post_id] ? (
                    <>
                      <span>Show Less</span>
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Show More</span>
                      <svg
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              )}
            </div>
            {/* add comment */}
            <div className="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">
              <img
                src={`${config.ServerApiImage}/${localStorage.getItem("avatar")}`}
                className="w-6 h-6 rounded-full"
              />
              <form
                onSubmit={() => handleSubmitComment(post.post_id)}
                id={`create-comment-form-${post.post_id}`}
                className="flex-1 relative overflow-hidden h-10 create-comment-form"
              >
                <textarea
                  placeholder="Add Comment...."
                  name="comment_body"
                  rows={1}
                  className="w-[calc(87.3333%)] resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent"
                  aria-haspopup="true"
                  aria-expanded="false"
                  defaultValue={""}
                />
                <label
                  htmlFor={`chooseImageC-${post.post_id}`}
                  className={`flex items-center w-[calc(9%)] absolute top-1 right-1 gap-2 font-semibold  cursor-pointer hover:bg-opacity-80 p-1 px-1.5 rounded-xl transition-all hover:bg-red-300 dark:bg-white/10 dark:hover:bg-white/20 ${imageSelected[post.post_id] ? "bg-red-600/60" : "bg-pink-100/60"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 stroke-pink-600 fill-pink-200/70"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#2c3e50"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M15 8h.01"></path>
                    <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z"></path>
                    <path d="M3.5 15.5l4.5 -4.5c.928 -.893 2.072 -.893 3 0l5 5"></path>
                    <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l2.5 2.5"></path>
                  </svg>
                </label>
                <input
                  name="media_post_c"
                  id={`chooseImageC-${post.post_id}`}
                  type="file"
                  className="file-input hidden file-input-bordered file-input-xs w-0 bg-transparent"
                  onChange={() => handleFileInputChange(post.post_id)}
                />
              </form>
              <button
                onClick={() => handleSubmitComment(post.post_id)}
                className="text-sm rounded-full py-1.5 px-3.5 dark:bg-slate-600 bg-secondery"
              >
                Send
              </button>
            </div>
          </div>
        ))
      ) : (
        <PostPlaceholder />
      )}
    </>
  );
};
