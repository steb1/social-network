package models

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"server/lib"
	"sync"
	"time"

	"github.com/gofrs/uuid"
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
		lib.HandleError(err, "Scanning session token.")
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

func GetUserFromSession(req *http.Request) *User {
	user := User{}
	cookie, err := req.Cookie("auth_session")
	if err == nil {
		if session, ok := AllSessions.Load(cookie.Value); ok {
			_user, err := UserRepo.GetUser(session.(Session).UserID)
			if err != nil {
				log.Println("❌ ", err)
			}
			user = *_user
		}
	}
	return &user
}

func NewSessionToken(res http.ResponseWriter, UserID string) {
	sessionToken, err := uuid.NewV4()
	if err != nil {
		log.Fatalf("❌ Failed to generate UUID: %v", err)
	}
	deleteSessionIfExist(UserID)
	ExpireAt := time.Now().Add(2 * time.Hour)
	AllSessions.Store(sessionToken.String(), Session{UserID, UserID, ExpireAt})
	http.SetCookie(res, &http.Cookie{
		Name:     "auth_session",
		Value:    sessionToken.String(),
		HttpOnly: true,
		Expires:  ExpireAt,
	})
	fmt.Println("session IN")
}

func deleteSessionIfExist(ID string) {
	AllSessions.Range(func(key, value interface{}) bool {
		if ID == value.(Session).UserID {
			AllSessions.Delete(key)
		}
		return true
	})
}

func (sr *SessionRepository) UserHasAlreadyASession(userID int) (Session, bool) {
	var session Session

	row := sr.db.QueryRow("SELECT * FROM sessions WHERE user_id = ?", userID)

	err := row.Scan(&session.Token, &session.UserID, &session.Expiry)
	if err != nil {
		lib.HandleError(err, "Scanning session token.")
		return session, false
	}

	db.Close()

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

func DeleteSession(req *http.Request) bool {
	cookie, err := req.Cookie("auth_session")
	if err != nil {
		return false
	}
	AllSessions.Delete(cookie.Value)
	return true
}
