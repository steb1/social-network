package handler

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"server/models"
	"strconv"
	"strings"
	"time"
)

func HandleCreatePost(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var post models.Post
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

	post.Content = strings.TrimSpace(r.FormValue("body"))
	post.Title = strings.TrimSpace(r.FormValue("title"))
	createdAt := time.Now()
	_categories := r.Form["category"]
	userId, err := strconv.Atoi(session.UserID)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	post.AuthorID = userId
	post.Visibility = "public"
	photo, _, _ := r.FormFile("media_post")
	hasImage := map[bool]int{true: 1, false: 0}[photo != nil]
	post.HasImage = hasImage
	categories := []int{}
	tabCategory, _ := models.CategoryRepo.GetAllCategories()
	__categories := make(map[string]int)
	for _, v := range tabCategory {
		__categories[v.Name] = v.CategoryID
	}
	if len(_categories) == 0 {
		categories = []int{6}
	} else {
		for _, v := range _categories {
			if _, ok := __categories[v]; ok {
				categories = append(categories, __categories[v])
			}
		}
	}
	errors := models.PostRepo.CreatePost(&post, photo, categories, createdAt)
	if errors != nil {
		fmt.Println(errs)
		apiError.Error = "An error occured."
		return
	}
	var sucess ApiSuccess
	sucess.Message = "Post created ! "
	WriteJSON(w, http.StatusOK, sucess)
}

func ImageHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
	var (
		imageId = r.URL.Query().Get("id")
	)
	img, err := ioutil.ReadFile("imgPost/" + imageId + ".jpg")
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "image/jpeg")
	w.Write(img)

}

func HandleGetAllPosts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	var apiError ApiError
	posts, err := models.PostRepo.GetAllPosts()
	if err != nil {
		fmt.Println(err)
		apiError.Error = "Something went wrong while getting all posts"
		WriteJSON(w, http.StatusInternalServerError, apiError)
	}
	for i := range posts {
		postIDStr := strconv.Itoa(posts[i].PostID)
		comments, err := models.CommentRepo.GetCommentsByPostID(postIDStr)
		if err != nil {
			fmt.Println(err)
			apiError.Error = "Something went wrong while getting comments inside posts"
			WriteJSON(w, http.StatusInternalServerError, apiError)
		}
		
		posts[i].Comments = comments
	}

	WriteJSON(w, http.StatusOK, posts)
}
