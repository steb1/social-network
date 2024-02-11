package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"server/lib"
	"server/models"
	"strconv"
	"time"
)

func HandleOptions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.WriteHeader(http.StatusOK)
}

func HandleGetAllGroups(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		HandleOptions(w, r)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	_, ok := IsAuthenticated(r)
	var apiError ApiError
	sessionToken := r.Header.Get("Authorization")

	session, err := models.SessionRepo.GetSession(sessionToken)
	if err != nil {
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	userId, err := strconv.Atoi(session.UserID)
	fmt.Println(userId)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}
	groups := models.GroupRepo.GetAllGroup()

	if ok {
		lib.WriteJSONResponse(w, groups)
	}
}

func HandleCreateMembership(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		HandleOptions(w, r)
		return
	}
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, GET")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	_, ok := IsAuthenticated(r)

	var apiError ApiError
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

	var requestBody map[string]interface{}
	err = json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusBadRequest)
		return
	}

	fmt.Println(requestBody["groupid"], "-------- request body")

	v, ok_ := requestBody["groupid"]
	groupid, _ :=  strconv.Atoi(fmt.Sprintf("%v", v))
	if !ok_ {
		http.Error(w, "Paramètre groupid manquant ou invalide", http.StatusBadRequest)
		return
	}
	
	// Récupérer groupid
	exist := models.MembershipRepo.CheckIfMembershispExist( userId, groupid)
	fmt.Println("is here")
	if ok && !exist {
		var Membership models.Membership
		
		Membership.GroupID = groupid
		
		if err != nil {
			return
		}

		Membership.UserID = userId
		Membership.JoinedAt = time.Now().String()
		Membership.InvitationStatus = "request"
		Membership.MembershipStatus = "pending"

		err = models.MembershipRepo.CreateMembership(&Membership)

		if err != nil {
			fmt.Println("Membership non crée !")
		}
	}
}
