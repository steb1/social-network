package handler

import (
	"encoding/json"
	"fmt"
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
	fmt.Println(ok)
	fmt.Printf("%T", userId)
	followingUserId := int(id)
	fmt.Println(followingUserId)
	fmt.Println(ok)

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

	var subcription models.Subscription
	subcription.FollowerUserID = followerUserID
	subcription.FollowingUserID = followingUserId
	models.SubscriptionRepo.CreateSubscription(&subcription)

}
