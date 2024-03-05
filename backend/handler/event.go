package handler

import (
	"fmt"
	"net/http"
	"server/lib"
	"server/models"
	"strconv"
	"time"
)

func HandleCreateEvent(w http.ResponseWriter, r *http.Request) {
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

	// Access the form fields
	EventTitle := r.FormValue("EventTitle")
	groupID := r.FormValue("groupId")
	EventDate := r.FormValue("EventDate")
	DescriptionEvent := r.FormValue("DescriptionEvent")
	EventTime := r.FormValue("EventTime")

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

	existMember := models.MembershipRepo.CheckIfIsMember(userId, intGroupId)

	_, err = models.GroupRepo.IsOwner(intGroupId, userId)
	IsOwner := false
	if err == nil {
		IsOwner = true
	}

	_, err = models.EventRepo.GetEventbyTitle(EventTitle)

	if (existMember || IsOwner) && (err != nil) {
		var event models.Event
		dateString := EventDate + " " + EventTime
		layout := "2006-01-02 15:04"

		// Parse the date string into a time.Time object
		parsedTime, err := time.Parse(layout, dateString)
		formattedString := parsedTime.Format(layout)
		if err != nil {
			return
		}
		event.GroupID = intGroupId
		event.EventDate = formattedString
		event.Title = EventTitle
		event.Description = DescriptionEvent

		err = models.EventRepo.CreateEvent(&event)

		if err != nil {
			WriteJSON(w, http.StatusUnauthorized, apiError)
			return
		}

		response := make(map[string]interface{})

		response["ok"] = true

		lib.WriteJSONResponse(w, r, response)
	}

}

func HandleRegisterEvent(w http.ResponseWriter, r *http.Request) {
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

	eventID := r.FormValue("eventId")
	option := r.FormValue("option")
	intEventId, err := strconv.Atoi(fmt.Sprintf("%v", eventID))

	if err != nil {
		http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
		return
	}

	event, err := models.EventRepo.GetEvent(intEventId)

	if err != nil {
		http.Error(w, "Erreur group doesn't exist", http.StatusBadRequest)
		return
	}

	existMember := models.MembershipRepo.CheckIfIsMember(userId, event.GroupID)

	_, err = models.GroupRepo.IsOwner(event.GroupID, userId)

	IsOwner := false
	if err == nil {
		IsOwner = true
	}

	if IsOwner || existMember {
		if option == "going" {
			var Attendance models.Attendance

			Attendance.EventID = intEventId
			Attendance.UserID = userId
			Attendance.AttendanceOption = 0

			err = models.AttendanceRepo.CreateAttendance(&Attendance)

			if err != nil {
				WriteJSON(w, http.StatusUnauthorized, apiError)
				return
			}

			response := make(map[string]interface{})

			response["ok"] = true

			lib.WriteJSONResponse(w, r, response)
		} else {
			var Attendance models.Attendance

			Attendance.EventID = intEventId
			Attendance.UserID = userId
			Attendance.AttendanceOption = 2

			err = models.AttendanceRepo.CreateAttendance(&Attendance)

			if err != nil {
				WriteJSON(w, http.StatusUnauthorized, apiError)
				return
			}

			response := make(map[string]interface{})

			response["ok"] = true

			lib.WriteJSONResponse(w, r, response)
		}

	}

}
