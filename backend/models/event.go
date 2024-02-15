package models

import "database/sql"

// Event structure represents the "events" table
type Event struct {
	EventID     int    `json:"event_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	EventDate   string `json:"event_date"`
	GroupID     int    `json:"group_id"`
}

type EventItem struct {
	EventID     int    `json:"event_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	EventDate   string `json:"event_date"`
	GroupID     int    `json:"group_id"`
	Attendance  int 	`json:"attendance"`
	IsRegistered bool
	
}



type EventRepository struct {
	db *sql.DB
}

func NewEventRepository(db *sql.DB) *EventRepository {
	return &EventRepository{
		db: db,
	}
}

// CreateEvent adds a new event to the database
func (er *EventRepository) CreateEvent(event *Event) error {
	query := `
		INSERT INTO events (title, description, event_date, group_id)
		VALUES (?, ?, ?, ?)
	`
	result, err := er.db.Exec(query, event.Title, event.Description, event.EventDate, event.GroupID)
	if err != nil {
		return err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	event.EventID = int(lastInsertID)
	return nil
}

// GetEvent retrieves an event from the database by event_id
func (er *EventRepository) GetEvent(eventID int) (*Event, error) {
	query := "SELECT * FROM events WHERE event_id = ?"
	var event Event
	err := er.db.QueryRow(query, eventID).Scan(&event.EventID, &event.Title, &event.Description, &event.EventDate, &event.GroupID)
	if err != nil {
		return nil, err
	}
	return &event, nil
}
func (er *EventRepository) GetEventbyTitle(eventTitle string) (*Event, error) {
	query := "SELECT * FROM events WHERE event_id = ?"
	var event Event
	err := er.db.QueryRow(query, eventTitle).Scan(&event.EventID, &event.Title, &event.Description, &event.EventDate, &event.GroupID)
	if err != nil {
		return nil, err
	}
	return &event, nil
}

// UpdateEvent updates an existing event in the database
func (er *EventRepository) UpdateEvent(event *Event) error {
	query := `
		UPDATE events
		SET title = ?, description = ?, event_date = ?, group_id = ?
		WHERE event_id = ?
	`
	_, err := er.db.Exec(query, event.Title, event.Description, event.EventDate, event.GroupID, event.EventID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteEvent removes an event from the database by event_id
func (er *EventRepository) DeleteEvent(eventID int) error {
	query := "DELETE FROM events WHERE event_id = ?"
	_, err := er.db.Exec(query, eventID)
	if err != nil {
		return err
	}
	return nil
}

// GetAllEventsByGroupID retrieves all events for a specific group from the database
func (er *EventRepository) GetAllEventsByGroupID(groupID int) ([]Event, error) {
	query := `
		SELECT event_id, title, description, event_date, group_id
		FROM events
		WHERE group_id = ? ORDER BY event_id DESC
	`

	rows, err := er.db.Query(query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []Event
	for rows.Next() {
		var event Event
		err := rows.Scan(&event.EventID, &event.Title, &event.Description, &event.EventDate, &event.GroupID)
		if err != nil {
			return nil, err
		}
		events = append(events, event)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return events, nil
}





