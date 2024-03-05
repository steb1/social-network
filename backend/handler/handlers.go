package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type Route struct {
	Path    string
	Handler http.HandlerFunc
	Methods []string
}

const (
	Port               = ":8080"
	sessionDuration    = 24 * time.Hour // 24 Heures
	MAX_TITLE_LENGTH   = 150
	MAX_CONTENT_LENGTH = 500
)

type ApiError struct {
	Error string `json:"error"`
}
type ApiSuccess struct {
	Message string `json:"message"`
}
type SignupResponse struct {
	Message string `json:"message"`
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

var Routes = []Route{
	{Path: "/api/signup", Handler: RegisterHandler, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/signin", Handler: SigninHandler, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/logout", Handler: Logout, Methods: []string{"GET"}},
	{Path: "/api/imgPost", Handler: ImageHandler, Methods: []string{"GET", "OPTIONS"}},
	{Path: "/api/imgComment", Handler: ImageHandlerComment, Methods: []string{"GET", "OPTIONS"}},
	{Path: "/api/getAllPosts", Handler: HandleGetAllPosts, Methods: []string{"GET", "OPTIONS"}},
	{Path: "/api/createComment", Handler: HandleCreateComment, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/createCommentGroup", Handler: HandleCreateCommentGroup, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/likePost", Handler: HandleLikePost, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/likePostGroup", Handler: HandleLikePostGroup, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/likeComment", Handler: HandleLikeComment, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/getFollowers", Handler: HandleGetFollowers, Methods: []string{"GET", "OPTIONS"}},
	{Path: "/api/checkAuth", Handler: CheckAutheHandler, Methods: []string{"GET", "OPTIONS", "POST"}},
	{Path: "/api/createPost", Handler: HandleCreatePost, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/profile", Handler: HandleGetProfile, Methods: []string{"GET", "OPTIONS"}},
	{Path: "/api/toggleProfilePrivacy", Handler: ToggleProfilePrivacy, Methods: []string{"POST", "GET", "OPTIONS"}},
	{Path: "/api/follow", Handler: SubscriptionHandler, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/pendingrequests", Handler: HandlePendingRequests, Methods: []string{"GET", "POST", "OPTIONS"}},
	{Path: "/api/socket", Handler: SocketHandler, Methods: []string{"GET", "POST", "OPTIONS"}},
	{Path: "/api/messages", Handler: GetMessages, Methods: []string{"GET", "OPTIONS"}},
	{Path: "/api/messageResponse", Handler: GetMessageResponse, Methods: []string{"GET", "POST", "OPTIONS"}},
	{Path: "/api/getAllGroups", Handler: HandleGetAllGroups, Methods: []string{"GET", "OPTIONS"}},
	{Path: "/api/getNotifications", Handler: HandleGetNotifications, Methods: []string{"GET", "POST", "OPTIONS"}},
	{Path: "/api/createMembership", Handler: HandleCreateMembership, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/getGroupDetail", Handler: HandleGetGroupDetail, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/createGroupPost", Handler: HandleCreateGroupPost, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/createGroup", Handler: HandleCreateGroup, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/createEvent", Handler: HandleCreateEvent, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/registerEvent", Handler: HandleRegisterEvent, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/inviteUser", Handler: HandleInviteUser, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/handleInvitation", Handler: HandleInviteUserResponse, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/updateNotif", Handler: HandleUpdateNotif, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/handleRequestGroup", Handler: HandleRequestGroup, Methods: []string{"POST", "OPTIONS"}},
	{Path: "/api/getRightBarCategories", Handler: HandleGetRightBarCategories, Methods: []string{"GET", "OPTIONS"}},
}

func MiddlewareIsAuthenticated(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		_, ok := IsAuthenticated(r)
		if !ok {
			WriteJSON(w, http.StatusUnauthorized, ApiError{Error: "Access denied."})
			return
		}
		handler(w, r)
	}
}

func MiddlewareError(path string, handler http.HandlerFunc, methods []string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Println(err)
				WriteJSON(w, http.StatusInternalServerError, err)
				return
			}
		}()

		allowed := false
		for _, method := range methods {
			if r.Method == method {
				allowed = true
				break
			}
		}

		if !allowed {
			err := ApiError{Error: "This method is not allowed in this endpoint."}
			WriteJSON(w, http.StatusMethodNotAllowed, err)
			return
		}

		handler(w, r)
	}
}
