package models

import (
	"database/sql"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"strconv"
	"time"

	"server/lib"
)

type PostItems struct {
	ID               string
	Title            string
	Slug             string
	AuthorName       string
	Description      string
	ImageURL         string
	LastEditionDate  string
	Categories       []Category
	NumberOfComments int
	NumberOfLikes    int
	NumberOfDislikes int
}

// Post structure represents the "posts" table
type Post struct {
	PostID    int      `json:"post_id"`
	Title     string   `json:"title"`
	Category  []string `json:"category"`
	Content   string   `json:"content"`
	CreatedAt string   `json:"created_at"`
	AuthorID  int      `json:"author_id"`
	// ImageURL   string   `json:"image_url"`
	Visibility string `json:"visibility"`
	HasImage   int    `json:"has_image"`
	Likes      int    `json:"like"`
	IsLiked    bool   `json:"is_liked"`
	User       *User
	Comments   []*Comment
}

type PostRepository struct {
	db *sql.DB
}

func NewPostRepository(db *sql.DB) *PostRepository {
	return &PostRepository{
		db: db,
	}
}

// CreatePost adds a new post to the database
func (pr *PostRepository) CreatePost(post *Post, photo multipart.File, categories []int, createdAt time.Time, UserIDAuthorized []string) (error, int) {
	query := `
	INSERT INTO posts (title, content, created_at, author_id, has_image, visibility)
	VALUES (?, ?, ?, ?, ?, ?)
	`
	imageUrl := strconv.Itoa(post.HasImage)
	result, err := pr.db.Exec(query, post.Title, post.Content, createdAt, post.AuthorID, imageUrl, post.Visibility)
	if err != nil {
		return err, 0
	}
	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return err, 0
	}
	post.PostID = int(lastInsertID)
	_ = PostCategoryRepo.CreatePostCategory(post.PostID, categories)
	if post.Visibility == "almost private" {
		_ = PostVisibilityRepo.CreatePostVisibility(post.PostID, UserIDAuthorized)
	}
	if post.HasImage == 0 {
		return nil, 0
	}
	defer photo.Close()
	if err := os.MkdirAll("imgPost", os.ModePerm); err != nil {
		return nil, 0
	}
	fichierSortie, err := os.Create(fmt.Sprintf("imgPost/%d.jpg", post.PostID))
	if err != nil {
		lib.HandleError(err, "Creating post image.")
	}
	defer fichierSortie.Close()
	_, err = io.Copy(fichierSortie, photo)
	if err != nil {
		return nil, 0
	}
	return nil, post.PostID
}

// GetPost retrieves a post from the database by post_id
func (pr *PostRepository) GetPost(postID int) (*Post, error) {
	query := "SELECT * FROM posts WHERE post_id = ?"
	var post Post
	err := pr.db.QueryRow(query, postID).Scan(&post.PostID, &post.Title, &post.Content, &post.CreatedAt, &post.AuthorID, &post.Visibility)
	if err != nil {
		return nil, err
	}
	return &post, nil
}

