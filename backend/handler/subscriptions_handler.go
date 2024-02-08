package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"server/models"
	"strconv"
)

func SubscriptionHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var apiError ApiError
	var apiSuccess ApiSuccess
	sessionToken := r.Header.Get("Authorization")
	session, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil {
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
		apiSuccess.Message = "An error occurred."
		WriteJSON(w, http.StatusOK, apiSuccess)
		return
	}
	if ok {
		err = models.SubscriptionRepo.DeleteSubscription(followerUserID, followingUserId)
		if err != nil {
			apiError.Error = "An error occurred"
			WriteJSON(w, http.StatusBadRequest, apiSuccess)
			return
		}
		apiSuccess.Message = fmt.Sprintf("User id %d, unfollowed.", followingUserId)
		WriteJSON(w, http.StatusOK, apiSuccess)
		return
	}

	// We check if the account Type is public and we bypass the Request mechanism
	accountType, err := models.UserRepo.GetAccountType(followingUserId)
	if err != nil {
		apiError.Error = "The ID may be incorrect"
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
				apiSuccess.Message = fmt.Sprintf("User id %d, unfollowed.", followingUserId)
				WriteJSON(w, http.StatusOK, apiSuccess)
				return
			}
			log.Printf("%s", err.Error())
			apiError.Error = "Error following user."
			WriteJSON(w, http.StatusBadRequest, apiError)
			return
		}
		apiSuccess.Message = "User well followed."
		WriteJSON(w, http.StatusOK, apiSuccess)
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

	apiSuccess.Message = "Following request well received."
	WriteJSON(w, http.StatusOK, apiSuccess)
}
