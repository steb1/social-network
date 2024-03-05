package handler

import (
	"net/http"
	"server/lib"
	"server/models"
	"strconv"
)

func HandleGetFollowers(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsGet(w, r)

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
