package handler

import (
	"fmt"
	"net/http"
	"server/models"
	"strconv"
	"strings"
	"time"
)

func HandleCreateComment(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var comment models.Comment
	var apiError ApiError
	errs := r.ParseMultipartForm(10 << 20)
	if errs != nil {
		return
	}

	sessionToken := r.Header.Get("Authorization")
	session, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil {
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	comment.Content = strings.TrimSpace(r.FormValue("comment_body"))
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		apiError.Error = "Error: post_id is not a valid number!!!"
		return
	}
	comment.PostID=postID
	createdAt := time.Now()
	userId, err := strconv.Atoi(session.UserID)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	comment.AuthorID = userId
	errors := models.CommentRepo.CreateComment(&comment, createdAt)
	if errors != nil {
		fmt.Println(errs)
		apiError.Error = "An error occured."
		return
	}
	var sucess ApiSuccess
	sucess.Message = "Comment created !"
	WriteJSON(w, http.StatusOK, sucess)
}
