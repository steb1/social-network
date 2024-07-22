package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"server/lib"
	"server/models"
	"strconv"
)

func HandleLikePost(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsPost(w, r)

	var apiError ApiError
	var postLike models.PostLike

	sessionToken := r.Header.Get("Authorization")
	session, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil{
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	var errC error
	postLike.AuthorID, errC = strconv.Atoi(session.UserID)
	if errC != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	} 

	if err := json.NewDecoder(r.Body).Decode(&postLike); err != nil {
		apiError.Error = "Failed to decode like request body."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	intUserId, _ := strconv.Atoi(session.UserID)

	post, err := models.PostRepo.GetPost(postLike.PostID)
	if err != nil {
		apiError.Error = "Error cannot get post !!!"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}


	if post.Visibility == "private" {
		exist, err := models.SubscriptionRepo.UserAlreadyFollow(intUserId, post.AuthorID)
		if err != nil {
			fmt.Println("-----error----", err)

			apiError.Error = "Error cannot get post !!!"
			WriteJSON(w, http.StatusBadRequest, apiError)
			return
		}

		if !exist {
			apiError.Error = "Error: User is not allowed to comment" 
			WriteJSON(w, http.StatusMethodNotAllowed, apiError)
			return
		}
	}
	postLike.Rate = 1

	// Check if the post is already liked by the user
	isLiked, err := models.PostLikeRepo.IsPostLikedByCurrentUser(postLike.PostID, postLike.AuthorID)
	if err != nil {
		apiError.Error = "Failed to check if post is liked by user."
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}
	if isLiked {
		// Post is already liked, handle unlike logic
		if err := models.PostLikeRepo.DeletePostLike(postLike.PostID, postLike.AuthorID); err != nil {
			apiError.Error = "Failed to unlike post."
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}
	} else {
		// Post is not liked, handle like logic
		if err := models.PostLikeRepo.CreatePostLike(&postLike); err != nil {
			apiError.Error = "Failed to like post"
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}
	}

	posts := RetreiveAllPosts(w, r, postLike.AuthorID, apiError)

	var successResponse struct {
		Message string         `json:"message"`
		Posts   []*models.Post `json:"posts"`
	}

	successResponse.Message = "like or dislike saved!"
	successResponse.Posts = posts

	WriteJSON(w, http.StatusOK, successResponse)
}

func HandleLikeComment(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsPost(w,r)

	var apiError ApiError
	var commentLike models.CommentLike

	sessionToken := r.Header.Get("Authorization")
	session, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil{
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	var errC error
	commentLike.AuthorID, errC = strconv.Atoi(session.UserID)
	if errC != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&commentLike); err != nil {
		apiError.Error = "Failed to decode like request body."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	commentLike.Rate = 1

	comment, err := models.CommentRepo.GetComment(commentLike.CommentID)
	if err != nil {
		fmt.Println("-----error 0000 comment----", err)
		apiError.Error = "Error cannot get post !!!"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	intUserId, _ := strconv.Atoi(session.UserID)
	post, err := models.PostRepo.GetPost(comment.PostID)

	if err != nil {
		fmt.Println("-----error 11111 comment----", err)
		apiError.Error = "Error cannot get post !!!"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if post.Visibility == "private" {
		exist, err := models.SubscriptionRepo.UserAlreadyFollow(intUserId, post.AuthorID)
		if err != nil {
			fmt.Println("-----error 22222 comment----", err)
			apiError.Error = "Error cannot get post !!!"
			WriteJSON(w, http.StatusBadRequest, apiError)
			return
		}
		if !exist {
			apiError.Error = "Error: User is not allowed to comment"
			WriteJSON(w, http.StatusMethodNotAllowed, apiError)
			return
		}
	}

	// Check if the comment is already liked by the user
	isLiked, err := models.Comment_likeRepo.IsCommentLikedByCurrentUser(commentLike.CommentID, commentLike.AuthorID)
	if err != nil {
		apiError.Error = "Failed to check if comment is liked by user."
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	if isLiked {
		// Comment is already liked, handle unlike logic
		if err := models.Comment_likeRepo.DeleteCommentLike(commentLike.CommentID, commentLike.AuthorID); err != nil {
			apiError.Error = "Failed to unlike comment."
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}
	} else {
		// Comment is not liked, handle like logic
		if err := models.Comment_likeRepo.CreateCommentLike(&commentLike); err != nil {
			apiError.Error = "Failed to like comment"
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}
	}

	posts := RetreiveAllPosts(w, r, commentLike.AuthorID, apiError)

	var successResponse struct {
		Message string         `json:"message"`
		Posts   []*models.Post `json:"posts"`
	}

	successResponse.Message = "like or dislike comment saved!"
	successResponse.Posts = posts

	WriteJSON(w, http.StatusOK, successResponse)
}
