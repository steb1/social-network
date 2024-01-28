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
		INSERT INTO event (title, description, event_date, group_id)
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
	query := "SELECT * FROM event WHERE event_id = ?"
	var event Event
	err := er.db.QueryRow(query, eventID).Scan(&event.EventID, &event.Title, &event.Description, &event.EventDate, &event.GroupID)
	if err != nil {
		return nil, err
	}
	return &event, nil
}

// UpdateEvent updates an existing event in the database
func (er *EventRepository) UpdateEvent(event *Event) error {
	query := `
		UPDATE event
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
	query := "DELETE FROM event WHERE event_id = ?"
	_, err := er.db.Exec(query, eventID)
	if err != nil {
		return err
	}
	return nil
}




