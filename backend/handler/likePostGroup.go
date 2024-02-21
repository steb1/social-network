package handler

import (
	"fmt"
	"net/http"
	"server/models"
	"strconv"
)

func HandleLikePostGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		HandleOptions(w, r)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var apiError ApiError
	var postLike models.PostGroupLike

	_, ok := IsAuthenticated(r)

	if !ok {
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	sessionToken := r.Header.Get("Authorization")
	session, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil {
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	userId, err := strconv.Atoi(session.UserID)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	postID := r.FormValue("PostID")

	intpostId, _ := strconv.Atoi(fmt.Sprintf("%v", postID))

	postLike.Rate = 1
	postLike.PostID = intpostId
	postLike.AuthorID = userId

	// Check if the post is already liked by the user
	isLiked := models.PostGroupLikeRepo.IsLiked(postLike.PostID, postLike.AuthorID)

	if isLiked {
		// Post is already liked, handle unlike logic
		if err := models.PostLikeRepo.DeletePostLike(postLike.PostID, postLike.AuthorID); err != nil {
			apiError.Error = "Failed to unlike post."
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}
	} else {
		// Post is not liked, handle like logic
		if _, err := models.PostGroupLikeRepo.CreatePostGroupLike(postLike); err != nil {
			apiError.Error = "Failed to like post"
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}
	}
}
