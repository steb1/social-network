package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"server/lib"
	"server/models"
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
	fmt.Println(r.FormValue("PostID"), "hereeee")

	postID, err := strconv.Atoi(r.FormValue("PostID"))
	if err != nil {
		fmt.Println(err, "erroroororo")
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
	photo, _, _ := r.FormFile("media_post_c")
	hasImage := map[bool]int{true: 1, false: 0}[photo != nil]
	comment.HasImage = hasImage

	err = models.CommentGroupRepo.CreateCommentGroup(comment, photo)
	if err != nil {
		apiError.Error = "An error occured while creating comment."
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	} else {
		response := make(map[string]interface{})

		response["ok"] = true

		lib.WriteJSONResponse(w, response)
	}
}

func HandleLikeCommentGroup(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var apiError ApiError
	var commentLike models.CommentGroupLike

	cookie, errC := r.Cookie("social-network")
	session, errS := models.SessionRepo.GetSession(cookie.Value)
	if errS != nil || errC != nil {
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
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

	// Check if the comment is already liked by the user
	isLiked := models.CommentGroupLikeRepo.IsLiked(commentLike.CommentID, commentLike.AuthorID)

	if isLiked {
		// Comment is already liked, handle unlike logic
		if err := models.CommentGroupLikeRepo.DeleteCommentGroupLike(commentLike.CommentID, commentLike.AuthorID); err != nil {
			apiError.Error = "Failed to unlike comment."
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}
	} else {
		// Comment is not liked, handle like logic
		if _, err := models.CommentGroupLikeRepo.CreateCommentGroupLike(commentLike); err != nil {
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

func ImageHandlerCommentGroup(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		HandleOptions(w, r)
		return
	}
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	imageId := r.URL.Query().Get("id")
	img, err := os.ReadFile("imgCommentGroup/" + imageId + ".jpg")
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "image/jpeg")
	w.Write(img)
}
