package models

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"server/lib"
	"strconv"
	"time"
)

// Comment structure represents the "comments" table
type Comment struct {
	CommentID int    `json:"comment_id"`
	Content   string `json:"content"`
	AuthorID  int    `json:"author_id"`
	PostID    int    `json:"post_id"`
	CreatedAt string `json:"created_at"`
	Likes     int    `json:"like"`
	IsLiked   bool   `json:"is_liked"`
	HasImage  int    `json:"has_image"`
	User      *User
}

type CommentRepository struct {
	db *sql.DB
}

func NewCommentRepository(db *sql.DB) *CommentRepository {
	return &CommentRepository{
		db: db,
	}
}

// CreateComment adds a new comment to the database
func (cc *CommentRepository) CreateComment(comment *Comment, photo multipart.File, createdAt time.Time) error {
	query := `
		INSERT INTO comments (content, author_id, post_id, createdAt, has_image)
		VALUES (?, ?, ?, ?, ?)
	`
	imageUrl := strconv.Itoa(comment.HasImage)
	result, err := cc.db.Exec(query, comment.Content, comment.AuthorID, comment.PostID, createdAt, imageUrl)
	if err != nil {
		return err
	}
	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return err
	}
	comment.CommentID = int(lastInsertID)

	if comment.HasImage == 0 {
		return nil
	}
	defer photo.Close()
	if err := os.MkdirAll("imgComment", os.ModePerm); err != nil {
		fmt.Println("Error creating imgComment directory:", err)
		return nil
	}
	fichierSortie, err := os.Create(fmt.Sprintf("imgComment/%d.jpg", comment.CommentID))
	if err != nil {
		lib.HandleError(err, "Creating comment image.")
	}
	defer fichierSortie.Close()

	_, err = io.Copy(fichierSortie, photo)
	if err != nil {
		fmt.Println("err", err)
		return nil
	}

	return nil
}

// GetComment retrieves a comment from the database by comment_id
func (cc *CommentRepository) GetComment(commentID int) (*Comment, error) {
	query := "SELECT * FROM comment WHERE comment_id = ?"
	var comment Comment
	err := cc.db.QueryRow(query, commentID).Scan(&comment.CommentID, &comment.Content, &comment.AuthorID, &comment.PostID, &comment.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &comment, nil
}

func (cc *CommentRepository) GetCommentsByPostID(postID string, currentUserID int) ([]*Comment, error) {
	// Prepare a SQL query with a placeholder for the post ID
	stmt, err := db.Prepare("SELECT comment_id, content, createdAt, first_name, last_name, nickname, post_id, has_image, author_id, avatar FROM comments,users WHERE comments.author_id=users.user_id and post_id = ? ORDER BY createdAt DESC")
	if err != nil {
		log.Println("error while preparing", err)
	}
	defer stmt.Close()

	// Execute the prepared query and scan the results into a slice of 'models.Comment'
	rows, err := stmt.Query(postID)
	if err != nil {
		log.Println("error stmt query in GetCommentsByPostID", err)
	}
	defer rows.Close()

	comments := []*Comment{}
	for rows.Next() {
		var comment Comment
		comment.User = &User{}
		var nickname sql.NullString
		err := rows.Scan(&comment.CommentID, &comment.Content, &comment.CreatedAt, &comment.User.FirstName, &comment.User.LastName, &nickname, &comment.PostID, &comment.HasImage, &comment.AuthorID, &comment.User.Avatar)
		if err != nil {
			log.Println("error scan in GetCommentsByPostID", err)
		}
		comment.User.Nickname = lib.GetStringFromNullString(nickname)
		comment.CreatedAt = lib.FormatDateDB(comment.CreatedAt)
		comment.Likes, err = Comment_likeRepo.GetNumberOfCommentLikes(comment.CommentID)
		if err != nil {
			return nil, err
		}
		comment.IsLiked, err = Comment_likeRepo.IsCommentLikedByCurrentUser(comment.CommentID, currentUserID)
		if err != nil {
			return nil, err
		}
		comments = append(comments, &comment)
	}

	return comments, nil
}

// UpdateComment updates an existing comment in the database
func (cc *CommentRepository) UpdateComment(comment *Comment) error {
	query := `
		UPDATE comment
		SET content = ?, author_id = ?, post_id = ?, created_at = ?
		WHERE comment_id = ?
	`
	_, err := cc.db.Exec(query, comment.Content, comment.AuthorID, comment.PostID, comment.CreatedAt, comment.CommentID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteComment removes a comment from the database by comment_id
func (cc *CommentRepository) DeleteComment(commentID int) error {
	query := "DELETE FROM comment WHERE comment_id = ?"
	_, err := cc.db.Exec(query, commentID)
	if err != nil {
		return err
	}
	return nil
}

// GetAllComments retrieves all comments for a given post from the database.
func (cc *CommentRepository) GetAllComments(postID int) ([]Comment, error) {
	query := "SELECT * FROM comment WHERE post_id = ?"
	rows, err := cc.db.Query(query, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var comments []Comment
	for rows.Next() {
		var comment Comment
		err := rows.Scan(&comment.CommentID, &comment.Content, &comment.AuthorID, &comment.PostID, &comment.CreatedAt)
		if err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return comments, nil
}
