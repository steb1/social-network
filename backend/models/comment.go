package models

import "database/sql"

// Comment structure represents the "comments" table
type Comment struct {
	CommentID int    `json:"comment_id"`
	Content   string `json:"content"`
	AuthorID  int    `json:"author_id"`
	PostID    int    `json:"post_id"`
	CreatedAt string `json:"created_at"`
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
func (cc *CommentRepository) CreateComment(comment *Comment) error {
	query := `
		INSERT INTO comment (content, author_id, post_id, created_at)
		VALUES (?, ?, ?, ?)
	`
	result, err := cc.db.Exec(query, comment.Content, comment.AuthorID, comment.PostID, comment.CreatedAt)
	if err != nil {
		return err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	comment.CommentID = int(lastInsertID)
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
