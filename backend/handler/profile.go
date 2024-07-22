package handler

import (
	"log"
	"net/http"
	"strconv"

	"server/lib"
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
	AbleToTalk        []*models.User                      `json:"ableToTalk"`
	MessagesPreview   []*models.MessagePreview            `json:"messagesPreview"`
	Messages          map[string][]models.MessageResponse `json:"messages"`
	Groups            []*models.GroupInfo                 `json:"groups"`
	User              []models.User
}

type Test struct {
	User    *models.User `json:"user"`
	Message string       `json:"message"`
}

func GetMessageResponse(w http.ResponseWriter, r *http.Request) {
	addCorsHeader(w, r)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	session, ok := IsAuthenticated(r)
	var apiError ApiError

	if !ok {
		apiError.Error = "StatusUnauthorized"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	id, _ := strconv.Atoi(session.UserID)
	// Check if it's a user

	userExists, _ := models.UserRepo.UserExists(id)
	if !userExists {
		log.Println("🚀 ~ funcHandleGetProfileGetFollowing ~ err:", userExists)
		var apiError ApiError
		apiError.Error = "Not found followings"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	user, err := models.UserRepo.GetUserByID(id)

	ableToTalk, err := models.SubscriptionRepo.GetAbleToTalk(user.UserID)
	if err != nil {
		log.Println("🚀 ~ funcHandleGetProfileGetFollowing ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found followings"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}
	messagesPreview, err := models.MessageRepo.GetMessagePreviewsForAnUser(user.UserID)
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

	Groups, err := models.MembershipRepo.GetAllGroupsForUser(user.UserID)
	if err != nil {
		log.Println("🚀 ~ funcGetMessageResponse ~ GetAllGroupsForUser ~ err:", err)
	}

	var tabUsers []models.User
	mess, err := models.MessageRepo.GetMessagePreviewsForAnUser(user.UserID)
	if err != nil {
		log.Println("🚀 ~ GetMessagePreviewsForAnUser ~ err:", err)
		var apiError ApiError
		apiError.Error = "Not found followings"
		WriteJSON(w, http.StatusInternalServerError, apiError)
		return
	}

	messages := map[string][]models.MessageResponse{}

	if mess[0].Genre == "user" {
		// offset, error := strconv.Atoi(r.URL.Query().Get("offset"))
		// if error != nil {
		// 	offset = 0
		// }
		// error = nil

		// toTalk, _ := models.UserRepo.GetUserByID(mess[0].UserOrGroupID)

		// if err == nil {
		// 	tabUsers = append(tabUsers, *toTalk)
		// }

		// limit := 20
		messages, _ = models.MessageRepo.GetMessagesBetweenUsers(user.UserID, mess[0].UserOrGroupID)
		if err != nil {
			log.Println("��� ~ funcHandleGetProfileGetMessagesBetweenUsers ~ err:", err)
			var apiError ApiError
			apiError.Error = "Not found messages"
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}
	} else {
		// offset, error := strconv.Atoi(r.URL.Query().Get("offset"))
		// if error != nil {
		// 	offset = 0
		// }
		// error = nil

		// limit := 20

		messages, err = models.GroupChatRepo.GetMessagesOfAGroup(mess[0].UserOrGroupID)
		if err != nil {
			log.Println("��� ~ func GetMessagesOfAGroup ~ err:", err)
			var apiError ApiError
			apiError.Error = "Not found messages"
			WriteJSON(w, http.StatusInternalServerError, apiError)
			return
		}
	}

	// Create a UserProfileResponse without the password field
	chatResponse := ChatResponse{
		NicknameRequester: UN,
		Avatar:            user.Avatar,
		AbleToTalk:        ableToTalk,
		MessagesPreview:   messagesPreview,
		Groups:            Groups,
		Messages:          messages,
		User:              tabUsers,
	}

	WriteJSON(w, http.StatusOK, chatResponse)
}

func HandleGetProfile(w http.ResponseWriter, r *http.Request) {
	session, ok := IsAuthenticated(r)
	var apiError ApiError
	if !ok {
		apiError.Error = "StatusUnauthorized"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	sessionToken := r.Header.Get("Authorization")
	sessions, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil {
		apiError.Error = "Go connect first !"
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
	currentUser, _ := strconv.Atoi(sessions.UserID)
	postOwned, err := models.PostRepo.GetUserOwnPosts(user.UserID, currentUser)
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
	lib.AddCorsGet(w, r)

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
