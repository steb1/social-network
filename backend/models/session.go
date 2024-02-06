package models

import (
	"database/sql"
	"sync"
	"time"
)

var AllSessions sync.Map

// Session structure represents the "sessions" table
type Session struct {
	Token  string    `json:"token"`
	UserID string    `json:"user_id"`
	Expiry time.Time `json:"expiry"`
}

type SessionRepository struct {
	db *sql.DB
}

func NewSessionRepository(db *sql.DB) *SessionRepository {
	return &SessionRepository{
		db: db,
	}
}

// CreateSession adds a new session to the database
func (sr *SessionRepository) CreateSession(session *Session) error {
	query := `
		INSERT INTO sessions (token, user_id, expiry)
		VALUES (?, ?, ?)
	`
	_, err := sr.db.Exec(query, session.Token, session.UserID, session.Expiry)
	if err != nil {
		return err
	}

	return nil
}

// GetSession retrieves a session from the database by token
func (sr *SessionRepository) GetSession(token string) (*Session, error) {
	query := "SELECT * FROM sessions WHERE token = ?"
	var session Session
	err := sr.db.QueryRow(query, token).Scan(&session.Token, &session.UserID, &session.Expiry)
	if err != nil {
		return nil, err
	}
	return &session, nil
}

func (sr *SessionRepository) SessionExists(token string) (Session, bool) {
	var session Session

	row := sr.db.QueryRow("SELECT * FROM sessions WHERE token = ?", token)

	err := row.Scan(&session.Token, &session.UserID, &session.Expiry)
	if err != nil {
		return session, false
	}

	return session, true
}

// UpdateSession updates an existing session in the database
func (sr *SessionRepository) UpdateSession(session *Session) error {
	query := `
		UPDATE sessions
		SET user_id = ?, expiry = ?
		WHERE token = ?
	`
	_, err := sr.db.Exec(query, session.UserID, session.Expiry, session.Token)
	if err != nil {
		return err
	}
	return nil
}

// DeleteSession removes a session from the database by token
func (sr *SessionRepository) DeleteSession(token string) error {
	query := "DELETE FROM sessions WHERE token = ?"
	_, err := sr.db.Exec(query, token)
	if err != nil {
		return err
	}
	return nil
}

func (sr *SessionRepository) UserHasAlreadyASession(userID int) (Session, bool) {
	var session Session

	row := sr.db.QueryRow("SELECT * FROM sessions WHERE user_id = ?", userID)

	err := row.Scan(&session.Token, &session.UserID, &session.Expiry)
	if err != nil {
		return session, false
	}

	return session, true
}

func (s Session) isExpired() bool {
	return s.Expiry.Before(time.Now())
}

func DeleteExpiredSessions() {
	for {
		AllSessions.Range(func(key, value interface{}) bool {
			if value.(Session).isExpired() {
				AllSessions.Delete(key)
			}
			return true
		})
		time.Sleep(10 * time.Second)
	}
}
