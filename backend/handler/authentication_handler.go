package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"server/lib"
	"server/models"

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

func SigninHandler(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsPost(w,r)

	if r.Method == "OPTIONS" {
		return
	}

	request := new(LoginRequest)

	var apiError ApiError
	if err := json.NewDecoder(r.Body).Decode(request); err != nil {
		apiError.Error = "Cannot Decode your JSON. Check the your data format"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

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
		WriteJSON(w, http.StatusUnauthorized, apiError)
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

func IsTokenValid(sessionToken string) (models.Session, bool) {
	if sessionToken != "" {
		userSession, exists := models.SessionRepo.SessionExists(sessionToken)
		if exists && !lib.IsExpired(userSession.Expiry) {
			return userSession, true
		}
	}
	return models.Session{}, false
}

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsGet(w,r)

	var user models.User
	var apiError ApiError
	errs := r.ParseMultipartForm(10 << 20)
	if errs != nil {
		return
	}

	firstname := r.FormValue("first_name")
	lastname := r.FormValue("last_name")
	about_me := r.FormValue("about_me")
	nickname := r.FormValue(("nickname"))
	password := r.FormValue("password")
	email := r.FormValue("email")
	birthdate := r.FormValue("birthdate")

	if !lib.IsValidName((firstname)) || !lib.IsValidName((lastname)) {
		apiError.Error = "Firstname/Lastname cannot have numbers or to much spaces."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if lib.IsBlank(firstname) {
		apiError.Error = "Firstname cannot be empty."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if len(strings.TrimSpace(about_me)) > MAX_LENGTH_ABOUT_ME {
		apiError.Error = fmt.Sprintf("About me cannot exceed %d characters.", MAX_LENGTH_ABOUT_ME)
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if strings.TrimSpace(nickname) != "" && !lib.IsValidNickname(strings.TrimSpace(nickname)) {
		apiError.Error = "Respect nickname specification. Only Numeric and special charactes but no space"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if lib.IsBlank(strings.TrimSpace(lastname)) {
		apiError.Error = "Lastname cannot be empty."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if lib.IsBlank(strings.TrimSpace(password)) {
		apiError.Error = "Password cannot be empty."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if !lib.IsValidEmail(strings.TrimSpace(email)) {
		apiError.Error = "Email not valid."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	ok, msgerr := lib.IsValidDOB(strings.TrimSpace(birthdate))
	if !ok {
		apiError.Error = msgerr
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	avatarFile, avatarHeader, err := r.FormFile("avatar")
	if err != nil {
		if err != http.ErrMissingFile {
			avatarFile = nil
		}
	}
	var avatarFilename string

	if avatarFile != nil {
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
			http.Error(w, "Extension de fichier non valide (JPEG, JPG, GIF, WEBP et PNG uniquement)", http.StatusBadRequest)
			return
		}
		// Generate a unique filename for the avatar, e.g., using the user's email and a timestamp
		avatarFilename = fmt.Sprintf("%s_%d%s", user.Email, time.Now().UnixNano(), filepath.Ext(avatarHeader.Filename))

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

	}

	if avatarFilename == "" {
		avatarFilename = "blankProfile.png"
	}

	user.LastName = lastname
	user.FirstName = firstname
	user.Nickname = nickname
	user.AboutMe = about_me
	user.DateOfBirth = birthdate
	user.Email = email
	user.Avatar = avatarFilename

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		apiError.Error = "Error with your password."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	user.Password = string(hashedPassword)

	err = models.UserRepo.CreateUser(&user)
	if err != nil {
		success := ApiError{Error: "An error occurred. The username/Email may be taken."}
		WriteJSON(w, http.StatusBadRequest, success)
		return
	}
	userCreated, err := models.UserRepo.GetUserByEmail(user.Email)
	if err != nil {
		apiError.Error = "An error occurred. Cannot get User by email"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	message := fmt.Sprintf("User %s %s successfully created.", userCreated.FirstName, userCreated.LastName)
	response := RegisterResponse{
		Message:   message,
		UserInfos: UserInfos{LastName: userCreated.LastName, Firstname: userCreated.FirstName, Nickname: userCreated.Nickname},
	}
	sessionToken := uuid.Must(uuid.NewV4()).String()
	InitSession(w, r, *userCreated, sessionToken)
	WriteJSON(w, http.StatusOK, response)
}

func CheckAutheHandler(w http.ResponseWriter, r *http.Request) {
	sessionToken := r.Header.Get("Authorization")
	userSesion, ok := models.SessionRepo.SessionExists(sessionToken)
	if !ok {
		var apiError ApiError
		apiError.Error = "Unauthorized"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		fmt.Println("No exist Authorization")
		return
	}
	userId, _ := strconv.Atoi(userSesion.UserID)
	user, err := models.UserRepo.GetUserByID(userId)
	if err != nil {
		log.Println("🚀 ~ funcCheckAutheHandler ~ err:", err)
		var apiError ApiError
		apiError.Error = "Unauthorized"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	user.Password = ""

	WriteJSON(w, http.StatusOK, user)
}

func IsAuthenticatedGoCheck(r *http.Request) (models.Session, bool) {
	c, err := r.Cookie("social-network")
	if err != nil {
		// fmt.Println("No exist Cookie: ", err)
		log.Println(err, "IsAuthenticatedGoCheck")
	}
	if err == nil {
		sessionToken := c.Value
		userSession, exists := models.SessionRepo.SessionExists(sessionToken)
		if exists && !lib.IsExpired(userSession.Expiry) {
			return userSession, true
		}
	}
	return models.Session{}, false
}
