package handler

import (
	"fmt"
	"net/http"
	"server/models"
	"strconv"
	"strings"
)

func GetMessages(w http.ResponseWriter, r *http.Request) {

	addCorsHeader(w, r)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	var apiError ApiError
	if r.Method == http.MethodGet {
		sessionToken := r.Header.Get("Authorization")
		session, exists := models.SessionRepo.SessionExists(sessionToken)

		if !exists {
			apiError.Error = "Go connect first!"
			WriteJSON(w, http.StatusUnauthorized, apiError)
			return
		}
		sessionUserID, _ := strconv.Atoi(session.UserID)

		username := strings.Split(r.URL.String(), "/")[3]
		fmt.Println("c'est icoooo", username)

		userID := models.UserRepo.GetIDFromUsernameOrEmail(username)
		intUsername, _ := strconv.Atoi(username)
		var tabUser []models.User

		if userID <= 0 {
			fmt.Println("----------------------------------jjjjjj")
			messages, err := models.GroupChatRepo.GetMessagesOfAGroup(intUsername)

			if err != nil {
				var apiError ApiError
				fmt.Println("c'est ici")
				apiError.Error = "The user you want to chat with doesn't exist..."
				WriteJSON(w, http.StatusBadRequest, apiError)
			}

			AllUsersOfGroup, _ := models.MembershipRepo.GetAllUsersByGroupID(intUsername)
			group, _ := models.GroupRepo.GetGroup(intUsername)

			result := make(map[string]interface{})

			result["messages"] = messages
			result["user"] = AllUsersOfGroup
			result["group"] = group

			WriteJSON(w, http.StatusOK, result)
			return
		}

		// offset, error := strconv.Atoi(r.URL.Query().Get("offset"))
		// if error != nil {
		// 	offset = 0
		// }
		// error = nil

		// limit := 20

		// if error != nil {
		// 	var apiError ApiError
		// 	apiError.Error = error.Error() + " Frooooom offline"
		// 	WriteJSON(w, http.StatusBadRequest, apiError)
		// 	return
		// }

		messages, error := models.MessageRepo.GetMessagesBetweenUsers(sessionUserID, userID)
		result := make(map[string]interface{})

		ToSend, _ := models.UserRepo.GetUserByID(userID)
		tabUser = append(tabUser, *ToSend)
		result["messages"] = messages
		result["user"] = tabUser

		if error != nil {
			var apiError ApiError
			apiError.Error = error.Error()
			WriteJSON(w, http.StatusBadRequest, apiError)
			return
		}

		WriteJSON(w, http.StatusOK, result)
	}
}
