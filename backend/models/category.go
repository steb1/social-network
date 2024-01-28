package models

import (
	"database/sql"
	"fmt"
)

type Category struct {
	CategoryID   string
	Name         string
	CreateDate   string
	ModifiedDate string
}

type CategoryRepository struct {
	db *sql.DB
}

func NewCategoryRepository(db *sql.DB) *CategoryRepository {
	return &CategoryRepository{
		db: db,
	}
}

// CreateCategory adds a new category to the database
func (cr *CategoryRepository) CreateCategory(category *Category) error {
	query := `
		INSERT INTO category (category_id, name, createDate, modifiedDate)
		VALUES (?, ?, ?, ?)
	`
	result, err := cr.db.Exec(query, category.CategoryID, category.Name, category.CreateDate, category.ModifiedDate)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no rows affected")
	}

	return nil
}

// GetCategory retrieves a category from the database by category_id
func (cr *CategoryRepository)  GetCategory(categoryID string) (*Category, error) {
	query := "SELECT * FROM category WHERE category_id = ?"
	var category Category
	err := cr.db.QueryRow(query, categoryID).Scan(&category.CategoryID, &category.Name, &category.CreateDate, &category.ModifiedDate)
	if err != nil {
		return nil, err
	}
	return &category, nil
}

// UpdateCategory updates an existing category in the database
func (cr *CategoryRepository) UpdateCategory(category *Category) error {
	query := `
		UPDATE category
		SET name = ?, createDate = ?, modifiedDate = ?
		WHERE category_id = ?
	`
	_, err := cr.db.Exec(query, category.Name, category.CreateDate, category.ModifiedDate, category.CategoryID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteCategory removes a category from the database by category_id
func (cr *CategoryRepository)  DeleteCategory(categoryID string) error {
	query := "DELETE FROM category WHERE category_id = ?"
	_, err := cr.db.Exec(query, categoryID)
	if err != nil {
		return err
	}
	return nil
}
