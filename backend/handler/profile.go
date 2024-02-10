package handler

import (
	"log"
	"net/http"
	"strconv"

	"server/models"
)

type UserProfileResponse struct {
	IDRequester string         `json:"id_requester"`
	UserID      int            `json:"user_id"`
	FirstName   string         `json:"firstName"`
	LastName    string         `json:"lastName"`
	Nickname    string         `json:"nickname"`
	Email       string         `json:"email"`
	DateOfBirth string         `json:"dateOfBirth"`
	Avatar      string         `json:"avatar"`
	AboutMe     string         `json:"aboutMe"`
	AccountType string         `json:"accountType"`
	UserPosts   []*models.Post `json:"userPosts"`
	Followers   []*models.User `json:"followers"`
	Followings  []*models.User `json:"followings"`
}

func HandleGetProfile(w http.ResponseWriter, r *http.Request) {
	session, ok := IsAuthenticated(r)

	if !ok {
		var apiError ApiError
		apiError.Error = "StatusUnauthorized"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	idParam := r.URL.Query().Get("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		var apiError ApiError
		apiError.Error = "BadRequest"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	user, err := models.UserRepo.GetUserByID(id)
	if err != nil {
		log.Println("🚀 ~ funcHandleGetProfile ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found user"
		WriteJSON(w, http.StatusNotFound, apiError)
		return
	}

	postOwned, err := models.PostRepo.GetUserOwnPosts(user.UserID)
	if err != nil {
		log.Println("🚀 ~ funcHandleGetProfile ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found post"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	followers, err := models.SubscriptionRepo.GetFollowers(user.UserID)
	if err != nil {
		log.Println("🚀 ~ funcHandleGetProfile ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found followers"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	followings, err := models.SubscriptionRepo.GetFollowing(user.UserID)
	if err != nil {
		log.Println("🚀 ~ funcHandleGetProfile ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found followings"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	// Create a UserProfileResponse without the password field
	userProfile := UserProfileResponse{
		IDRequester: session.UserID,
		UserID:      user.UserID,
		FirstName:   user.FirstName,
		LastName:    user.LastName,
		Nickname:    user.Nickname,
		Email:       user.Email,
		DateOfBirth: user.DateOfBirth,
		Avatar:      user.Avatar,
		AboutMe:     user.AboutMe,
		AccountType: user.AccountType,
		UserPosts:   postOwned,
		Followers:   followers,
		Followings:  followings,
	}

	WriteJSON(w, http.StatusOK, userProfile)
}

func ToggleProfilePrivacy(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	session, ok := IsAuthenticated(r)
	if !ok {
		var apiError ApiError
		apiError.Error = "StatusUnauthorized"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	ParamPrivacy := r.URL.Query().Get("type")
	log.Println("🚀 ~ funcToggleProfilePrivacy ~ ParamPrivacy:", ParamPrivacy)
	if ParamPrivacy != "Private" && ParamPrivacy != "Public" {
		var apiError ApiError
		apiError.Error = "BadRequest"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	userId, _ := strconv.Atoi(session.UserID)

	err := models.UserRepo.UpdateUserProfilePrivacy(userId, ParamPrivacy)
	if err != nil {
		log.Printf("Error updating user profile", err)
		var apiError ApiError
		apiError.Error = "StatusInternalServerError"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}
}
