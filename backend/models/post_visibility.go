package models

import (
	"database/sql"
	"log"
	"server/lib"
)

// PostVisibility structure represents the "post_visibilities" table
type PostVisibility struct {
	PostVisibilityID int `json:"post_visibility_id"`
	PostID           int `json:"post_id"`
	UserIDAuthorized int `json:"user_id_authorized"`
}

type PostVisibilityRepository struct {
	db *sql.DB
}

func NewPostVisibilityRepository(db *sql.DB) *PostVisibilityRepository {
	return &PostVisibilityRepository{
		db: db,
	}
}

// CreatePostVisibility adds a new post visibility to the database
func (pvr *PostVisibilityRepository) CreatePostVisibility(postId int, users []string) error {
	query := `
		INSERT INTO post_visibilities (post_id, user_id_authorized)
		VALUES (?, ?)
	`
	for _, v := range users {
		_, err := pvr.db.Exec(query, postId, v)

		if err != nil {
			log.Println(err.Error())
		}
	}

	return nil
}

// GetPostVisibility retrieves a post visibility from the database by post_visibility_id
func (pvr *PostVisibilityRepository) GetPostVisibility(postVisibilityID int) (*PostVisibility, error) {
	query := "SELECT * FROM post_visibilities WHERE post_visibility_id = ?"
	var postVisibility PostVisibility
	err := pvr.db.QueryRow(query, postVisibilityID).Scan(&postVisibility.PostVisibilityID, &postVisibility.PostID, &postVisibility.UserIDAuthorized)
	if err != nil {
		return nil, err
	}
	return &postVisibility, nil
}

func (pvr *PostVisibilityRepository) GetAllPostsUserAuth(user_id string) ([]*Post, error) {
	query := `SELECT posts.post_id, title, content, created_at, visibility, has_image,
	 nickname, first_name, last_name, email 
	 FROM posts,post_visibilities, users 
	 WHERE post_visibilities.post_id=posts.post_id AND posts.author_id=users.user_id AND post_visibilities.user_id_authorized=? 
	ORDER BY created_at DESC`
	rows, err := pvr.db.Query(query, user_id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var posts []*Post
	for rows.Next() {
		var post Post
		post.User = &User{}
		var nickname sql.NullString
		if err := rows.Scan(&post.PostID, &post.Title, &post.Content, &post.CreatedAt, &post.Visibility, &post.HasImage, &nickname, &post.User.FirstName, &post.User.LastName, &post.User.Email); err != nil {
			return nil, err
		}
		post.User.Nickname = lib.GetStringFromNullString(nickname)
		post.CreatedAt = lib.FormatDateDB(post.CreatedAt)
		post.Category = PostCategoryRepo.GetPostCategory(post.PostID)
		posts = append(posts, &post)
	}
	return posts, nil
}

// UpdatePostVisibility updates an existing post visibility in the database
func (pvr *PostVisibilityRepository) UpdatePostVisibility(postVisibility *PostVisibility) error {
	query := `
		UPDATE post_visibilities
		SET post_id = ?, user_id_authorized = ?
		WHERE post_visibility_id = ?
	`
	_, err := pvr.db.Exec(query, postVisibility.PostID, postVisibility.UserIDAuthorized, postVisibility.PostVisibilityID)
	if err != nil {
		return err
	}
	return nil
}

// DeletePostVisibility removes a post visibility from the database by post_visibility_id
func (pvr *PostVisibilityRepository) DeletePostVisibility(postVisibilityID int) error {
	query := "DELETE FROM post_visibilities WHERE post_visibility_id = ?"
	_, err := pvr.db.Exec(query, postVisibilityID)
	if err != nil {
		return err
	}
	return nil
}
