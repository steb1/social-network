package handler

import (
	"fmt"
	"net/http"
	"server/lib"
	"server/models"
	"strconv"
	"time"
)

func HandleRequestGroup(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsPost(w,r)

	_, ok := IsAuthenticated(r)

	var apiError ApiError

	if !ok {
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	sessionToken := r.Header.Get("Authorization")
	session, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil {
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	userId, err := strconv.Atoi(session.UserID)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	// Access the form fields
	requesterId := r.FormValue("requesterId")
	groupID := r.FormValue("groupId")
	option := r.FormValue("option")

	intGroupId, err := strconv.Atoi(fmt.Sprintf("%v", groupID))
	if err != nil {
		http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusBadRequest)
		return
	}
	intrequesterId, err := strconv.Atoi(fmt.Sprintf("%v", requesterId))
	if err != nil {
		http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusBadRequest)
		return
	}

	_, err = models.GroupRepo.GetGroup(intGroupId)

	if err != nil {
		http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
		return
	}

	requestExist := models.MembershipRepo.CheckIfIsMember(intrequesterId, intGroupId)

	if requestExist {
		http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
		return
	}

	_, err = models.GroupRepo.IsOwner(intGroupId, userId)

	if err != nil {
		http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
		return
	}

	hasRequested := models.MembershipRepo.CheckIfSubscribed(intrequesterId, intGroupId, "pending")

	// isInvited := models.InvitationRepo.IsInvited(userId, intGroupId)

	// fmt.Println("isInvited", isInvited)

	// if isInvited {
	// 	http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
	// 	return
	// }

	membership, err := models.MembershipRepo.GetMembershipbyGroupAndUserId(intGroupId, intrequesterId)

	if err != nil {
		http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
		return
	}

	if hasRequested {
		if option == "accept" {

			err := models.MembershipRepo.DeleteMembership(membership.MembershipID)

			if err != nil {
				WriteJSON(w, http.StatusUnauthorized, apiError)
				return
			}

			var MembershipToCreate models.Membership

			MembershipToCreate.GroupID = intGroupId
			MembershipToCreate.InvitationStatus = "request"
			MembershipToCreate.MembershipStatus = "accepted"
			MembershipToCreate.UserID = intrequesterId
			MembershipToCreate.JoinedAt = time.Now().String()

			err = models.MembershipRepo.CreateMembership(&MembershipToCreate)

			if err != nil {
				WriteJSON(w, http.StatusUnauthorized, apiError)
				return
			}

			response := make(map[string]interface{})

			response["ok"] = true

			lib.WriteJSONResponse(w, r, response)

			return

		}

		if option == "reject" {
			err := models.MembershipRepo.DeleteMembership(membership.MembershipID)

			if err != nil {
				http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
				return
			}

			response := make(map[string]interface{})

			response["ok"] = true

			lib.WriteJSONResponse(w, r, response)

			return
		}

	}
}
