package models

import (
	"database/sql"
	"log"
)

// PostGroupLike structure represents the "post_groups_likes" table
type PostGroupLike struct {
	PostLikeID int `json:"post_like_id"`
	AuthorID   int `json:"author_id"`
	PostID     int `json:"post_id"`
	Rate       int `json:"rate"`
}

type PostGroupLikeRepository struct {
	db *sql.DB
}

func NewPostGroupLikeRepository(db *sql.DB) *PostGroupLikeRepository {
	return &PostGroupLikeRepository{
		db: db,
	}
}

// CreatePostGroupLike creates a new post group like in the database
func (repo *PostGroupLikeRepository) CreatePostGroupLike(postGroupLike PostGroupLike) (int, error) {
	result, err := repo.db.Exec(`
		INSERT INTO post_groups_likes (author_id, post_id, rate)
		VALUES (?, ?, ?)
	`, postGroupLike.AuthorID, postGroupLike.PostID, postGroupLike.Rate)

	if err != nil {
		log.Println("Error creating post group like:", err)
		return 0, err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		log.Println("Error getting last insert ID:", err)
		return 0, err
	}

	return int(lastInsertID), nil
}

// GetPostGroupLikeByID retrieves a post group like from the database by its ID
func (repo *PostGroupLikeRepository) GetPostGroupLikeByID(likeID int) (PostGroupLike, error) {
	var postGroupLike PostGroupLike
	err := repo.db.QueryRow(`
		SELECT post_like_id, author_id, post_id, rate
		FROM post_groups_likes
		WHERE post_like_id = ?
	`, likeID).Scan(
		&postGroupLike.PostLikeID,
		&postGroupLike.AuthorID,
		&postGroupLike.PostID,
		&postGroupLike.Rate,
	)

	if err != nil {
		log.Println("Error getting post group like by ID:", err)
		return PostGroupLike{}, err
	}

	return postGroupLike, nil
}

// UpdatePostGroupLike updates an existing post group like in the database
func (repo *PostGroupLikeRepository) UpdatePostGroupLike(postGroupLike PostGroupLike) error {
	_, err := repo.db.Exec(`
		UPDATE post_groups_likes
		SET author_id = ?, post_id = ?, rate = ?
		WHERE post_like_id = ?
	`, postGroupLike.AuthorID, postGroupLike.PostID, postGroupLike.Rate, postGroupLike.PostLikeID)

	if err != nil {
		log.Println("Error updating post group like:", err)
		return err
	}

	return nil
}

// DeletePostGroupLike deletes a post group like from the database by its ID
func (repo *PostGroupLikeRepository) DeletePostGroupLike(likeID int) error {
	_, err := repo.db.Exec(`
		DELETE FROM post_groups_likes
		WHERE post_like_id = ?
	`, likeID)

	if err != nil {
		log.Println("Error deleting post group like:", err)
		return err
	}

	return nil
}

// CountLikesByPostID returns the count of likes for a given post ID
func (repo *PostGroupLikeRepository) CountLikesByPostID(postID int) (int, error) {
	var likeCount int

	err := repo.db.QueryRow(`
		SELECT COUNT(*) FROM post_groups_likes
		WHERE post_id = ?
	`, postID).Scan(&likeCount)

	if err != nil {
		log.Println("Error counting likes by post ID:", err)
		return 0, err
	}

	return likeCount, nil
}

func  (plr *PostGroupLikeRepository) IsLiked(postID, user_id int) (*PostGroupLike, error) {
	query := "SELECT * FROM post_groups_likes WHERE PostID = ? AND AuthorID = ?"
	var postLike PostGroupLike
	err := plr.db.QueryRow(query, postID, user_id).Scan(&postLike.PostLikeID, &postLike.AuthorID, &postLike.PostID, &postLike.Rate)
	if err != nil {
		return nil, err
	}
	return &postLike, nil
}
