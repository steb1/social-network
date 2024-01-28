package models

import "database/sql"

// CommentLike structure represents the "comment_likes" table
type CommentLike struct {
	CommentLikeID int `json:"comment_like_id"`
	AuthorID      int `json:"author_id"`
	CommentID     int `json:"comment_id"`
	Rate          int `json:"rate"`
}

type CommentLikeRepository struct {
	db *sql.DB
}

func NewCommentLikeRepository(db *sql.DB) *CommentLikeRepository {
	return &CommentLikeRepository{
		db: db,
	}
}

// CreateCommentLike adds a new comment like to the database
func (clr *CommentLikeRepository) CreateCommentLike(commentLike *CommentLike) error {
	query := `
		INSERT INTO comment_like (author_id, comment_id, rate)
		VALUES (?, ?, ?)
	`
	result, err := clr.db.Exec(query, commentLike.AuthorID, commentLike.CommentID, commentLike.Rate)
	if err != nil {
		return err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	commentLike.CommentLikeID = int(lastInsertID)
	return nil
}

// GetCommentLike retrieves a comment like from the database by comment_like_id
func (clr *CommentLikeRepository) GetCommentLike(commentLikeID int) (*CommentLike, error) {
	query := "SELECT * FROM comment_like WHERE comment_like_id = ?"
	var commentLike CommentLike
	err := clr.db.QueryRow(query, commentLikeID).Scan(&commentLike.CommentLikeID, &commentLike.AuthorID, &commentLike.CommentID, &commentLike.Rate)
	if err != nil {
		return nil, err
	}
	return &commentLike, nil
}

// UpdateCommentLike updates an existing comment like in the database
func (clr *CommentLikeRepository) UpdateCommentLike(commentLike *CommentLike) error {
	query := `
		UPDATE comment_like
		SET author_id = ?, comment_id = ?, rate = ?
		WHERE comment_like_id = ?
	`
	_, err := clr.db.Exec(query, commentLike.AuthorID, commentLike.CommentID, commentLike.Rate, commentLike.CommentLikeID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteCommentLike removes a comment like from the database by comment_like_id
func (clr *CommentLikeRepository) DeleteCommentLike(commentLikeID int) error {
	query := "DELETE FROM comment_like WHERE comment_like_id = ?"
	_, err := clr.db.Exec(query, commentLikeID)
	if err != nil {
		return err
	}
	return nil
}