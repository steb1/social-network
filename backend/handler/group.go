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
	lib.AddCorsGet(w, r)

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
	publicGroups := models.GroupRepo.GetAllPublicGroup(userId)
	ownGroups := models.GroupRepo.GetUserOwnGroups(userId)
	subcribedGroups := models.GroupRepo.SubcribedGroups(userId)
	InvitedGroups, _ := models.GroupRepo.GetAllInvitedGroup(userId)

	response := make(map[string]interface{})

	response["publicGroups"] = publicGroups
	response["ownGroups"] = ownGroups
	response["subcribedGroups"] = subcribedGroups
	response["InvitedGroups"] = InvitedGroups

	if ok {
		lib.WriteJSONResponse(w, r, response)
	}
}

func HandleCreateMembership(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsPost(w, r)

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

	isInvited := models.InvitationRepo.IsInvited(userId, groupid)

	fmt.Println("isInvited", isInvited)

	if isInvited {
		http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
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
			apiError.Error = "Membership non crée !"
			WriteJSON(w, http.StatusBadRequest, apiError)
		}
	}
}

func HandleCreateGroup(w http.ResponseWriter, r *http.Request) {
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

	var requestBody map[string]interface{}
	err = json.NewDecoder(r.Body).Decode(&requestBody)
	if err != nil {
		http.Error(w, "Erreur lors de la lecture du corps de la requête", http.StatusBadRequest)
		return
	}

	name, ok_ := requestBody["name"]

	description, ok__ := requestBody["description"]

	if !ok_ || !ok__ {
		return
	}

	exist := models.GroupRepo.CheckGroupExist(fmt.Sprintf("%v", name))

	if exist {
		var Newgroup models.Group
		Newgroup.Title = fmt.Sprintf("%v", name)
		Newgroup.Description = fmt.Sprintf("%v", description)
		Newgroup.CreatorID = userId

		err, id := models.GroupRepo.CreateGroup(&Newgroup)

		if err != nil {
			WriteJSON(w, http.StatusUnauthorized, apiError)
		}

		var Membership models.Membership

		Membership.GroupID = id

		if err != nil {
			return
		}

		Membership.UserID = userId
		Membership.JoinedAt = time.Now().String()
		Membership.InvitationStatus = "owner"
		Membership.MembershipStatus = "accepted"

		err = models.MembershipRepo.CreateMembership(&Membership)

		if err != nil {
			return
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
	lib.AddCorsGet(w, r)

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

		Post, _ := models.GroupPostRepo.GetAllPostsItems(intGroupId, userId)

		Messages, _ := models.GroupChatRepo.GetMessagesByReceiverID(intGroupId)

		Followers, _ := models.SubscriptionRepo.GetFollowersToInvite(userId, intGroupId)
		//Following, _ := models.SubscriptionRepo.GetFollowingToInvite(userId, intGroupId)

		//fmt.Println("followers : ", Followers , " following : ", Following)

		//Followers = append(Followers, Following...)

		response := make(map[string]interface{})

		response["group"] = GroupData.Group
		response["events"] = events
		response["members"] = Members
		response["requests"] = Requests
		response["Post"] = Post
		response["Messages"] = Messages
		response["IsOwner"] = IsOwner
		response["Invites"] = Followers

		lib.WriteJSONResponse(w, r, response)
	}
}

func HandleCreateGroupPost(w http.ResponseWriter, r *http.Request) {
	lib.AddCorsPost(w, r)

	var post models.GroupPost
	var apiError ApiError
	errs := r.ParseMultipartForm(10 << 20)
	if errs != nil {
		return
	}

	sessionToken := r.Header.Get("Authorization")
	session, err := models.SessionRepo.GetSession(sessionToken)
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
			return
		}

		if hasImage == 1 {
			defer photo.Close()
			if err := os.MkdirAll("imgPost", os.ModePerm); err != nil {
			}
			fichierSortie, _ := os.Create(fmt.Sprintf("imgPost/G%d.jpg", postID_))

			defer fichierSortie.Close()
			_, _ = io.Copy(fichierSortie, photo)
		}
		WriteJSON(w, http.StatusOK, "")
	}
}
