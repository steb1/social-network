package handler

import (
	"log"
	"net/http"
	"strconv"

	"server/models"
)

type UserProfileResponse struct {
	IDRequester       string              `json:"id_requester"`
	NicknameRequester string              `json:"nickname_requester"`
	UserID            int                 `json:"user_id"`
	FirstName         string              `json:"firstName"`
	LastName          string              `json:"lastName"`
	Nickname          string              `json:"nickname"`
	Email             string              `json:"email"`
	DateOfBirth       string              `json:"dateOfBirth"`
	Avatar            string              `json:"avatar"`
	AboutMe           string              `json:"aboutMe"`
	AccountType       string              `json:"accountType"`
	FollowStatus      string              `json:"followStatus"`
	UserPosts         []*models.Post      `json:"userPosts"`
	Followers         []*models.User      `json:"followers"`
	Followings        []*models.User      `json:"followings"`
	Groups            []*models.GroupInfo `json:"groups"`
}

type ChatResponse struct {
	NicknameRequester string                              `json:"nickname_requester"`
	Avatar            string                              `json:"avatar"`
	Followers         []*models.User                      `json:"followers"`
	Followings        []*models.User                      `json:"followings"`
	Messages          map[string][]models.MessageResponse `json:"messages"`
	Groups            []*models.GroupInfo                 `json:"groups"`
}

func GetMessageResponse(w http.ResponseWriter, r *http.Request) {
	session, ok := IsAuthenticated(r)
	var apiError ApiError

	if !ok {
		apiError.Error = "StatusUnauthorized"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	to := r.URL.Query().Get("to")

	toUserID := models.UserRepo.GetIDFromUsernameOrEmail(to)

	if toUserID < 1 {
		apiError.Error = "User not does not exist"
		WriteJSON(w, http.StatusBadRequest, nil)

		// Check if it's a user
		userExists, _ := models.UserRepo.UserExists(models.UserRepo.GetIDFromUsernameOrEmail(to))

		// Check if it's a group
		idGroup, err := strconv.Atoi(to)
		groupExists := false

		if err == nil {
			_, groupErr := models.MembershipRepo.GetAllUsersByGroupID(idGroup)
			groupExists = groupErr == nil
		}

		// If ni user ni group
		if !userExists && !groupExists {
			WriteJSON(w, http.StatusNotFound, nil)
		}

		id, _ := strconv.Atoi(session.UserID)

		user, err := models.UserRepo.GetUserByID(id)
		if err != nil {
			log.Println("🚀 ~ funcHandleGetProfileGetUserByID ~ err:", err)
			var apiError ApiError
			apiError.Error = "Not found user"
			WriteJSON(w, http.StatusNotFound, apiError)
			return
		}

		followers, err := models.SubscriptionRepo.GetFollowers(user.UserID)
		if err != nil {
			log.Println("🚀 ~ funcHandleGetProfileGetFollowers ~ err:", err)
			var apiError ApiError
			apiError.Error = "Not found followers"
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}

		followings, err := models.SubscriptionRepo.GetFollowing(user.UserID)
		if err != nil {
			log.Println("🚀 ~ funcHandleGetProfileGetFollowing ~ err:", err)
			var apiError ApiError
			apiError.Error = "Not found followings"
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}

		UN := user.Nickname
		if UN == "" {
			UN = user.Email
		}
		offset, error := strconv.Atoi(r.URL.Query().Get("offset"))
		if error != nil {
			offset = 0
		}
		error = nil

		Groups, err := models.MembershipRepo.GetAllGroupsForUser(user.UserID)
		if err != nil {
			log.Println("🚀 ~ funcGetMessageResponse ~ GetAllGroupsForUser ~ err:", err)
		}
		limit := 20
		messages, err := models.MessageRepo.GetMessagesBetweenUsers(user.UserID, toUserID, offset, limit)
		if err != nil {
			log.Println("��� ~ funcHandleGetProfileGetMessagesBetweenUsers ~ err:", err)
			var apiError ApiError
			apiError.Error = "Not found messages"
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}

		// Create a UserProfileResponse without the password field
		chatResponse := ChatResponse{
			NicknameRequester: UN,
			Avatar:            user.Avatar,
			Followers:         followers,
			Followings:        followings,
			Groups:            Groups,
			Messages:          messages,
		}

		WriteJSON(w, http.StatusOK, chatResponse)
	}
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
		log.Println("🚀 ~ funcHandleGetProfileGetUserByID ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found user"
		WriteJSON(w, http.StatusNotFound, apiError)
		return
	}

	postOwned, err := models.PostRepo.GetUserOwnPosts(user.UserID)
	if err != nil {
		log.Println("🚀 ~ funcHandleGetProfileGetUserOwnPosts ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found post"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	followers, err := models.SubscriptionRepo.GetFollowers(user.UserID)
	if err != nil {
		log.Println("🚀 ~ funcHandleGetProfileGetFollowers ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found followers"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	followings, err := models.SubscriptionRepo.GetFollowing(user.UserID)
	if err != nil {
		log.Println("🚀 ~ funcHandleGetProfileGetFollowing ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found followings"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	session_user, err := strconv.Atoi(session.UserID)
	if err != nil {
		log.Println("🚀 ~ funcHandleGetProfileAtoi ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found followings"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	followStatus, err := models.SubscriptionRepo.GetFollowingStatus(session_user, user.UserID)
	if err != nil {
		log.Println("🚀 ~ funcHandleGetProfileGetFollowingStatus ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found followings"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	// Create a UserProfileResponse without the password field
	userProfile := UserProfileResponse{
		IDRequester:  session.UserID,
		UserID:       user.UserID,
		FirstName:    user.FirstName,
		LastName:     user.LastName,
		Nickname:     user.Nickname,
		Email:        user.Email,
		DateOfBirth:  user.DateOfBirth,
		Avatar:       user.Avatar,
		AboutMe:      user.AboutMe,
		AccountType:  user.AccountType,
		UserPosts:    postOwned,
		Followers:    followers,
		Followings:   followings,
		FollowStatus: followStatus,
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
	if ParamPrivacy != "Private" && ParamPrivacy != "Public" {
		var apiError ApiError
		apiError.Error = "BadRequest"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	userId, _ := strconv.Atoi(session.UserID)

	err := models.UserRepo.UpdateUserProfilePrivacy(userId, ParamPrivacy)
	if err != nil {
		log.Println("Error updating user profile", err)
		var apiError ApiError
		apiError.Error = "StatusInternalServerError"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}
}
