package handler

import (
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
	sessionCookieName  = "social_network_token"
	sessionDuration    = 3600 * time.Second // 60 minutes
	MAX_TITLE_LENGTH   = 150
	MAX_CONTENT_LENGTH = 500
)

var Routes = []Route{
	{Path: "/api/signup", Handler: SignupHandler, Methods: []string{"POST"}},
	{Path: "/api/signin", Handler: SigninHandler, Methods: []string{"POST"}},
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
