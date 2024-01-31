package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"server/lib"
	"server/models"
	"strconv"
	"strings"
	"time"

	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

var MAX_LENGTH_ABOUT_ME = 600

type RegisterResponse struct {
	UserInfos UserInfos `json:"user"`
	Message   string    `json:"message"`
}

type LoginRequest struct {
	NicknameOrEmail string `json:"emailOrNickname"`
	Password        string `json:"password"`
}

type UserInfos struct {
	Firstname string `json:"first_name"`
	LastName  string `json:"last_name"`
	Nickname  string `json:"nickname"`
}

type SigninResponse struct {
	UserInfos models.User `json:"user"`
	Message   string      `json:"message"`
	Token     string      `json:"token"`
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	userRequest := new(models.User)

	if err := json.NewDecoder(r.Body).Decode(userRequest); err != nil {
		return
	}
	var apiError ApiError

	if lib.IsValidName(userRequest.FirstName) || lib.IsValidName((userRequest.LastName)) {
		apiError.Error = "Firstname/Lastname cannot have numbers or to much spaces."
		WriteJSON(w, http.StatusBadRequest, apiError)
	}

	if lib.IsBlank(userRequest.FirstName) {
		apiError.Error = "Firstname cannot be empty."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	if len(userRequest.AboutMe) > MAX_LENGTH_ABOUT_ME {
		apiError.Error = fmt.Sprintf("About me cannot exceed %d characters.", MAX_LENGTH_ABOUT_ME)
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if userRequest.Nickname != "" && !lib.IsValidNickname(userRequest.Nickname) {
		apiError.Error = "Respect nickname specification. Only Numeric and special charactes but no space"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if lib.IsBlank(userRequest.LastName) {
		apiError.Error = "Lastname cannot be empty."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if lib.IsBlank(userRequest.Password) {
		apiError.Error = "Password cannot be empty."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if !lib.IsValidEmail(userRequest.Email) {
		apiError.Error = "Email not valid."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if !lib.IsValidDOB(userRequest.DateOfBirth) {
		apiError.Error = "Provide a valid Date."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	avatarFile, avatarHeader, err := r.FormFile("avatar")
	if err != nil {
		if err != http.ErrMissingFile {
			log.Println("Error while fetching files:", err)
			return
		}
	}

	defer avatarFile.Close()
	if avatarHeader.Size > 20*1024*1024 {
		apiError.Error = "Cannot upload files bigger than 20MB."
		WriteJSON(w, http.StatusBadRequest, apiError)
		log.Println("Cannot upload files more than 20 MB")
		return
	}
	ext := filepath.Ext(avatarHeader.Filename)
	ext = strings.ToLower(ext)
	validExtensions := []string{".jpeg", ".jpg", ".gif", ".webp", ".png"}
	allowed := false
	for _, extension := range validExtensions {
		if ext == extension {
			allowed = true
		}
	}
	if !allowed {
		fmt.Println("Extension not valid :", ext)
		http.Error(w, "Extension de fichier non valide (JPEG, JPG, GIF, WEBP et PNG uniquement)", http.StatusBadRequest)
		return
	}
	// Generate a unique filename for the avatar, e.g., using the user's email and a timestamp
	avatarFilename := fmt.Sprintf("%s_%d%s", userRequest.Email, time.Now().UnixNano(), filepath.Ext(avatarHeader.Filename))

	// Specify the path where the avatar will be saved
	avatarPath := filepath.Join("./uploads/avatar", avatarFilename)

	// Save the avatar to the specified path
	avatarSaveErr := lib.SaveFile(avatarFile, avatarPath)
	if avatarSaveErr != nil {
		// Handle avatar save error
		apiError.Error = "Error saving avatar."
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	userRequest.Avatar = avatarFilename

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(userRequest.Password), bcrypt.DefaultCost)
	if err != nil {
		apiError.Error = "Error with your password."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	userRequest.Password = string(hashedPassword)

	err = models.UserRepo.CreateUser(userRequest)
	if err != nil {
		success := ApiError{Error: "An error occurred. The username/Email may be taken."}
		WriteJSON(w, http.StatusBadRequest, success)
		return
	}
	user, err := models.UserRepo.GetUserByEmail(userRequest.Email)
	if err != nil {
		apiError.Error = "An error occurred."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	message := fmt.Sprintf("User %s %s successfully created.", user.FirstName, user.LastName)
	response := RegisterResponse{
		Message:   message,
		UserInfos: UserInfos{LastName: user.LastName, Firstname: user.FirstName, Nickname: user.Nickname},
	}
	sessionToken := uuid.Must(uuid.NewV4()).String()
	InitSession(w, r, *user, sessionToken)
	WriteJSON(w, http.StatusOK, response)
}

func SigninHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	request := new(LoginRequest)

	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		return
	}

	var apiError ApiError

	if lib.IsBlank(request.NicknameOrEmail) {
		apiError.Error = "Username/Email cannot be empty."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	if lib.IsBlank(request.Password) {
		apiError.Error = "Password cannot be empty."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	user, ok := models.UserRepo.CheckCredentials(request.NicknameOrEmail, request.Password)
	if !ok {
		apiError := ApiError{Error: "Woops! Invalid credentials."}
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	sessionToken := uuid.Must(uuid.NewV4()).String()
	WriteJSON(w, http.StatusOK, SigninResponse{Message: "Valid login.", UserInfos: user, Token: sessionToken})
	InitSession(w, r, user, sessionToken)
}

func InitSession(w http.ResponseWriter, r *http.Request, user models.User, sessionToken string) {
	expiresAt := time.Now().Add(sessionDuration)

	// Check if an user already have a session. If it is the case it deletes the ancient session and creates a new.
	// We cannot have two differents session on our forum -> audit
	session, checkSession := models.SessionRepo.UserHasAlreadyASession(user.UserID)
	if checkSession {
		models.SessionRepo.DeleteSession(session.Token)
		var session models.Session
		session.Token = sessionToken
		session.UserID = strconv.Itoa(user.UserID)
		session.Expiry = expiresAt
		models.SessionRepo.CreateSession(&session)
	} else {
		session.Token = sessionToken
		session.UserID = strconv.Itoa(user.UserID)
		session.Expiry = expiresAt
		models.SessionRepo.CreateSession(&session)
	}
}

func Logout(w http.ResponseWriter, r *http.Request) {
	sessionToken := r.Header.Get("Authorization")
	if sessionToken != "" {
		models.SessionRepo.DeleteSession(sessionToken)
	}
	WriteJSON(w, http.StatusOK, ApiSuccess{Message: "Deconnected."})
}

func IsAuthenticated(r *http.Request) (models.Session, bool) {
	sessionToken := r.Header.Get("Authorization")
	if sessionToken != "" {
		userSession, exists := models.SessionRepo.SessionExists(sessionToken)
		if exists && !lib.IsExpired(userSession.Expiry) {
			return userSession, true
		}
	}
	return models.Session{}, false
}
