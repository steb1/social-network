package models

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"server/lib"
)

// Comment structure represents the "comments" table
type CommentGroup struct {
	CommentID int    `json:"comment_id"`
	Content   string `json:"content"`
	AuthorID  int    `json:"author_id"`
	PostID    int    `json:"post_id"`
	CreatedAt string `json:"created_at"`
	IsLiked   bool   `json:"is_liked"`
	HasImage  int    `json:"has_image"`
	User      *User
	NumberOfLikes int
}

type CommentGroupRepository struct {
	db *sql.DB
}

func NewCommentGroupRepository(db *sql.DB) *CommentGroupRepository {
	return &CommentGroupRepository{
		db: db,
	}
}

// CreateCommentGroup creates a new comment group in the database
func (repo *CommentGroupRepository) CreateCommentGroup(commentGroup CommentGroup, photo multipart.File) error {

	result, err := repo.db.Exec(`
		INSERT INTO comments_posts_group (content, author_id, post_id, createdAt, has_image)
		VALUES (?, ?, ?, ?, ?)
	`, commentGroup.Content, commentGroup.AuthorID, commentGroup.PostID, commentGroup.CreatedAt, commentGroup.HasImage)

	if err != nil {
		log.Println("Error creating comment group:", err)
		return err
	}

	CommentID, err := result.LastInsertId()
	if err != nil {
		log.Println("Error getting last insert ID:", err)
		return err
	}

	if commentGroup.HasImage == 0 {
		return nil
	}
	defer photo.Close()
	if err := os.MkdirAll("imgCommentGroup", os.ModePerm); err != nil {
		fmt.Println("Error creating imgComment directory:", err)
		return nil
	}
	fichierSortie, err := os.Create(fmt.Sprintf("imgCommentGroup/%d.jpg", CommentID))
	if err != nil {
		lib.HandleError(err, "Creating comment image.")
	}
	defer fichierSortie.Close()

	_, err = io.Copy(fichierSortie, photo)
	if err != nil {
		fmt.Println("err", err)
		return nil
	}

	return  nil
}

// GetCommentGroupByID retrieves a comment group from the database by its ID
func (repo *CommentGroupRepository) GetCommentGroupByID(commentID int) (CommentGroup, error) {
	var commentGroup CommentGroup
	err := repo.db.QueryRow(`
		SELECT comment_id, content, author_id, post_id, created_at, has_image
		FROM comments_posts_group
		WHERE comment_id = ?
	`, commentID).Scan(
		&commentGroup.CommentID,
		&commentGroup.Content,
		&commentGroup.AuthorID,
		&commentGroup.PostID,
		&commentGroup.CreatedAt,
		&commentGroup.HasImage,
	)

	if err != nil {
		log.Println("Error getting comment group by ID:", err)
		return CommentGroup{}, err
	}

	return commentGroup, nil
}

// UpdateCommentGroup updates an existing comment group in the database
func (repo *CommentGroupRepository) UpdateCommentGroup(commentGroup CommentGroup) error {
	_, err := repo.db.Exec(`
		UPDATE comments_posts_group
		SET content = ?, author_id = ?, post_id = ?, created_at = ?, has_image
		WHERE comment_id = ?
	`, commentGroup.Content, commentGroup.AuthorID, commentGroup.PostID, commentGroup.CreatedAt, commentGroup.CommentID, commentGroup.HasImage)

	if err != nil {
		log.Println("Error updating comment group:", err)
		return err
	}

	return nil
}

// DeleteCommentGroup deletes a comment group from the database by its ID
func (repo *CommentGroupRepository) DeleteCommentGroup(commentID int) error {
	_, err := repo.db.Exec(`
		DELETE FROM comments_posts_group
		WHERE comment_id = ?
	`, commentID)

	if err != nil {
		log.Println("Error deleting comment group:", err)
		return err
	}

	return nil
}

// GetAllCommentsByPostID retrieves all comments for a given post ID from the database
func (repo *CommentGroupRepository) GetAllCommentsByPostID(postID, userID int) ([]CommentGroup, error) {
	rows, err := repo.db.Query(`
		SELECT comment_id, content, author_id, post_id, createdAt, has_image
		FROM comments_posts_group
		WHERE post_id = ?
	`, postID)

	if err != nil {
		log.Println("Error getting comments by post ID:", err)
		return nil, err
	}
	defer rows.Close()

	var comments []CommentGroup

	for rows.Next() {
		var commentGroup CommentGroup
		err := rows.Scan(
			&commentGroup.CommentID,
			&commentGroup.Content,
			&commentGroup.AuthorID,
			&commentGroup.PostID,
			&commentGroup.CreatedAt,
			&commentGroup.HasImage,
		)
		if err != nil {
			log.Println("Error scanning comment row:", err)
			return nil, err
		}

		user, _ := UserRepo.GetUserByID(commentGroup.AuthorID)

		commentGroup.User = user
		commentGroup.IsLiked = CommentGroupLikeRepo.IsLiked(commentGroup.CommentID, userID)
		commentGroup.NumberOfLikes, _ = CommentGroupLikeRepo.CountLikesByCommentID(commentGroup.CommentID)
		comments = append(comments, commentGroup)
	}

	if err := rows.Err(); err != nil {
		log.Println("Error iterating over comment rows:", err)
		return nil, err
	}

	return comments, nil
}
