"use client";
import config from "@/config";
import { fetchGroupDetail } from "./groupDetail";


export const PostText = ( { posts,  groupId, setPosts , setGroup, setEvents, setRequests, setMessages, setServerError,  setIsOwner, setMembers } ) => {

	const handleSubmitComment = async (post_id) => {
		const formId = `create-comment-form-${post_id}`;
		const form = document.getElementById(formId);
		const commentContent = form.querySelector('textarea[name="comment_body"]').value.trim();
		if (commentContent === "") {
			console.log("Comment cannot be empty");
			return;
		}
		if (commentContent.length > 400) {
			console.log("Comment exceeds character limit (400 characters)");
			return;
		}

		const formDataJson = new FormData(form);
		formDataJson.append("post_id", post_id);

		const response = await fetch(config.serverApiUrl + "createCommentGroup", {
			method: "POST",
			credentials: "include",
			body: formDataJson,
		});

		try {
		if (response.ok) {
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.includes("application/json")) {
			  const data = await response.json();
			  fetchGroupDetail(setPosts, setGroup, setEvents, setRequests, setMessages, setServerError, groupId, setIsOwner, setMembers)
			} else {
			  console.error("Response is not in JSON format");
			}
		  } else {
			const errorResponse = await response.json();
			const errorMessage = errorResponse.error || "An error occurred.";
			console.error("No Group retrieved:", errorMessage);
		  }
		} catch (error) {
			console.error("Error while sending like:", error);
		}
	};

	const handleLikeClick = async (PostID) => {
         let  token = document.cookie.split("=")[1]
        const formData = new FormData();
        formData.append("PostID", PostID);
		console.log(PostID, 'feeeurr');

        const response = await fetch(config.serverApiUrl + "likePostGroup", {
            method: "POST",
            headers: {
              'Authorization': token,
            },
            credentials: "include",
            body: formData,
          });
		try {
			if (response.ok) {
				console.log("like sent");
				fetchGroupDetail(setPosts, setGroup, setEvents, setRequests, setMessages, setServerError, groupId, setIsOwner, setMembers )
			} else {
				console.error("Failed to like post:");
			}
		} catch (error) {
			console.error("Error while sending like:", error);
		}
	};

	const handleCommentLikeClick = async (comment_id) => {
		const response = await fetch(config.serverApiUrl + "likeComment", {
			method: "POST",
			credentials: "include",
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
			{posts && posts.length > 0 ? posts.map((post) => (
				<div key={post.PostID} className="bg-white rounded-xl shadow-sm text-sm font-medium border1 dark:bg-dark2">
					{/* post heading */}
					<div className="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
						<a href="timeline.html">
							{" "}
							<img src="../assets/images/avatars/avatar-5.jpg" className="w-9 h-9 rounded-full" />{" "}
						</a>
						<div className="flex-1">
							<a href="timeline.html">
								{" "}
								<h4 className="text-black dark:text-white">
									{" "}
									 {post.AuthorName.charAt(0).toUpperCase() + post.AuthorName.slice(1).toLowerCase()}{" "}
								</h4>{" "}
							</a>
							<div className="text-xs text-gray-500 dark:text-white/80"> {post.CreatedAt}</div>
						</div>
						<div className="-mr-1">
							<button type="button" className="button__ico w-8 h-8" aria-haspopup="true" aria-expanded="false">
								{" "}
								<ion-icon className="text-xl md hydrated" name="ellipsis-horizontal" role="img" aria-label="ellipsis horizontal" />{" "}
							</button>
							<div className="w-[245px] uk-dropdown" uk-dropdown="pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true; mode: click">
								<nav>
									<a href="#">
										{" "}
										<ion-icon className="text-xl shrink-0 md hydrated" name="bookmark-outline" role="img" aria-label="bookmark outline" /> Add to favorites{" "}
									</a>
									<a href="#">
										{" "}
										<ion-icon className="text-xl shrink-0 md hydrated" name="notifications-off-outline" role="img" aria-label="notifications off outline" /> Mute Notification{" "}
									</a>
									<a href="#">
										{" "}
										<ion-icon className="text-xl shrink-0 md hydrated" name="flag-outline" role="img" aria-label="flag outline" /> Report this post{" "}
									</a>
									<a href="#">
										{" "}
										<ion-icon className="text-xl shrink-0 md hydrated" name="share-outline" role="img" aria-label="share outline" /> Share your profile{" "}
									</a>
									<hr />
									<a href="#" className="text-red-400 hover:!bg-red-50 dark:hover:!bg-red-500/50">
										{" "}
										<ion-icon className="text-xl shrink-0 md hydrated" name="stop-circle-outline" role="img" aria-label="stop circle outline" /> Unfollow{" "}
									</a>
								</nav>
							</div>
						</div>
					</div>
					<div className="sm:px-4 p-2.5 pt-0">
						<p className="font-normal"> {post.Content}</p>
						{/* categories */}
						{/* <div className="flex gap-1 text-xs font-semibold">
							{post.category.map((category, index) => (
								<span key={index} className="text-blue-500">
									#{category}
								</span>
							))}
						</div> */}
					</div>
					{/* post image */}
					{post.HasImage === 1 ? (
						<div>
							<div className="relative w-full lg:h-96 h-full sm:px-4">
								<img src={`${config.serverApiUrl}imgPost?id=${post.PostID}`} className="sm:rounded-lg w-full h-full object-cover" />
							</div>
						</div>
					) : (
						""
					)}
					{/* post icons */}
					<div className="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
						<div>
							<div className="flex items-center gap-2.5">
								<button type="button" onClick={() => handleLikeClick(post.PostID)} className={`button-icon  ${post.IsLiked ? "bg-red-100 text-red-500" : "bg-gray-200"} dark:bg-slate-700`}>
									{" "}
									<ion-icon className="text-lg" name="heart" />{" "}
								</button>
								<span>{post.NumberOfLikes}</span>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<button type="button" className="button-icon bg-slate-200/70 dark:bg-slate-700">
								{" "}
								<ion-icon className="text-lg" name="chatbubble-ellipses" />{" "}
							</button>
							<span>{post.NumberOfComments}</span>
						</div>
						<button type="button" className="button-icon ml-auto">
							{" "}
							<ion-icon className="text-xl" name="paper-plane-outline" />{" "}
						</button>
						<button type="button" className="button-icon">
							{" "}
							<ion-icon className="text-xl" name="share-outline" />{" "}
						</button>
					</div>
					{/* comments */}
					<div className="sm:p-4 p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40">
						{ post.ListOfComments && post.ListOfComments.length > 0 ? post.ListOfComments.map((comment) => (
							<div key={comment.comment_id} className="flex items-start gap-3 relative">
								<a href="timeline.html">
									<img src="assets/images/avatars/avatar-2.jpg" className="w-6 h-6 mt-1 rounded-full" />
								</a>
								<div className="flex-1 relative">
									<a href="timeline.html" className="text-black font-medium inline-block dark:text-white">
										{comment.User.first_name} {comment.User.last_name}
									</a>
									<p className="mt-0.5 break-all w-4/5">{comment.content}</p>
									{/* Like Button for Comment */}
									<div className="flex items-center absolute top-1 right-1 gap-2 text-xs font-semibold">
										<button type="button" onClick={() => handleCommentLikeClick(comment.commentID)} className={`button-icon ${comment.is_liked ? "bg-red-100 text-red-500" : "bg-gray-200"} dark:bg-slate-700`}>
											<ion-icon className="text-lg" name="heart" />
										</button>
										<span className="ml-1">{comment.like}</span>
									</div>
								</div>
							</div>
						)) : ""}
					</div>
					{/* add comment */}
					<div className="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">
						<img src="../assets/images/avatars/avatar-7.jpg" className="w-6 h-6 rounded-full" />
						<form onSubmit={() => handleSubmitComment(post.PostID)} id={`create-comment-form-${post.PostID}`} className="flex-1 relative overflow-hidden h-10 create-comment-form">
							<textarea placeholder="Add Comment...." name="comment_body" rows={1} className="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent" aria-haspopup="true" aria-expanded="false" defaultValue={""} />
						</form>
						<button onClick={() => handleSubmitComment(post.PostID)} className="text-sm rounded-full py-1.5 px-3.5 bg-secondery">
							Send
						</button>
					</div>
				</div>
			)) : <Placeholder/> }
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
