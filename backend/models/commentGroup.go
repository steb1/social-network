package models

import (
	"database/sql"
	"log"
)

// Comment structure represents the "comments" table
type CommentGroup struct {
	CommentID int    `json:"comment_id"`
	Content   string `json:"content"`
	AuthorID  int    `json:"author_id"`
	PostID    int    `json:"post_id"`
	CreatedAt string `json:"created_at"`
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
func (repo *CommentGroupRepository) CreateCommentGroup(commentGroup CommentGroup) (int, error) {
	result, err := repo.db.Exec(`
		INSERT INTO comments_posts_group (content, author_id, post_id, created_at)
		VALUES (?, ?, ?, ?)
	`, commentGroup.Content, commentGroup.AuthorID, commentGroup.PostID, commentGroup.CreatedAt)

	if err != nil {
		log.Println("Error creating comment group:", err)
		return 0, err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		log.Println("Error getting last insert ID:", err)
		return 0, err
	}

	return int(lastInsertID), nil
}

// GetCommentGroupByID retrieves a comment group from the database by its ID
func (repo *CommentGroupRepository) GetCommentGroupByID(commentID int) (CommentGroup, error) {
	var commentGroup CommentGroup
	err := repo.db.QueryRow(`
		SELECT comment_id, content, author_id, post_id, created_at
		FROM comments_posts_group
		WHERE comment_id = ?
	`, commentID).Scan(
		&commentGroup.CommentID,
		&commentGroup.Content,
		&commentGroup.AuthorID,
		&commentGroup.PostID,
		&commentGroup.CreatedAt,
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
		SET content = ?, author_id = ?, post_id = ?, created_at = ?
		WHERE comment_id = ?
	`, commentGroup.Content, commentGroup.AuthorID, commentGroup.PostID, commentGroup.CreatedAt, commentGroup.CommentID)

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
func (repo *CommentGroupRepository) GetAllCommentsByPostID(postID int) ([]CommentGroup, error) {
	rows, err := repo.db.Query(`
		SELECT comment_id, content, author_id, post_id, createdAt
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
		)
		if err != nil {
			log.Println("Error scanning comment row:", err)
			return nil, err
		}

		comments = append(comments, commentGroup)
	}

	if err := rows.Err(); err != nil {
		log.Println("Error iterating over comment rows:", err)
		return nil, err
	}

	return comments, nil
}
