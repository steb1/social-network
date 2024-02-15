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
	publicGroups := models.GroupRepo.GetAllPublicGroup(userId)
	ownGroups := models.GroupRepo.GetUserOwnGroups(userId)

	response := make(map[string]interface{})

	response["publicGroups"] = publicGroups
	response["ownGroups"] = ownGroups

	if ok {
		lib.WriteJSONResponse(w, response)
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

	fmt.Println("is hereee")

	var requestBody map[string]interface{}
	err = json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusBadRequest)
		return
	}

	v, ok_ := requestBody["groupid"]
	groupid, _ := strconv.Atoi(fmt.Sprintf("%v", v))
	if !ok_ {
		http.Error(w, "Paramètre groupid manquant ou invalide", http.StatusBadRequest)
		return
	}

	group, err := models.GroupRepo.GetGroup(groupid)

	if err != nil {
		http.Error(w, "group doesn't exist", 400)
		return
	}

	// Récupérer groupid
	exist := models.MembershipRepo.CheckIfMembershispExist(userId, groupid)
	if ok && !exist && userId != group.CreatorID {
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

func HandleCreateGroup(w http.ResponseWriter, r *http.Request) {
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

	var requestBody map[string]interface{}
	err = json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusBadRequest)
		return
	}

	name, ok_ := requestBody["name"]

	description, ok__ := requestBody["description"]

	if !ok_ || !ok__ {
		fmt.Println(ok_, "--------", ok__)
		return
	}


	exist := models.GroupRepo.CheckGroupExist(fmt.Sprintf("%v", name))
	fmt.Println(userId)

	if exist {
		var Newgroup models.Group
		Newgroup.Title = fmt.Sprintf("%v", name)
		Newgroup.Description = fmt.Sprintf("%v", description)
		Newgroup.CreatorID = userId

		err := models.GroupRepo.CreateGroup(&Newgroup)


		if err != nil {
			WriteJSON(w, http.StatusUnauthorized, apiError)
			fmt.Println("Group Not created")
		}
		w.WriteHeader(http.StatusOK)
	}
}

type GroupData struct {
	Group models.Group
	Posts []models.PostItemGroup
	Events []models.Event
	Members []models.User
	Message []models.GroupChat
	Request []models.User
	IsOwner bool
}

func HandleGetGroupDetail(w http.ResponseWriter, r *http.Request) {
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

	var requestBody map[string]interface{}
	err = json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusBadRequest)
		return
	}

	groupId, ok_ := requestBody["groupId"]

	if !ok_ {
		http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusBadRequest)
		return
	}
	intGroupId, err := strconv.Atoi(fmt.Sprintf("%v", groupId))
	if err != nil {
		http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusBadRequest)
		return
	}
	group, err := models.GroupRepo.GetGroup(intGroupId)

	if err != nil {
		http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
		return
	}

	exist := models.MembershipRepo.CheckIfIsMember(userId, group.GroupID)
	fmt.Println(exist)
	_ , err = models.GroupRepo.IsOwner(intGroupId, userId)
	 IsOwner := false
	if err == nil {
		IsOwner = true
	}
	if exist || err == nil {
		fmt.Println("eeeeeeeee")
		var GroupData GroupData

		GroupData.Group = *group

		events, _ := models.EventRepo.GetAllEventsByGroupID(intGroupId, userId)
		
		Members, _ := models.MembershipRepo.GetAllUsersByGroupID(intGroupId)	

		Requests, _ := models.MembershipRepo.GetAllRequestByGroupID(intGroupId)	

		Post, _ := models.GroupPostRepo.GetAllPostsItems(intGroupId, userId)

		Messages, _ := models.GroupChatRepo.GetMessagesByReceiverID(intGroupId)

		response := make(map[string]interface{})

		response["group"] = GroupData.Group
		response["events"] = events
		response["members"] = Members
		response["requests"] = Requests
		response["Post"] = Post
		response["Messages"] = Messages
		response["IsOwner"] = IsOwner
		
		lib.WriteJSONResponse(w, response)
	}
}

func HandleCreateGroupPost(w http.ResponseWriter, r *http.Request) {
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
	content := r.FormValue("content")
	groupID := r.FormValue("groupId")

	fmt.Println("Is hereee")

	

	intGroupId, err := strconv.Atoi(fmt.Sprintf("%v", groupID))
	if err != nil {
		http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusBadRequest)
		return
	}
	_, err = models.GroupRepo.GetGroup(intGroupId)

	if err != nil {
		http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
		return
	}

	exist := models.MembershipRepo.CheckIfIsMember(userId, intGroupId)
	fmt.Println(exist)
	
	_ , err = models.GroupRepo.IsOwner(intGroupId, userId)
	 IsOwner := false
	if err == nil {
		IsOwner = true
	}

	if exist || IsOwner {
		var PostGroup models.GroupPost

		PostGroup.Title = ""
		PostGroup.AuthorID = userId
		PostGroup.GroupID = intGroupId
		PostGroup.CreatedAt = time.Now()

		PostGroup.HasImage = 1
		PostGroup.ImageURL = ""

		// if !ok___ {
		// 	PostGroup.HasImage = 0
		// }
		PostGroup.ImageURL = lib.UploadImage(r)

		content := content

		PostGroup.Content = fmt.Sprintf("%v", content)
			
		err = models.GroupPostRepo.CreatePostInGroup(&PostGroup)
		 if err != nil  {
			fmt.Println(err)
			WriteJSON(w, http.StatusUnauthorized, apiError)
			return
		 }

		 response := make(map[string]interface{})

		 response["ok"] = true 

		 lib.WriteJSONResponse(w, response)
	}
}