// GetAllPosts retrieves all posts from the database
func (pr *PostRepository) GetAllPosts(currentUserID int) ([]*Post, error) {
	rows, err := pr.db.Query("SELECT post_id, title, content, created_at, visibility, has_image, nickname, first_name, last_name, email, avatar FROM posts, users WHERE posts.author_id=users.user_id AND visibility='public' ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []*Post
	for rows.Next() {
		var post Post
		post.User = &User{}
		if err := rows.Scan(&post.PostID, &post.Title, &post.Content, &post.CreatedAt, &post.Visibility, &post.HasImage, &post.User.Nickname, &post.User.FirstName, &post.User.LastName, &post.User.Email, &post.User.Avatar); err != nil {
			return nil, err
		}
		post.CreatedAt = lib.FormatDateDB(post.CreatedAt)
		post.Category = PostCategoryRepo.GetPostCategory(post.PostID)
		post.Likes, err = PostLikeRepo.GetNumberOfLikes(post.PostID)
		if err != nil {
			return nil, err
		}
		post.IsLiked, err = PostLikeRepo.IsPostLikedByCurrentUser(post.PostID, currentUserID)
		if err != nil {
			return nil, err
		}
		posts = append(posts, &post)
	}
	return posts, nil
}

func (pr *PostRepository) GetAllPostsPublicPrivateAuth(userId int) ([]*Post, error) {
	rows, err := pr.db.Query(`
	SELECT 
    posts.post_id, 
    posts.title, 
    posts.content, 
    posts.created_at, 
    posts.visibility,
	posts.author_id, 
    posts.has_image, 
    users.nickname, 
    users.first_name, 
    users.last_name, 
	users.email,
	users.user_id,
	users.avatar
FROM 
    posts
JOIN 
    users ON posts.author_id = users.user_id
WHERE 
    posts.visibility = 'public'

UNION

SELECT 
    posts.post_id, 
    posts.title, 
    posts.content, 
    posts.created_at, 
    posts.visibility,
	posts.author_id, 
    posts.has_image, 
    users.nickname, 
    users.first_name,
    users.last_name, 
	users.email,
	users.user_id,
	users.avatar
FROM 
    posts
JOIN 
    subscriptions ON posts.author_id = subscriptions.following_user_id
JOIN 
    users ON posts.author_id = users.user_id
WHERE 
    (posts.visibility = 'private' AND subscriptions.follower_user_id = ?)

UNION

SELECT 
    posts.post_id, 
    posts.title, 
    posts.content, 
    posts.created_at, 
    posts.visibility,
	posts.author_id, 
    posts.has_image, 
    users.nickname, 
    users.first_name, 
    users.last_name, 
	users.email,
	users.user_id,
	users.avatar
FROM 
    posts
JOIN 
    post_visibilities ON posts.post_id = post_visibilities.post_id
JOIN 
    users ON posts.author_id = users.user_id
WHERE 
    post_visibilities.user_id_authorized = ?
	

UNION

SELECT 
    posts.post_id, 
    posts.title, 
    posts.content, 
    posts.created_at, 
    posts.visibility,
	posts.author_id, 
    posts.has_image, 
    users.nickname, 
    users.first_name, 
    users.last_name, 
    users.email,
	users.user_id,
	users.avatar
FROM 
    posts
JOIN 
    users ON posts.author_id = users.user_id
WHERE
posts.author_id=?

ORDER BY 
    created_at DESC;

	`, userId, userId, userId, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var posts []*Post
	for rows.Next() {
		var post Post
		post.User = &User{}
		if err := rows.Scan(&post.PostID, &post.Title, &post.Content, &post.CreatedAt, &post.Visibility, &post.AuthorID, &post.HasImage, &post.User.Nickname, &post.User.FirstName, &post.User.LastName, &post.User.Email, &post.User.UserID, &post.User.Avatar); err != nil {
			return nil, err
		}
		postIDStr := strconv.Itoa(post.PostID)
		post.CreatedAt = lib.FormatDateDB(post.CreatedAt)
		post.Category = PostCategoryRepo.GetPostCategory(post.PostID)
		post.Likes, _ = PostLikeRepo.GetNumberOfLikes(post.PostID)
		comments, err := CommentRepo.GetCommentsByPostID(postIDStr, userId)
		post.Comments = comments
		if err != nil {
			return nil, err
		}
		post.IsLiked, err = PostLikeRepo.IsPostLikedByCurrentUser(post.PostID, userId)
		if err != nil {
			return nil, err
		}
		posts = append(posts, &post)
	}
	return posts, nil
}

// GetUserOwnPosts retrieves posts owned by a specific user from the database
func (pr *PostRepository) GetUserOwnPosts(userID,CurrentUser int)([]*Post, error) {
	var query string
	if (userID==CurrentUser){
		query = `SELECT 
    posts.post_id, 
    posts.title, 
    posts.content, 
    posts.created_at, 
    posts.visibility, 
    posts.has_image, 
    users.nickname, 
    users.first_name, 
    users.last_name, 
    users.email,
	users.avatar
FROM 
    posts
JOIN 
    users ON posts.author_id = users.user_id
WHERE
posts.author_id=?

ORDER BY 
    created_at DESC;`
	}else{
		query = `SELECT 
    posts.post_id, 
    posts.title, 
    posts.content, 
    posts.created_at, 
    posts.visibility, 
    posts.has_image, 
    users.nickname, 
    users.first_name, 
    users.last_name, 
    users.email,
	users.avatar
FROM 
    posts
JOIN 
    users ON posts.author_id = users.user_id
WHERE
posts.author_id=? and posts.visibility="public"

UNION

SELECT 
    posts.post_id, 
    posts.title, 
    posts.content, 
    posts.created_at, 
    posts.visibility,
    posts.has_image, 
    users.nickname, 
    users.first_name, 
    users.last_name, 
	users.email,
	users.avatar
FROM 
    posts
JOIN 
    post_visibilities ON posts.post_id = post_visibilities.post_id
JOIN 
    users ON posts.author_id = users.user_id
WHERE 
posts.author_id=? and  post_visibilities.user_id_authorized = ?
	UNION

	SELECT 
		posts.post_id, 
		posts.title, 
		posts.content, 
		posts.created_at, 
		posts.visibility,
		posts.has_image, 
		users.nickname, 
		users.first_name,
		users.last_name, 
		users.email,
		users.avatar
	FROM 
		posts
	JOIN 
		subscriptions ON posts.author_id = subscriptions.following_user_id
	JOIN 
		users ON posts.author_id = users.user_id
	WHERE 
	posts.author_id=? and (posts.visibility = 'private' AND subscriptions.follower_user_id = ?)

ORDER BY 
    created_at DESC;`
	}
	
	rows, err := pr.db.Query(query, userID,userID,CurrentUser,userID,CurrentUser)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var posts []*Post
	for rows.Next() {
		var post Post
		post.User = &User{}
		if err := rows.Scan(&post.PostID, &post.Title, &post.Content, &post.CreatedAt, &post.Visibility, &post.HasImage, &post.User.Nickname, &post.User.FirstName, &post.User.LastName, &post.User.Email, &post.User.Avatar); err != nil {
			return nil, err
		}
		postIDStr := strconv.Itoa(post.PostID)
		post.CreatedAt = lib.FormatDateDB(post.CreatedAt)
		post.Category = PostCategoryRepo.GetPostCategory(post.PostID)
		post.Likes, err = PostLikeRepo.GetNumberOfLikes(post.PostID)
		if err != nil {
			return nil, err
		}
		comments, err := CommentRepo.GetCommentsByPostID(postIDStr, userID)
		post.Comments = comments
		if err != nil {
			return nil, err
		}
		post.IsLiked, err = PostLikeRepo.IsPostLikedByCurrentUser(post.PostID, userID)
		if err != nil {
			return nil, err
		}
		posts = append(posts, &post)
	}
	return posts, nil
}

// UpdatePost updates an existing post in the database
func (pr *PostRepository) UpdatePost(post *Post) error {
	query := `
		UPDATE posts
		SET title = ?, category = ?, content = ?, created_at = ?, author_id = ?, image_url = ?, visibility = ?
		WHERE post_id = ?
	`
	_, err := pr.db.Exec(query, post.Title, post.Content, post.CreatedAt, post.AuthorID, post.Visibility, post.PostID)
	if err != nil {
		return err
	}
	return nil
}

// DeletePost removes a post from the database by post_id
func (pr *PostRepository) DeletePost(postID int) error {
	query := "DELETE FROM posts WHERE post_id = ?"
	_, err := pr.db.Exec(query, postID)
	if err != nil {
		return err
	}
	return nil
}
