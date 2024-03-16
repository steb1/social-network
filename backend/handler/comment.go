package handler

import (
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"server/lib"
	"server/models"
)

func HandleCreateComment(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsPost(w, r)

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
	createdAt := time.Now()
	userId, err := strconv.Atoi(session.UserID)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	comment.AuthorID = userId
	// image
	photo, _, _ := r.FormFile("media_post_c")
	hasImage := map[bool]int{true: 1, false: 0}[photo != nil]
	comment.HasImage = hasImage
	errors := models.CommentRepo.CreateComment(&comment, photo, createdAt)
	if errors != nil {
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
	lib.AddCorsGet(w, r)
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
