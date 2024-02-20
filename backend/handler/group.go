package handler

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"server/lib"
	"server/models"
	"strconv"
	"strings"
	"time"
)

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
	subcribedGroups := models.GroupRepo.SubcribedGroups(userId)

	response := make(map[string]interface{})

	response["publicGroups"] = publicGroups
	response["ownGroups"] = ownGroups
	response["subcribedGroups"] = subcribedGroups

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
	Group   models.Group
	Posts   []models.PostItemGroup
	Events  []models.Event
	Members []models.User
	Message []models.GroupChat
	Request []models.User
	IsOwner bool
}

func HandleGetGroupDetail(w http.ResponseWriter, r *http.Request) {
	fmt.Println( " ---- exist")
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
	_, err = models.GroupRepo.IsOwner(intGroupId, userId)
	IsOwner := false
	if err == nil {
		IsOwner = true
	}
	if exist || err == nil {

		var GroupData GroupData

		GroupData.Group = *group

		events, _ := models.EventRepo.GetAllEventsByGroupID(intGroupId, userId)

		Members, _ := models.MembershipRepo.GetAllUsersByGroupID(intGroupId)

		Requests, _ := models.MembershipRepo.GetAllRequestByGroupID(intGroupId)

		Post, err := models.GroupPostRepo.GetAllPostsItems(intGroupId, userId)

		fmt.Println(err, " ------------ err")

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
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	var post models.GroupPost
	var apiError ApiError
	errs := r.ParseMultipartForm(10 << 20)
	if errs != nil {
		return
	}

	cookie, _ := r.Cookie("social-network")
	session, err := models.SessionRepo.GetSession(cookie.Value)
	if err != nil {
		apiError.Error = "Go connect first !"
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	///////////////

	post.Content = strings.TrimSpace(r.FormValue("body"))
	post.Title = "no title"
	// _categories := r.Form["category"]
	userId, err := strconv.Atoi(session.UserID)
	if err != nil {
		apiError.Error = "Error getting user."
		WriteJSON(w, http.StatusUnauthorized, apiError)
		return
	}

	//////////////

	post.AuthorID = userId

	photo, _, _ := r.FormFile("media_post")
	hasImage := map[bool]int{true: 1, false: 0}[photo != nil]
	post.HasImage = hasImage
	post.CreatedAt = time.Now()
	
	if post.Content == "" {
		return
	}

	groupID := r.FormValue("groupId")

	intGroupId, err := strconv.Atoi(fmt.Sprintf("%v", groupID))
	if err != nil {
		http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusBadRequest)
		return
	}

	post.GroupID = intGroupId

	_, err = models.GroupRepo.GetGroup(intGroupId)

	if err != nil {
		http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
		return
	}

	exist := models.MembershipRepo.CheckIfIsMember(userId, intGroupId)

	_, err = models.GroupRepo.IsOwner(intGroupId, userId)
	IsOwner := false
	if err == nil {
		IsOwner = true
	}

	if exist || IsOwner {
		postID_, err := models.GroupPostRepo.CreatePostInGroup(&post)
		if err != nil {
			WriteJSON(w, http.StatusUnauthorized, apiError)
			return
		}

		defer photo.Close()
		if err := os.MkdirAll("imgPost", os.ModePerm); err != nil {
			fmt.Println("Error creating imgPost directory:", err)
			return 
		}
		fichierSortie, err := os.Create(fmt.Sprintf("imgPost/%d.jpg", postID_))
		if err != nil {
			lib.HandleError(err, "Creating post image.")
		}
		defer fichierSortie.Close()
		_, err = io.Copy(fichierSortie, photo)
		if err != nil {
			fmt.Println("err", err)
			return 
		}

		response := make(map[string]interface{})

		response["ok"] = true

		lib.WriteJSONResponse(w, response)
	}
}
