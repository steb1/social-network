package models

import (
	"database/sql"
	"server/lib"

	"golang.org/x/crypto/bcrypt"
)

type User struct {
	UserID      int    `json:"user_id"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	DateOfBirth string `json:"birthdate"`
	Avatar      string `json:"avatar"`
	Nickname    string `json:"nickname"`
	AboutMe     string `json:"about_me"`
	AccountType string `json:"account_type"`
}

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

// CreateUser adds a new user to the database
func (ur *UserRepository) CreateUser(user *User) error {
	query := `
		INSERT INTO users (email, password, first_name, last_name, date_of_birth, avatar, nickname, about_me)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`
	_, err := ur.db.Exec(query, user.Email, user.Password, user.FirstName, user.LastName, user.DateOfBirth, user.Avatar, user.Nickname, user.AboutMe)
	if err != nil {
		return err
	}

	return nil
}

// GetUser retrieves a user from the database by user_id
func (ur *UserRepository) GetUser(userID string) (*User, error) {
	query := "SELECT * FROM users WHERE user_id = ?"
	var user User
	err := ur.db.QueryRow(query, userID).Scan(
		&user.UserID, &user.Email, &user.Password, &user.FirstName,
		&user.LastName, &user.DateOfBirth, &user.Avatar, &user.Nickname, &user.AboutMe, &user.AccountType)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// UpdateUser updates an existing user in the database
func (ur *UserRepository) UpdateUser(user *User) error {
	query := `
		UPDATE users
		SET email = ?, password = ?, first_name = ?, last_name = ?,
			date_of_birth = ?, avatar = ?, nickname = ?, about_me = ?
		WHERE user_id = ?
	`
	_, err := ur.db.Exec(query, user.Email, user.Password, user.FirstName, user.LastName,
		user.DateOfBirth, user.Avatar, user.Nickname, user.AboutMe, user.UserID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteUser removes a user from the database by user_id
func (ur *UserRepository) DeleteUser(userID int) error {
	query := "DELETE FROM users WHERE user_id = ?"
	_, err := ur.db.Exec(query, userID)
	if err != nil {
		return err
	}
	return nil
}

// GetUserByEmail retrieves a user from the database based on their email
func (ur *UserRepository) GetUserByEmail(email string) (*User, error) {
	query := `
        SELECT * FROM users
        WHERE email = ?
    `
	row := ur.db.QueryRow(query, email)

	user := &User{}
	err := row.Scan(
		&user.UserID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Avatar,
		&user.Nickname,
		&user.AboutMe,
		&user.AccountType,
	)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// GetUserByNickname retrieves a user from the database based on their nickname
func (ur *UserRepository) GetUserByNickname(nickname string) (*User, error) {
	query := `
        SELECT * FROM users
        WHERE nickname = ?
    `
	row := ur.db.QueryRow(query, nickname)

	user := &User{}
	err := row.Scan(
		&user.UserID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Avatar,
		&user.Nickname,
		&user.AboutMe,
		&user.AccountType,
	)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// GetUserByNickname retrieves a user from the database based on their nickname
func (ur *UserRepository) GetUserByNicknameOrEmail(login string) (User, error) {
	query := `
        SELECT * FROM users
        WHERE nickname = ? OR email = ? 
    `
	row := ur.db.QueryRow(query, login, login)

	var user User
	err := row.Scan(
		&user.UserID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Avatar,
		&user.Nickname,
		&user.AboutMe,
		&user.AccountType,
	)
	if err != nil {
		return user, err
	}
	return user, nil
}

// SelectAllUsers retrieves all users from the database
func (ur *UserRepository) SelectAllUsers() ([]*User, error) {
	query := `
        SELECT * FROM users
    `
	rows, err := ur.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*User

	for rows.Next() {
		user := &User{}
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
			&user.AccountType,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)

	}

	return users, nil
}

// GetUserByPostID retrieves a user from the database based on their post ID
// Note: This assumes there is a posts table with a user_id column linking to the users table
func (ur *UserRepository) GetUserByPostID(postID int) (*User, error) {
	query := `
        SELECT users.* FROM users
        JOIN posts ON users.user_id = posts.user_id
        WHERE posts.post_id = ?
    `
	row := ur.db.QueryRow(query, postID)

	user := &User{}
	err := row.Scan(
		&user.UserID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Avatar,
		&user.Nickname,
		&user.AboutMe,
		&user.AccountType,
	)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (ur *UserRepository) CheckCredentials(login, password string) (User, bool) {
	user, err := UserRepo.GetUserByNicknameOrEmail(login)

	if err != nil {
		lib.HandleError(err, "Error getting user by Crendentials. User may not exists.")
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))

	if err == nil {
		return user, true
	}

	return user, false
}
