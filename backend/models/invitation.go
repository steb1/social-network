package models

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// Invitation represents the structure of the "invitations" table.
type Invitation struct {
	InvitationID int       `db:"invitation_id"`
	SenderID     int       `db:"sender_id"`
	ReceiverID   int       `db:"receiver_id"`
	GroupID      int       `db:"group_id"`
	SentTime     time.Time `db:"sent_time"`
}

// InvitationRepository is responsible for database operations related to invitations.
type InvitationRepository struct {
	db *sql.DB
}

func NewInvitationRepository (db *sql.DB) *InvitationRepository {
	return &InvitationRepository {
		db: db,
	}
}

// CreateInvitation creates a new invitation in the database.
func (ir *InvitationRepository) CreateInvitation(invitation *Invitation) error {
	query := `
		INSERT INTO invitations (sender_id, receiver_id, group_id, sent_time)
		VALUES (?, ?, ?, ?)
	`

	result, err := ir.db.Exec(query, invitation.SenderID, invitation.ReceiverID, invitation.GroupID, invitation.SentTime)
	if err != nil {
		return fmt.Errorf("failed to create invitation: %w", err)
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("failed to get last inserted ID: %w", err)
	}

	invitation.InvitationID = int(lastInsertID)

	return nil
}

// GetInvitation retrieves an invitation from the database by its ID.
func (ir *InvitationRepository) GetInvitation(invitationID int) (*Invitation, error) {
	query := `
		SELECT * FROM invitations
		WHERE invitation_id = ?
	`

	var invitation Invitation
	err := ir.db.QueryRow(query, invitationID).Scan(&invitation.InvitationID, &invitation.SenderID, &invitation.ReceiverID, &invitation.GroupID, &invitation.SentTime)
	if err != nil {
		return nil, fmt.Errorf("failed to get invitation: %w", err)
	}

	return &invitation, nil
}

// UpdateInvitation updates an invitation in the database.
func (ir *InvitationRepository) UpdateInvitation(invitation *Invitation) error {
	query := `
		UPDATE invitations
		SET sender_id = ?, receiver_id = ?, group_id = ?, sent_time = ?
		WHERE invitation_id = ?
	`

	_, err := ir.db.Exec(query, invitation.SenderID, invitation.ReceiverID, invitation.GroupID, invitation.SentTime, invitation.InvitationID)
	if err != nil {
		return fmt.Errorf("failed to update invitation: %w", err)
	}

	return nil
}

// DeleteInvitation deletes an invitation from the database by its ID.
func (ir *InvitationRepository) DeleteInvitation(receiver_id, group_id int) error {
	query := `
		DELETE FROM invitations
		WHERE receiver_id = ? AND group_id = ?
	`

	_, err := ir.db.Exec(query, receiver_id, group_id)
	if err != nil {
		return fmt.Errorf("failed to delete invitation: %w", err)
	}

	return nil
}

func (ir *InvitationRepository) GetInvitationsByGroupID(groupID int) ([]User, error) {
	query := `
		SELECT users.* FROM invitations
		JOIN users ON users.user_id = invitations.sender_id
		WHERE invitations.group_id = ?
	`

	rows, err := ir.db.Query(query, groupID)
	if err != nil {
		return nil, fmt.Errorf("failed to get invitations by groupID: %w", err)
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(
			&user.UserID,
			&user.Email,
			&user.Password,
			&user.FirstName,
			&user.LastName,
			&user.DateOfBirth,
			&user.Avatar,
			&user.Nickname,
			&user.AboutMe,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user row: %w", err)
		}
		users = append(users, user)
	}

	return users, nil
}

func (ir *InvitationRepository) GetInvitationsByReceiverID(receiverID int) ([]User, error) {
	query := `
		SELECT users.* FROM invitations
		JOIN users ON users.user_id = invitations.sender_id
		WHERE invitations.receiver_id = ?
	`

	rows, err := ir.db.Query(query, receiverID)
	if err != nil {
		return nil, fmt.Errorf("failed to get invitations by receiverID: %w", err)
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(
			&user.UserID,
			&user.Email,
			&user.Password,
			&user.FirstName,
			&user.LastName,
			&user.DateOfBirth,
			&user.Avatar,
			&user.Nickname,
			&user.AboutMe,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user row: %w", err)
		}
		users = append(users, user)
	}

	return users, nil
}

func (ir *InvitationRepository) IsInvited(receiverID, groupID int) (bool) {
	query := `
		SELECT COUNT(*) FROM invitations
		WHERE receiver_id = ? AND group_id = ?
	`

	var count int
	_ = ir.db.QueryRow(query, receiverID, groupID).Scan(&count)

	return count > 0
}