package handler

import (
	"net/http"
	"server/models"
	"strconv"
	"strings"
	"time"
)

func HandleCreateCommentGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		HandleOptions(w, r)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var comment models.CommentGroup
	var apiError ApiError

	cookie, errC := r.Cookie("social-network")
	session, errS := models.SessionRepo.GetSession(cookie.Value)
	if errS != nil || errC != nil {
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	comment.Content = strings.TrimSpace(r.FormValue("comment_body"))
	if comment.Content == "" || len(comment.Content) > 400 {
		apiError.Error = "Comment empty or too long."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		apiError.Error = "Error: post_id is not a valid number!!!"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	comment.PostID = postID
	comment.CreatedAt = time.Now().String()
	userId, err := strconv.Atoi(session.UserID)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	comment.AuthorID = userId
	_, err = models.CommentGroupRepo.CreateCommentGroup(comment)
	if err != nil {
		apiError.Error = "An error occured while creating comment."
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}
}
