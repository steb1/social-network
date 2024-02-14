package handler

import (
	"encoding/json"
	"net/http"
	"server/models"
	"strconv"
)

func HandleLikePost(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		HandleOptions(w, r)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var apiError ApiError
	var postLike models.PostLike

	sessionToken := r.Header.Get("Authorization")
	session, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil {
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	postLike.AuthorID, err = strconv.Atoi(session.UserID)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if err := json.NewDecoder(r.Body).Decode(&postLike); err != nil {
		apiError.Error = "Failed to decode like request body."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	postLike.Rate=1
	
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
