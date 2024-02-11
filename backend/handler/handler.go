package handler

import (
	"encoding/json"
	"net/http"
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
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
    w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, POST")
    w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
    w.Header().Set("Access-Control-Allow-Credentials", "true")
    w.WriteHeader(http.StatusOK)
	
	return json.NewEncoder(w).Encode(v)
}


