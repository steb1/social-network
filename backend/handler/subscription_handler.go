package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"server/models"
	"strconv"
)

type FollowResponse struct {
	Type    string `json:"type"`
	Message string `json:"message"`
}

func addCorsHeader(res http.ResponseWriter) {
	headers := res.Header()
	headers.Add("Access-Control-Allow-Origin", "http://localhost:3000")
	headers.Add("Vary", "Origin")
	headers.Add("Vary", "Access-Control-Request-Method")
	headers.Add("Vary", "Access-Control-Request-Headers")
	headers.Add("Access-Control-Allow-Headers", "Content-Type, Origin, Accept, token, Authorization")
	headers.Add("Access-Control-Allow-Methods", "GET, POST,OPTIONS")
	headers.Add("Access-Control-Allow-Credentials", "true")
	headers.Add("Content-Type", "application/json")
}

func SubscriptionHandler(w http.ResponseWriter, r *http.Request) {
	addCorsHeader(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var apiError ApiError
	var followResponse FollowResponse
	sessionToken := r.Header.Get("Authorization")
	session, err := models.SessionRepo.GetSession(sessionToken)
	fmt.Println(sessionToken)
	if err != nil {
		fmt.Println(err.Error())
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	followerUserID, err := strconv.Atoi(session.UserID)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	var data map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, "Erreur de décodage JSON", http.StatusBadRequest)
		return
	}

	userId, exists := data["userId"]
	if !exists {
		apiError.Error = "Missing user id in data."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}
	id, ok := userId.(float64)

	followingUserId := int(id)

	if !ok {
		apiError.Error = "Invalid or missing user id destructure."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	ok, _ = models.UserRepo.UserExists(strconv.Itoa(followingUserId))
	if !ok {
		apiError.Error = "Invalid or missing user id bdd."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	ok, err = models.SubscriptionRepo.UserAlreadyFollow(followerUserID, followingUserId)
	if err != nil {
		apiError.Error = "An error occurred."
		WriteJSON(w, http.StatusOK, apiError)
		return
	}
	check, _ := models.FollowRequestRepo.HasPendingRequestFromAnUser(followerUserID, followingUserId)
	if check {
		models.FollowRequestRepo.DeleteFollowRequest(followerUserID, followingUserId)
		followResponse.Message = fmt.Sprintf("User id %d, unfollowed.", followingUserId)
		followResponse.Type = "Unfollow"
		fmt.Println(followResponse)
		WriteJSON(w, http.StatusOK, followResponse)
		return
	}
	if ok {
		err = models.SubscriptionRepo.DeleteSubscription(followerUserID, followingUserId)
		if err != nil {
			apiError.Error = "An error occurred"
			WriteJSON(w, http.StatusBadRequest, apiError)
			return
		}
		followResponse.Message = fmt.Sprintf("User id %d, unfollowed.", followingUserId)
		followResponse.Type = "Unfollow"
		fmt.Println(followResponse)
		WriteJSON(w, http.StatusOK, followResponse)
		return
	}

	// We check if the account Type is public and we bypass the Request mechanism
	accountType, err := models.UserRepo.GetAccountType(followingUserId)
	if err != nil {
		apiError.Error = "The ID may be incorrect"
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	if accountType == models.TypePublic {
		var subcription models.Subscription
		subcription.FollowerUserID = followerUserID
		subcription.FollowingUserID = followingUserId
		err = models.SubscriptionRepo.CreateSubscription(&subcription)
		if err != nil {
			// If we fail to create a subscription it will be because it won't respect constraint on the database, the user is
			// already following the user so we delete de subscription
			err = models.SubscriptionRepo.DeleteSubscription(subcription.FollowerUserID, subcription.FollowingUserID)
			if err != nil {
				followResponse.Message = fmt.Sprintf("User id %d, unfollowed.", followingUserId)
				followResponse.Type = "Unfollow"
				WriteJSON(w, http.StatusOK, followResponse)
				return
			}
			log.Printf("%s", err.Error())
			apiError.Error = "Error following user."
			WriteJSON(w, http.StatusBadRequest, apiError)
			return
		}
		followResponse.Message = fmt.Sprintf("User id %d well followed.", followingUserId)
		followResponse.Type = "Followed"
		fmt.Println(followResponse)
		WriteJSON(w, http.StatusOK, followResponse)
		return
	}
	// If the account is private
	var followResquest models.FollowRequest
	followResquest.FollowerUserID = followerUserID
	followResquest.FollowingUserID = followingUserId
	followResquest.Status = models.StatusPending

	err = models.FollowRequestRepo.CreateFollowRequest(&followResquest)
	if err != nil {
		fmt.Println("coucou")
		log.Printf("%s", err.Error())
		apiError.Error = "Error making following request to the user."
		WriteJSON(w, http.StatusBadRequest, apiError)
		return
	}

	followResponse.Message = "Following request well received."
	followResponse.Type = "Pending"
	fmt.Println(followResponse)
	WriteJSON(w, http.StatusOK, followResponse)
}
