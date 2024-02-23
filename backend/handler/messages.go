package handler

import (
	"fmt"
	"net/http"
	"server/models"
	"strconv"
)

func GetMessages(w http.ResponseWriter, r *http.Request) {

	addCorsHeader(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}
	var apiError ApiError
	if r.Method == http.MethodGet {
		cookie, errC := r.Cookie("social-network")
		session, errS := models.SessionRepo.GetSession(cookie.Value)
		if errS != nil || errC != nil {
			apiError.Error = "Go connect first !"
			WriteJSON(w, http.StatusUnauthorized, apiError)
			return
		}

		sessionUserID, _ := strconv.Atoi(session.UserID)
		username := r.URL.Query().Get("with")
		fmt.Println(username)
		userID := models.UserRepo.GetIDFromUsernameOrEmail(username)
		fmt.Println("User id:", userID)
		if userID <= 0 {
			var apiError ApiError
			apiError.Error = "The user you want to chat with doesn't exist..."
			WriteJSON(w, http.StatusBadRequest, apiError)
			return
		}

		offset, error := strconv.Atoi(r.URL.Query().Get("offset"))
		if error != nil {
			offset = 0
		}
		error = nil

		limit := 20

		if error != nil {
			var apiError ApiError
			apiError.Error = error.Error() + " Frooooom offline"
			WriteJSON(w, http.StatusBadRequest, apiError)
			return
		}

		messages, error := models.MessageRepo.GetMessagesBetweenUsers(sessionUserID, userID, offset, limit)
		for date, messages := range messages {
			fmt.Printf("[%s] => %v\n", date, messages)
		}
		if error != nil {
			var apiError ApiError
			apiError.Error = error.Error()
			WriteJSON(w, http.StatusBadRequest, apiError)
			return
		}

		WriteJSON(w, http.StatusOK, messages)
	}
}
