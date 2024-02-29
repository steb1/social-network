package models

import (
	"database/sql"
	"fmt"
	"log"
)

// Message structure represents the "messages" table
type Message struct {
	MessageID  int    `json:"message_id"`
	SenderID   int    `json:"sender_id"`
	ReceiverID int    `json:"receiver_id"`
	Content    string `json:"content"`
	SentTime   string `json:"sent_time"`
}

// TODO: REMOVE RECEIVER I'M NOT SURE WE'RE USING THIS
type MessageResponse struct {
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Content  string `json:"content"`
	SentTime string `json:"sent_time"`
	Avatar   string `json:"avatar"`
}

type MessagePreview struct {
	UserID              int    `json:"user_id"`
	FirstName           string `json:"firstname"`
	LastName            string `json:"lastname"`
	Avatar              string `json:"avatar"`
	Nickname            string `json:"nickname"`
	Email               string `json:"email"`
	LastInteractionTime string `json:"lastInteractionTime"`
	LastMessage         string `json:"lastMessage"`
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
func (mr *MessageRepository) CreateMessage(SenderID, ReceiverID int, Content string) error {
	query := `
		INSERT INTO messages (sender_id, receiver_id, content)
		VALUES (?, ?, ?)
	`
	result, err := mr.db.Exec(query, SenderID, ReceiverID, Content)
	if err != nil {
		log.Println("🚀 ~ funcCreateMessage ~ err:", err)
		return err
	}

	_, _ = result.RowsAffected()

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

func (mr *MessageRepository) GetMessagePreviewsForAnUser(userID int) ([]*MessagePreview, error) {
	query := `
	SELECT
    u.user_id,
    u.first_name,
    u.last_name,
	u.avatar,
	u.nickname,
	u.email,
    MAX(COALESCE(sent.sent_time, received.sent_time)) AS last_interaction_time,
    COALESCE(sent.content, received.content) AS last_message_content
	FROM
		users u
	LEFT JOIN (
		SELECT
			receiver_id AS user_id,
			MAX(sent_time) AS sent_time,
			FIRST_VALUE(content) OVER (PARTITION BY receiver_id ORDER BY sent_time DESC) AS content
		FROM
			messages
		WHERE
			sender_id = ?
		GROUP BY
			receiver_id
	) sent ON u.user_id = sent.user_id
	LEFT JOIN (
		SELECT
			sender_id AS user_id,
			MAX(sent_time) AS sent_time,
			FIRST_VALUE(content) OVER (PARTITION BY sender_id ORDER BY sent_time DESC) AS content
		FROM
			messages
		WHERE
			receiver_id = ?
		GROUP BY
			sender_id
	) received ON u.user_id = received.user_id
	JOIN subscriptions s ON (s.follower_user_id = u.user_id AND s.following_user_id = ?) OR (s.following_user_id = u.user_id AND s.follower_user_id = ?)
	GROUP BY
		u.user_id,
		u.first_name,
		u.last_name
	ORDER BY
		last_interaction_time DESC NULLS LAST,
		LOWER(u.first_name),
		LOWER(u.last_name);

	`
	rows, err := db.Query(query, userID, userID, userID, userID)
	if err != nil {
		return nil, err
	}
	var messages []*MessagePreview
	for rows.Next() {
		var message MessagePreview
		var lastInteraction sql.NullString
		var lastmessage sql.NullString
		var nickname sql.NullString
		if err := rows.Scan(&message.UserID, &message.FirstName, &message.LastName, &message.Avatar, &nickname, &message.Email, &lastInteraction, &lastmessage); err != nil {
			return nil, err
		}
		message.LastInteractionTime = lastInteraction.String
		message.LastMessage = lastmessage.String
		message.Nickname = nickname.String
		messages = append(messages, &message)
	}

	return messages, nil
}

func (mr *MessageRepository) GetMessagesBetweenUsers(idUser1, idUser2, offset, limit int) (map[string][]MessageResponse, error) {
	result := make(map[string][]MessageResponse)

	rows, err := db.Query(`SELECT  strftime('%Y-%m-%d', sent_time) as date, content, sent_time, COALESCE(sender.nickname, sender.email) AS sender, COALESCE(receiver.nickname, receiver.email) as receiver
							FROM messages m
							JOIN 
								users sender ON m.sender_id = sender.user_id
							JOIN 
								users receiver ON m.receiver_id = receiver.user_id
							 WHERE (sender_id = ? AND receiver_id = ?)
								OR (sender_id = ? AND receiver_id = ?)
							ORDER BY sent_time DESC 
							LIMIT ?  OFFSET ? `, idUser1, idUser2, idUser2, idUser1, limit, offset)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var message MessageResponse
		var date string
		err := rows.Scan(&date, &message.Content, &message.SentTime, &message.Sender, &message.Receiver)

		if err != nil {
			fmt.Println(err.Error())
			return nil, err
		}

		result[date] = append(result[date], message)
	}

	for date, messages := range result {
		result[date] = reverseMessages(messages)
	}
	return result, nil
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

func reverseMessages(messages []MessageResponse) []MessageResponse {
	reversedMessages := make([]MessageResponse, len(messages))
	for i, j := 0, len(messages)-1; i < len(messages); i, j = i+1, j-1 {
		reversedMessages[i] = messages[j]
	}
	return reversedMessages
}
