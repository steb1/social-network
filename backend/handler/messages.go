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

	if r.Method == http.MethodGet {
		sessionToken := r.Header.Get("Authorization")
		userSesion, ok := models.SessionRepo.SessionExists(sessionToken)
		if !ok {
			var apiError ApiError
			apiError.Error = "Unauthorized"
			WriteJSON(w, http.StatusUnauthorized, apiError)
			fmt.Println("no exist")
			return
		}
		sessionUserID, _ := strconv.Atoi(userSesion.UserID)
		username := r.URL.Query().Get("with")
		userID := models.UserRepo.GetIDFromUsernameOrEmail(username)
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

		limit := 10

		if error != nil {
			var apiError ApiError
			apiError.Error = error.Error() + " Frooooom offline"
			WriteJSON(w, http.StatusBadRequest, apiError)
			return
		}

		messages, error := models.MessageRepo.GetMessagesBetweenUsers(sessionUserID, userID, offset, limit)
		fmt.Println(messages)
		if error != nil {
			var apiError ApiError
			apiError.Error = error.Error()
			WriteJSON(w, http.StatusBadRequest, apiError)
			return
		}

		WriteJSON(w, http.StatusOK, messages)
	}
}
