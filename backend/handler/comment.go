package handler

import (
	"fmt"
	"log"
	"net/http"
	"os"
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

	cookie, errC := r.Cookie("social-network")
	session, errS := models.SessionRepo.GetSession(cookie.Value)
	if (errS != nil || errC != nil) {
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	comment.Content = strings.TrimSpace(r.FormValue("comment_body"))
	if (comment.Content == "" || len(comment.Content)>400) {
		apiError.Error = "Comment empty or too long."
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
	//image
	photo, _, _ := r.FormFile("media_post_c")
	hasImage := map[bool]int{true: 1, false: 0}[photo != nil]
	comment.HasImage = hasImage
	errors := models.CommentRepo.CreateComment(&comment, photo, createdAt)
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

func ImageHandlerComment(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		HandleOptions(w, r)
		return
	}
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	imageId := r.URL.Query().Get("id")
	img, err := os.ReadFile("imgComment/" + imageId + ".jpg")
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "image/jpeg")
	w.Write(img)
}
