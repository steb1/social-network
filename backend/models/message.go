package models

import "database/sql"

// Message structure represents the "messages" table
type Message struct {
	MessageID  int    `json:"message_id"`
	SenderID   int    `json:"sender_id"`
	ReceiverID int    `json:"receiver_id"`
	Content    string `json:"content"`
	SentTime   string `json:"sent_time"`
}

type MessageRepository struct {
	db *sql.DB
}

func NewMessageRepository(db *sql.DB) *MessageRepository {
	return &MessageRepository{
		db: db,
	}
}


// CreateMessage adds a new message to the database
func (mr *MessageRepository) CreateMessage(message *Message) error {
	query := `
		INSERT INTO messages (sender_id, receiver_id, content, sent_time)
		VALUES (?, ?, ?, ?)
	`
	result, err := mr.db.Exec(query, message.SenderID, message.ReceiverID, message.Content, message.SentTime)
	if err != nil {
		return err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	message.MessageID = int(lastInsertID)
	return nil
}

// GetMessage retrieves a message from the database by message_id
func (mr *MessageRepository) GetMessage(messageID int) (*Message, error) {
	query := "SELECT * FROM messages WHERE message_id = ?"
	var message Message
	err := mr.db.QueryRow(query, messageID).Scan(&message.MessageID, &message.SenderID, &message.ReceiverID, &message.Content, &message.SentTime)
	if err != nil {
		return nil, err
	}
	return &message, nil
}

// UpdateMessage updates an existing message in the database
func (mr *MessageRepository) UpdateMessage(message *Message) error {
	query := `
		UPDATE messages
		SET sender_id = ?, receiver_id = ?, content = ?, sent_time = ?
		WHERE message_id = ?
	`
	_, err := mr.db.Exec(query, message.SenderID, message.ReceiverID, message.Content, message.SentTime, message.MessageID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteMessage removes a message from the database by message_id
func (mr *MessageRepository) DeleteMessage(messageID int) error {
	query := "DELETE FROM messages WHERE message_id = ?"
	_, err := mr.db.Exec(query, messageID)
	if err != nil {
		return err
	}
	return nil
}