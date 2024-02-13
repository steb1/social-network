package models

import (
	"database/sql"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"server/lib"
	"strconv"
	"time"
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
	PostID     int      `json:"post_id"`
	Title      string   `json:"title"`
	Category   []string `json:"category"`
	Content    string   `json:"content"`
	CreatedAt  string   `json:"created_at"`
	AuthorID   int      `json:"author_id"`
	ImageURL   string   `json:"image_url"`
	Visibility string   `json:"visibility"`
	HasImage   int      `json:"has_image"`
	Likes      int      `json:"like"`
	isLiked    bool     `json:"is_liked"`
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
func (pr *PostRepository) CreatePost(post *Post, photo multipart.File, categories []int, createdAt time.Time) error {
	query := `
	INSERT INTO posts (title, content, created_at, author_id, has_image, visibility)
	VALUES (?, ?, ?, ?, ?, ?)
	`
	imageUrl := strconv.Itoa(post.HasImage)
	result, err := pr.db.Exec(query, post.Title, post.Content, createdAt, post.AuthorID, imageUrl, post.Visibility)
	if err != nil {
		fmt.Println(err)
		return err
	}
	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return err
	}
	post.PostID = int(lastInsertID)
	_ = PostCategoryRepo.CreatePostCategory(post.PostID, categories)
	if post.HasImage == 0 {
		return nil
	}
	defer photo.Close()
	if err := os.MkdirAll("imgPost", os.ModePerm); err != nil {
		fmt.Println("Error creating imgPost directory:", err)
		return nil
	}
	fichierSortie, err := os.Create(fmt.Sprintf("imgPost/%d.jpg", post.PostID))
	if err != nil {
		lib.HandleError(err, "Creating post image.")
	}
	defer fichierSortie.Close()
	_, err = io.Copy(fichierSortie, photo)
	if err != nil {
		fmt.Println("err", err)
		return nil
	}
	return nil
}

// GetPost retrieves a post from the database by post_id
func (pr *PostRepository) GetPost(postID int) (*Post, error) {
	query := "SELECT * FROM posts WHERE post_id = ?"
	var post Post
	err := pr.db.QueryRow(query, postID).Scan(&post.PostID, &post.Title, &post.Category, &post.Content, &post.CreatedAt, &post.AuthorID, &post.ImageURL, &post.Visibility)
	if err != nil {
		return nil, err
	}
	return &post, nil
}

// GetAllPosts retrieves all posts from the database
func (pr *PostRepository) GetAllPosts() ([]*Post, error) {
	rows, err := pr.db.Query("SELECT post_id, title, content, created_at, visibility, has_image, nickname, first_name, last_name, email FROM posts, users WHERE posts.author_id=users.user_id ORDER BY created_at DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []*Post
	for rows.Next() {
		var post Post
		post.User = &User{}
		if err := rows.Scan(&post.PostID, &post.Title, &post.Content, &post.CreatedAt, &post.Visibility, &post.HasImage, &post.User.Nickname, &post.User.FirstName, &post.User.LastName, &post.User.Email); err != nil {
			return nil, err
		}
		post.CreatedAt = lib.FormatDateDB(post.CreatedAt)
		post.Category = PostCategoryRepo.GetPostCategory(post.PostID)
		// post.Likes = models.PostLikeRepo.GetPostLike()
		posts = append(posts, &post)
	}
	return posts, nil
}

// GetUserOwnPosts retrieves posts owned by a specific user from the database
func (pr *PostRepository) GetUserOwnPosts(userID int) ([]*Post, error) {
	rows, err := pr.db.Query("SELECT post_id, title, category, content, created_at, author_id, image_url, visibility FROM post WHERE author_id = ?", userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []*Post
	for rows.Next() {
		var post Post
		err := rows.Scan(&post.PostID, &post.Title, &post.Category, &post.Content, &post.CreatedAt, &post.AuthorID, &post.ImageURL, &post.Visibility)
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
	_, err := pr.db.Exec(query, post.Title, post.Category, post.Content, post.CreatedAt, post.AuthorID, post.ImageURL, post.Visibility, post.PostID)
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
