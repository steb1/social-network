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

func HandleCreatePost(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsPost(w, r)

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
	post.Title = "no title"
	createdAt := time.Now()
	_categories := r.Form["category"]
	userId, err := strconv.Atoi(session.UserID)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	post.AuthorID = userId
	post.Visibility = strings.TrimSpace(r.FormValue("visibility"))
	UserIDAuthorized := []string{}
	if post.Visibility == "almost private" {
		UserIDAuthorized = r.Form["followers"]
		if len(UserIDAuthorized) == 0 {
			apiError.Error = "Error choose followers."
			WriteJSON(w, http.StatusUnauthorized, apiError)
			return
		}
	}
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
	if post.Content == "" {
		return
	}
	errors, idPost := models.PostRepo.CreatePost(&post, photo, categories, createdAt, UserIDAuthorized)
	USERRID, _ := strconv.Atoi(session.UserID)
	user, _ := models.UserRepo.GetUserByID(USERRID)
	if errors != nil {
		apiError.Error = "An error occured."
		return
	}
	var sucess ApiSuccess
	sucess.Message = "Post created ! "
	post.PostID = idPost
	post.User = user
	if len(_categories) == 0 {
		post.Category = []string{"Others"}
	} else {
		post.Category = _categories
	}
	postId := strconv.Itoa(post.PostID)
	comments, _ := models.CommentRepo.GetCommentsByPostID(postId, post.AuthorID)
	post.Comments = comments
	post.CreatedAt = lib.FormatDateDB(createdAt.Format("2006-01-02 15:04:05"))
	WriteJSON(w, http.StatusOK, post)
}

func HandleGetAllPosts(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsGet(w, r)

	var apiError ApiError

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

	posts := RetreiveAllPosts(w, r, userId, apiError)

	WriteJSON(w, http.StatusOK, posts)
}

func RetreiveAllPosts(w http.ResponseWriter, r *http.Request, userId int, apiError ApiError) []*models.Post {
	posts, err := models.PostRepo.GetAllPostsPublicPrivateAuth(userId)
	if err != nil {
		apiError.Error = "Something went wrong while getting all public posts"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return nil
	}
	return posts
}

func ImageHandler(w http.ResponseWriter, r *http.Request) {
	imageId := r.URL.Query().Get("id")
	img, err := os.ReadFile("imgPost/" + imageId + ".jpg")
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "image/jpeg")
	w.Write(img)
}

func HandleGetRightBarCategories(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsGet(w, r)

	var apiError ApiError

	sessionToken := r.Header.Get("Authorization")
	_, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil {
		apiError.Error = "Invalid session"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	postCategoryCount, err := models.PostCategoryRepo.GetRBPostCategory()
	if err != nil {
		apiError.Error = "Error fetching post category counts"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	WriteJSON(w, http.StatusOK, postCategoryCount)
}
