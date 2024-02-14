package handler

import (
	"fmt"
	"net/http"
	"server/models"
	"strconv"
	"strings"
	"time"
)

func HandleOptions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.WriteHeader(http.StatusOK)
}

func HandleCreateComment(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		HandleOptions(w, r)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var comment models.Comment
	var apiError ApiError

	sessionToken := r.Header.Get("Authorization")
	session, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil {
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	comment.Content = strings.TrimSpace(r.FormValue("comment_body"))
	if comment.Content == "" {
		apiError.Error = "Comment cannot be empty."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	postID, err := strconv.Atoi(r.FormValue("post_id"))
	if err != nil {
		fmt.Println("Error: post_id is not a valid number!!!")
		apiError.Error = "Error: post_id is not a valid number!!!"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	comment.PostID = postID
	createdAt := time.Now()
	userId, err := strconv.Atoi(session.UserID)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	comment.AuthorID = userId
	errors := models.CommentRepo.CreateComment(&comment, createdAt)
	if errors != nil {
		fmt.Println(errors)
		apiError.Error = "An error occured while creating comment."
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	posts := RetreiveAllPosts(w, r, comment.AuthorID, apiError)

	var successResponse struct {
		Message string         `json:"message"`
		Posts   []*models.Post `json:"posts"`
	}

	successResponse.Message = "Comment created!"
	successResponse.Posts = posts

	WriteJSON(w, http.StatusOK, successResponse)
}
