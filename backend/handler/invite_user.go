package handler

import (
	"fmt"
	"net/http"
	"server/lib"
	"server/models"
	"strconv"
	"time"
)

func HandleInviteUser(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsPost(w, r)

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

	groupId := r.FormValue("groupId")
	invitedId := r.FormValue("invitedId")
	intGroupId, _ := strconv.Atoi(fmt.Sprintf("%v", groupId))
	intInvitedId, err := strconv.Atoi(fmt.Sprintf("%v", invitedId))

	if err != nil {
		http.Error(w, "Erreur provide a valid int doesn't exist", http.StatusBadRequest)
		return
	}

	hasRequested := models.MembershipRepo.CheckIfSubscribed(intInvitedId, intGroupId, "pending")

	if hasRequested {
		http.Error(w, "Erreur No requesttt ", http.StatusBadRequest)
		return
	}

	senderIsMember := models.MembershipRepo.CheckIfIsMember(userId, intGroupId)

	receiverIsMember := models.MembershipRepo.CheckIfIsMember(intInvitedId, intGroupId)
	if receiverIsMember {
		http.Error(w, "Erreur Not a member.", http.StatusBadRequest)
		return
	}

	fmt.Println("herereee")

	invitationExist := models.InvitationRepo.IsInvited(intInvitedId, intGroupId)

	if invitationExist {
		http.Error(w, "Erreur Not invited", http.StatusBadRequest)
		return
	}

	_, err = models.GroupRepo.IsOwner(intGroupId, userId)

	IsOwner := false
	if err == nil {
		IsOwner = true
	}

	if IsOwner || senderIsMember {
		var invitation models.Invitation

		invitation.GroupID = intGroupId
		invitation.ReceiverID = intInvitedId
		invitation.SenderID = userId
		invitation.SentTime = time.Now()

		err := models.InvitationRepo.CreateInvitation(&invitation)

		if err != nil {
			http.Error(w, "Erreur Creating Invitation", http.StatusBadRequest)
			return
		}

		Followers, _ := models.SubscriptionRepo.GetFollowersToInvite(userId, intGroupId)

		response := make(map[string]interface{})

		response["Followers"] = Followers

		lib.WriteJSONResponse(w, r, response)

	}

}

func HandleInviteUserResponse(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsPost(w, r)

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

	groupId := r.FormValue("groupId")
	option := r.FormValue("option")
	intGroupId, err := strconv.Atoi(fmt.Sprintf("%v", groupId))

	if err != nil {
		http.Error(w, "Give valid parameters fdp", http.StatusBadRequest)
		return
	}

	group, err := models.GroupRepo.GetGroup(intGroupId)

	if err != nil {
		http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
		return
	}

	hasRequested := models.MembershipRepo.CheckIfSubscribed(userId, intGroupId, "pending")

	if hasRequested {
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	_, err = models.GroupRepo.IsOwner(group.GroupID, userId)

	IsOwner := false
	if err == nil {
		IsOwner = true
	}
	if !IsOwner {
		if option == "accept" {
			var membership models.Membership

			membership.GroupID = group.GroupID
			membership.InvitationStatus = "invite"
			membership.JoinedAt = time.Now().String()
			membership.MembershipStatus = "accepted"
			membership.UserID = userId

			err = models.MembershipRepo.CreateMembership(&membership)

			if err != nil {
				WriteJSON(w, http.StatusUnauthorized, apiError)
				return
			}

			_ = models.InvitationRepo.DeleteInvitation(userId, intGroupId)

			response := make(map[string]interface{})

			response["ok"] = true

			lib.WriteJSONResponse(w, r,response)
		} else {
			err = models.InvitationRepo.DeleteInvitation(userId, intGroupId)

			if err != nil {
				WriteJSON(w, http.StatusUnauthorized, apiError)
				return
			}

			response := make(map[string]interface{})

			response["ok"] = true

			lib.WriteJSONResponse(w, r,response)
		}
	}
}
