package models

import (
	"database/sql"
	"log"
)

type PostCategory struct {
	ID         string
	CategoryID string
	PostID     string
}

type PostCategorieRepository struct {
	db *sql.DB
}

func NewPostCategorieRepository(db *sql.DB) *PostCategorieRepository {
	return &PostCategorieRepository{
		db: db,
	}
}

// CreatePostCategory adds a new post category to the database
func (pc *PostCategorieRepository) CreatePostCategory(post_id int, categories []int) error {
	query := `
		INSERT INTO post_categories (categoryID, postID)
		VALUES (?, ?)
	`
	for _, v := range categories {
		_, err := pc.db.Exec(query, v, post_id)

		if err != nil {
			log.Println(err.Error())
		}
	}
	return nil
}

// GetPostCategory retrieves a post category from the database by ID
func (pc *PostCategorieRepository) GetPostCategory(id string) (*PostCategory, error) {
	query := "SELECT * FROM post_categories WHERE id = ?"
	var postCategory PostCategory
	err := pc.db.QueryRow(query, id).Scan(&postCategory.ID, &postCategory.CategoryID, &postCategory.PostID)
	if err != nil {
		return nil, err
	}
	return &postCategory, nil
}

// UpdatePostCategory updates an existing post category in the database
func (pc *PostCategorieRepository) UpdatePostCategory(postCategory *PostCategory) error {
	query := `
		UPDATE post_categories
		SET category_id = ?, post_id = ?
		WHERE id = ?
	`
	_, err := pc.db.Exec(query, postCategory.CategoryID, postCategory.PostID, postCategory.ID)
	if err != nil {
		return err
	}
	return nil
}

// DeletePostCategory removes a post category from the database by ID
func (pc *PostCategorieRepository) DeletePostCategory(id string) error {
	query := "DELETE FROM post_categories WHERE id = ?"
	_, err := pc.db.Exec(query, id)
	if err != nil {
		return err
	}
	return nil
}
