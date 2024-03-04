package models

import (
	"database/sql"
	"log"
	"strconv"

	"server/lib"

	"golang.org/x/crypto/bcrypt"
)

const (
	TypePublic  = "Public"
	TypePrivate = "Private"
)

type User struct {
	UserID      int    `json:"user_id"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	Nickname    string `json:"nickname"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	DateOfBirth string `json:"birthdate"`
	Avatar      string `json:"avatar"`
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

	_, err := ur.db.Exec(query, user.Email, user.Password, user.FirstName, user.LastName, user.DateOfBirth, lib.NewNullString(user.Avatar), lib.NewNullString(user.Nickname), user.AboutMe)
	if err != nil {
		return err
	}

	return nil
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
		user.DateOfBirth, user.Avatar, lib.NewNullString(user.Nickname), user.AboutMe, user.UserID)
	if err != nil {
		return err
	}
	return nil
}

// UpdateUser updates an existing user in the database
func (ur *UserRepository) UpdateUserProfilePrivacy(userID int, mode string) error {
	query := `
		UPDATE users
		SET account_type = ?
		WHERE user_id = ?
	`
	_, err := ur.db.Exec(query, mode, userID)
	if err != nil {
		return err
	}
	return nil
}

func (ur *UserRepository) UserExists(userid int) (bool, error) {
	userID := strconv.Itoa(userid)
	query := "SELECT COUNT(*) as total FROM users WHERE user_id = ?"
	var total int
	err := ur.db.QueryRow(query, userID).Scan(&total)
	if err != nil {
		return false, err
	}
	if total == 0 {
		return false, err
	}
	return true, nil
}

func (ur *UserRepository) GetAccountType(userId int) (string, error) {
	var accountType string
	query := `
       SELECT account_type FROM users 
	   WHERE user_id = ? 
    `
	row := ur.db.QueryRow(query, userId)
	err := row.Scan(
		&accountType,
	)
	if err != nil {
		return accountType, err
	}

	return accountType, nil
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
	var nickname sql.NullString
	user := &User{}
	err := row.Scan(
		&user.UserID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Avatar,
		&nickname,
		&user.AboutMe,
		&user.AccountType,
	)
	if err != nil {
		return nil, err
	}

	user.Nickname = lib.GetStringFromNullString(nickname)

	return user, nil
}

// GetUserByID retrieves a user from the database based on their ID
func (ur *UserRepository) GetUserByID(userID int) (*User, error) {
	query := `
        SELECT * FROM users
        WHERE user_id = ?
    `
	row := ur.db.QueryRow(query, userID)
	var nickname sql.NullString
	user := &User{}
	err := row.Scan(
		&user.UserID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Avatar,
		&nickname,
		&user.AboutMe,
		&user.AccountType,
	)
	if err != nil {
		return nil, err
	}

	user.Nickname = lib.GetStringFromNullString(nickname)

	return user, nil
}

func (ur *UserRepository) GetIDFromUsernameOrEmail(usernameOrEmail string) int {
	query := `
	SELECT user_id FROM users WHERE nickname = ? OR email = ?
`
	var userId int
	err := ur.db.QueryRow(query, usernameOrEmail, usernameOrEmail).Scan(&userId)
	if err != nil {
		log.Println("🚀 ~ func username of email,", usernameOrEmail, " ~ err:", err)
		if err == sql.ErrNoRows {
			return 0
		}
		return 0
	}
	return userId
}

// GetUserByNickname retrieves a user from the database based on their nickname
func (ur *UserRepository) GetUserByNickname(nickname string) (*User, error) {
	query := `
        SELECT * FROM users
        WHERE nickname = ?
    `
	row := ur.db.QueryRow(query, nickname)

	var nicknameStr sql.NullString

	user := &User{}
	err := row.Scan(
		&user.UserID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Avatar,
		&nicknameStr,
		&user.AboutMe,
		&user.AccountType,
	)
	if err != nil {
		return nil, err
	}
	user.Nickname = lib.GetStringFromNullString(nicknameStr)
	return user, nil
}

// GetUserByNickname retrieves a user from the database based on their nickname
func (ur *UserRepository) GetUserByNicknameOrEmail(login string) (User, error) {
	query := `
        SELECT * FROM users
        WHERE nickname = ? OR email = ? 
    `
	row := ur.db.QueryRow(query, login, login)
	var nickname sql.NullString

	var user User
	err := row.Scan(
		&user.UserID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Avatar,
		&nickname,
		&user.AboutMe,
		&user.AccountType,
	)
	if err != nil {
		return user, err
	}
	user.Nickname = lib.GetStringFromNullString(nickname)

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
		var nickname sql.NullString
		err := rows.Scan(
			&user.UserID,
			&user.Email,
			&user.Password,
			&user.FirstName,
			&user.LastName,
			&user.DateOfBirth,
			&user.Avatar,
			&nickname,
			&user.AboutMe,
			&user.AccountType,
		)
		if err != nil {
			return nil, err
		}

		user.Nickname = lib.GetStringFromNullString(nickname)
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
	var nickname sql.NullString
	user := &User{}
	err := row.Scan(
		&user.UserID,
		&user.Email,
		&user.Password,
		&user.FirstName,
		&user.LastName,
		&user.DateOfBirth,
		&user.Avatar,
		&nickname,
		&user.AboutMe,
		&user.AccountType,
	)
	if err != nil {
		return nil, err
	}
	user.Nickname = lib.GetStringFromNullString(nickname)
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
