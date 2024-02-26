package handler

import (
	"fmt"
	"net/http"
	"server/models"
	"strconv"
)

func HandleGetFollowers(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")
	fmt.Println("followoingin", origin)
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var apiError ApiError
	if r.Method == http.MethodOptions {
		WriteJSON(w, http.StatusOK, nil)
		return
	}
	// cookie, err := r.Cookie("social-network")
	sessionToken := r.Header.Get("Authorization")
	fmt.Println("token: ", sessionToken)
	session, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil {
		fmt.Println("err lalaaaa")
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	userId, errs := strconv.Atoi(session.UserID)
	followers, errc := models.SubscriptionRepo.GetFollowers(userId)
	if errs != nil || errc != nil {
		fmt.Println("err2folow")
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	WriteJSON(w, http.StatusOK, followers)
}
