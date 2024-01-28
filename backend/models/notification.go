package models

import "database/sql"

// Notification structure represents the "notifications" table
type Notification struct {
	NotificationID int    `json:"notification_id"`
	UserID         int    `json:"user_id"`
	Type           string `json:"type"`
	Status         string `json:"status"`
	CreatedAt      string `json:"created_at"`
}

type NotificationRepository struct {
	db *sql.DB
}

func NewNotificationRepository(db *sql.DB) *NotificationRepository {
	return &NotificationRepository{
		db: db,
	}
}

// CreateNotification adds a new notification to the database
func (nr *NotificationRepository) CreateNotification(notification *Notification) error {
	query := `
		INSERT INTO notifications (user_id, type, status, created_at)
		VALUES (?, ?, ?, ?)
	`
	result, err := nr.db.Exec(query, notification.UserID, notification.Type, notification.Status, notification.CreatedAt)
	if err != nil {
		return err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	notification.NotificationID = int(lastInsertID)
	return nil
}

// GetNotification retrieves a notification from the database by notification_id
func (nr *NotificationRepository) GetNotification(notificationID int) (*Notification, error) {
	query := "SELECT * FROM notifications WHERE notification_id = ?"
	var notification Notification
	err := nr.db.QueryRow(query, notificationID).Scan(&notification.NotificationID, &notification.UserID, &notification.Type, &notification.Status, &notification.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &notification, nil
}

// UpdateNotification updates an existing notification in the database
func (nr *NotificationRepository) UpdateNotification(notification *Notification) error {
	query := `
		UPDATE notifications
		SET user_id = ?, type = ?, status = ?, created_at = ?
		WHERE notification_id = ?
	`
	_, err := nr.db.Exec(query, notification.UserID, notification.Type, notification.Status, notification.CreatedAt, notification.NotificationID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteNotification removes a notification from the database by notification_id
func (nr *NotificationRepository) DeleteNotification(notificationID int) error {
	query := "DELETE FROM notifications WHERE notification_id = ?"
	_, err := nr.db.Exec(query, notificationID)
	if err != nil {
		return err
	}
	return nil
}

