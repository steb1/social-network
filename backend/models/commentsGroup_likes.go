package models

import (
	"database/sql"
	"log"
)

// CommentGroupLike structure represents the "comments_group_likes" table
type CommentGroupLike struct {
	CommentLikeID int `json:"comment_like_id"`
	AuthorID      int `json:"author_id"`
	CommentID     int `json:"comment_id"`
	Rate          int `json:"rate"`
}

type CommentGroupLikeRepository struct {
	db *sql.DB
}

func NewCommentGroupLikeRepository(db *sql.DB) *CommentGroupLikeRepository {
	return &CommentGroupLikeRepository{
		db: db,
	}
}

// CreateCommentGroupLike creates a new comment group like in the database
func (repo *CommentGroupLikeRepository) CreateCommentGroupLike(commentGroupLike CommentGroupLike) (int, error) {
	result, err := repo.db.Exec(`
		INSERT INTO comments_group_likes (author_id, comment_id, rate)
		VALUES (?, ?, ?)
	`, commentGroupLike.AuthorID, commentGroupLike.CommentID, commentGroupLike.Rate)

	if err != nil {
		log.Println("Error creating comment group like:", err)
		return 0, err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		log.Println("Error getting last insert ID:", err)
		return 0, err
	}

	return int(lastInsertID), nil
}

// GetCommentGroupLikeByID retrieves a comment group like from the database by its ID
func (repo *CommentGroupLikeRepository) GetCommentGroupLikeByID(likeID int) (CommentGroupLike, error) {
	var commentGroupLike CommentGroupLike
	err := repo.db.QueryRow(`
		SELECT comment_like_id, author_id, comment_id, rate
		FROM comments_group_likes
		WHERE comment_like_id = ?
	`, likeID).Scan(
		&commentGroupLike.CommentLikeID,
		&commentGroupLike.AuthorID,
		&commentGroupLike.CommentID,
		&commentGroupLike.Rate,
	)

	if err != nil {
		log.Println("Error getting comment group like by ID:", err)
		return CommentGroupLike{}, err
	}

	return commentGroupLike, nil
}

// UpdateCommentGroupLike updates an existing comment group like in the database
func (repo *CommentGroupLikeRepository) UpdateCommentGroupLike(commentGroupLike CommentGroupLike) error {
	_, err := repo.db.Exec(`
		UPDATE comments_group_likes
		SET author_id = ?, comment_id = ?, rate = ?
		WHERE comment_like_id = ?
	`, commentGroupLike.AuthorID, commentGroupLike.CommentID, commentGroupLike.Rate, commentGroupLike.CommentLikeID)

	if err != nil {
		log.Println("Error updating comment group like:", err)
		return err
	}

	return nil
}

// DeleteCommentGroupLike deletes a comment group like from the database by its ID
func (repo *CommentGroupLikeRepository) DeleteCommentGroupLike(commentID, userID int) error {
	_, err := repo.db.Exec(`
		DELETE FROM comments_group_likes
		WHERE comment_id = ? AND author_id = ?
	`, commentID, userID)

	if err != nil {
		log.Println("Error deleting comment group like:", err)
		return err
	}

	return nil
}

// CountLikesByCommentID returns the count of likes for a given comment ID
func (repo *CommentGroupLikeRepository) CountLikesByCommentID(commentID int) (int, error) {
	var likeCount int

	err := repo.db.QueryRow(`
		SELECT COUNT(*) FROM comments_group_likes
		WHERE comment_id = ?
	`, commentID).Scan(&likeCount)

	if err != nil {
		log.Println("Error counting likes by comment ID:", err)
		return 0, err
	}

	return likeCount, nil
}

func (repo *CommentGroupLikeRepository) IsLiked(commentID, userID int) ( bool) {
	var commentGroupLike CommentGroupLike
	err := repo.db.QueryRow(`
		SELECT comment_like_id, author_id, comment_id, rate
		FROM comments_group_likes
		WHERE author_id = ? AND comment_id = ?
	`, userID, commentID).Scan(
		&commentGroupLike.CommentLikeID,
		&commentGroupLike.AuthorID,
		&commentGroupLike.CommentID,
		&commentGroupLike.Rate,
	)
	return err == nil
}