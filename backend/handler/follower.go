package handler

import (
	"net/http"
	"server/models"
	"strconv"
)

func HandleGetFollowers(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var apiError ApiError
	cookie, _ := r.Cookie("social-network")
	session, err := models.SessionRepo.GetSession(cookie.Value)
	if err != nil {
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	userId, _ := strconv.Atoi(session.UserID)
	followers, _ := models.SubscriptionRepo.GetFollowers(userId)
	WriteJSON(w, http.StatusOK, followers)
}
