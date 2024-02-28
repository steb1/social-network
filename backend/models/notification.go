package models

import (
	"database/sql"
	"fmt"
	"server/lib"
	"time"
)

// Notification structure represents the "notifications" table
type Notification struct {
	NotificationID   int           `json:"notification_id"`
	UserID           int           `json:"user_id"`
	SenderID         int           `json:"sender_id"`
	NotificationType string        `json:"notification_type"`
	GroupID          sql.NullInt64 `json:"group_id"`
	EventID          sql.NullInt64 `json:"event_id"`
	IsRead           bool          `json:"is_read"`
	CreatedAt        string        `json:"created_at"`
	Sender           *User
	User             *User
	Event            *Event
	Group            *Group
}

type NotificationRepository struct {
	db *sql.DB
}

func NewNotificationRepository(db *sql.DB) *NotificationRepository {
	return &NotificationRepository{
		db: db,
	}
}

// GetNotificationByID retrieves a notification by its ID
func (repo *NotificationRepository) GetNotificationByID(notificationID int) (*Notification, error) {
	// Prepare the SQL statement
	query := `
		SELECT notification_id, user_id, sender_id, notification_type, group_id, event_id, is_read, created_at
		FROM notifications
		WHERE notification_id = ?
	`

	// Execute the SQL statement
	row := repo.db.QueryRow(query, notificationID)

	// Create a Notification struct to hold the result
	var notification Notification
	// Scan the result into the Notification struct
	err := row.Scan(&notification.NotificationID, &notification.UserID, &notification.SenderID, &notification.NotificationType, &notification.GroupID, &notification.EventID, &notification.IsRead, &notification.CreatedAt)
	if err != nil {
		return nil, err
	}

	return &notification, nil
}

// CreateNotification adds a new notification to the database
func (repo *NotificationRepository) CreateNotification(notification *Notification) error {
	// Prepare the SQL statement
	query := `
		INSERT INTO notifications (user_id, sender_id, notification_type, group_id, event_id, is_read, created_at)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`

	// Execute the SQL statement
	result, err := repo.db.Exec(query, notification.UserID, notification.SenderID, notification.NotificationType, notification.GroupID, notification.EventID, notification.IsRead, time.Now().Format("2006-01-02 15:04:05"))
	if err != nil {
		return err
	}

	// Get the last inserted ID and update the NotificationID field
	lastInsertID, _ := result.LastInsertId()
	notification.NotificationID = int(lastInsertID)

	return nil
}

// GetNotificationsByUserID retrieves notifications for a specific user
func (repo *NotificationRepository) GetNotificationsByUserID(userID int) ([]Notification, error) {
	// Prepare the SQL statement
	query := `
		SELECT notification_id, user_id, sender_id, notification_type, group_id, event_id, is_read, created_at
		FROM notifications
		WHERE user_id = ?
		ORDER BY created_at DESC
	`

	// Execute the SQL statement
	rows, err := repo.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Iterate over the result set and populate the notifications slice
	var notifications []Notification
	for rows.Next() {
		var notification Notification
		if err := rows.Scan(&notification.NotificationID, &notification.UserID, &notification.SenderID, &notification.NotificationType, &notification.GroupID, &notification.EventID, &notification.IsRead, &notification.CreatedAt); err != nil {
			return nil, err
		}

		if notification.NotificationType == "event" {
			notification.Event, _ = EventRepo.GetEvent(int(notification.EventID.Int64))
		}

		if notification.GroupID.Int64 > 0 {
			notification.Group, _ = GroupRepo.GetGroup(int(notification.GroupID.Int64))
		}

		notification.Sender, err = UserRepo.GetUserByID(notification.SenderID)
		notification.CreatedAt = lib.FormatDateDB(notification.CreatedAt)

		if err != nil {
			fmt.Println(" There is no sender")
			return nil, err
		}

		notification.User, err = UserRepo.GetUserByID(notification.UserID)

		if err != nil {
			fmt.Println(" There is no receiver")
			return nil, err
		}

		notifications = append(notifications, notification)
	}

	return notifications, nil
}

// UpdateNotificationStatus updates the status of a notification
func (repo *NotificationRepository) UpdateNotificationStatus(notificationID int, newStatus bool) error {
	// Prepare the SQL statement
	query := `
		UPDATE notifications
		SET is_read = ?
		WHERE notification_id = ?
	`

	// Execute the SQL statement
	_, err := repo.db.Exec(query, newStatus, notificationID)
	if err != nil {
		return err
	}

	return nil
}

// DeleteNotification deletes a notification from the database
func (repo *NotificationRepository) DeleteNotification(notificationID int) error {
	// Prepare the SQL statement
	query := `
		DELETE FROM notifications
		WHERE notification_id = ?
	`

	// Execute the SQL statement
	_, err := repo.db.Exec(query, notificationID)
	if err != nil {
		return err
	}

	return nil
}
