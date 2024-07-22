package models

import "database/sql"

// GroupChat structure represents the "group_chats" table
type GroupChat struct {
	GroupChatID int    `json:"group_chat_id"`
	SenderID    int    `json:"sender_id"`
	GroupID     int    `json:"group_id"`
	Content     string `json:"content"`
	SentTime    string `json:"sent_time"`
}

type GroupChatRepository struct {
	db *sql.DB
}

func NewGroupChatRepository(db *sql.DB) *GroupChatRepository {
	return &GroupChatRepository{
		db: db,
	}
}

// CreateGroupChat adds a new group chat message to the database
func (gcr *GroupChatRepository) CreateGroupChat(SenderID, GroupID int, Content string) error {
	query := `
		INSERT INTO group_chats (sender_id, group_id, content)
		VALUES (?, ?, ?)
	`
	result, err := gcr.db.Exec(query, SenderID, GroupID, Content)
	if err != nil {
		return err
	}

	_, err = result.LastInsertId()
	if err != nil {
		return err
	}

	// groupChat.GroupChatID = int(lastInsertID)
	return nil
}

// GetGroupChat retrieves a group chat message from the database by group_chat_id
func (gcr *GroupChatRepository) GetGroupChat(groupChatID int) (*GroupChat, error) {
	query := "SELECT * FROM group_chats WHERE group_chat_id = ?"
	var groupChat GroupChat
	err := gcr.db.QueryRow(query, groupChatID).Scan(&groupChat.GroupChatID, &groupChat.SenderID, &groupChat.GroupID, &groupChat.Content, &groupChat.SentTime)
	if err != nil {
		return nil, err
	}
	return &groupChat, nil
}

// UpdateGroupChat updates an existing group chat message in the database
func (gcr *GroupChatRepository) UpdateGroupChat(groupChat *GroupChat) error {
	query := `
		UPDATE group_chats
		SET sender_id = ?, group_id = ?, content = ?, sent_time = ?
		WHERE group_chat_id = ?
	`
	_, err := gcr.db.Exec(query, groupChat.SenderID, groupChat.GroupID, groupChat.Content, groupChat.SentTime, groupChat.GroupChatID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteGroupChat removes a group chat message from the database by group_chat_id
func (gcr *GroupChatRepository) DeleteGroupChat(groupChatID int) error {
	query := "DELETE FROM group_chats WHERE group_chat_id = ?"
	_, err := gcr.db.Exec(query, groupChatID)
	if err != nil {
		return err
	}
	return nil
}

func (repo *GroupChatRepository) GetMessagesOfAGroup(groupChatID int) (map[string][]MessageResponse, error) {
	messages := make(map[string][]MessageResponse)
	rows, err := repo.db.Query(`SELECT
		strftime('%Y-%m-%d', sent_time) as date,
		COALESCE(u.nickname, u.email) AS sender,
		gc.content,
		gc.sent_time,
		u.avatar
	FROM
    	group_chats gc
	JOIN
    	users u ON gc.sender_id = u.user_id
	WHERE
		gc.group_id = ?
	ORDER BY sent_time DESC ;`, groupChatID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var message MessageResponse
		var date string
		err := rows.Scan(&date, &message.Sender, &message.Content, &message.SentTime, &message.Avatar)
		if err != nil {
			return nil, err
		}
		messages[date] = append(messages[date], message)
	}
	for date, result := range messages {
		messages[date] = reverseMessages(result)
	}
	return messages, nil
}

func (repo *GroupChatRepository) GetMessagesByReceiverID(groupChatID int) ([]GroupChat, error) {
	rows, err := repo.db.Query("SELECT * FROM group_messages WHERE GroupID = ?", groupChatID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []GroupChat

	for rows.Next() {
		var groupChat GroupChat
		err := rows.Scan(groupChat.SenderID, groupChat.GroupID, groupChat.Content, groupChat.SentTime, groupChat.GroupChatID)
		if err != nil {
			return nil, err
		}
		messages = append(messages, groupChat)
	}

	return messages, nil
}
