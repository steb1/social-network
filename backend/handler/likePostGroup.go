package handler

import (
	"fmt"
	"net/http"
	"server/lib"
	"server/models"
	"strconv"
)

func HandleLikePostGroup(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsPost(w, r)

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
		if err := models.PostGroupLikeRepo.DeletePostGroupLike(postLike.PostID, postLike.AuthorID); err != nil {
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
