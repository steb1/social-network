package handler

// TODO CE CODE N'EST PAS BON (OFT IL EST BON MAIS C'EST MOSH)
// TODO JE VAIS CLEAN APRES PARDONEZZZZZZ

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"
	"time"

	"server/lib"
	"server/models"

	"github.com/gorilla/websocket"
)

var (
	upgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
	connections = make(map[int]*UserInfo)
)

type UserInfo struct {
	Conn     *websocket.Conn
	IsAlive  bool
	Nickname string
}

type WebSocketMessage struct {
	Command string      `json:"command"`
	Body    interface{} `json:"body"`
}

type MessagePattern struct {
	Sender    string `json:"sender"`
	Receiver  string `json:"receiver"`
	Text      string `json:"content"`
	Time      string `json:"sent_time"`
	GroupId   int    `json:"groupId"`
	GroupName string `json:"group_name"`
	Avatar    string `json:"avatar"`
	EventName string
}

func SocketHandler(w http.ResponseWriter, r *http.Request) {
	session, ok := IsAuthenticatedGoCheck(r)
	if !ok {
		log.Println("No cookie for socket handler")
		return
	}

	// Upgrade the HTTP server connection to the WebSocket protocol.
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	// defer func() {
	// 	log.Println("WebSocket connection closed")
	// 	conn.Close()
	// }()

	userId, _ := strconv.Atoi(session.UserID)
	user, _ := models.UserRepo.GetUserByID(userId)

	nicknameOrEmail := user.Nickname
	if nicknameOrEmail == "" {
		nicknameOrEmail = user.Email
	}

	userInfo := UserInfo{
		Nickname: nicknameOrEmail,
		Conn:     conn,
		IsAlive:  true,
	}

	existingUser, isin := connections[userId]

	if isin {
		existingUser.Conn = conn
	} else {
		connections[userId] = &userInfo
	}

	log.Println(connections, len(connections))

	var wg sync.WaitGroup
	defer wg.Wait()

	// Handle WebSocket messages in a separate goroutine
	wg.Add(1)
	go func() {
		defer func() {
			log.Println("Goroutine is closed")
			wg.Done()
		}()
		for {
			_, p, err := conn.ReadMessage()
			if err != nil {
				// log.Println("Error reading message:", err)
				return
			}

			var message WebSocketMessage
			err = json.Unmarshal(p, &message)
			if err != nil {
				// log.Println("Error unmarshalling message:", err)
				continue
			}

			switch message.Command {
			case "messageforuser":
				handleMessageForUser(message, userId)

			case "typeinprogress", "nontypeinprogress":
				handleInProgressMessage(message.Command, message.Body)

			case "inviteUser":
				fmt.Println("Yaaa")
				handleSendInviteNotif(message.Command, message.Body, user)

			case "handleGroupRequest":
				handleSendGroupOwnerNotif(message.Command, message.Body, user)

			case "messagepreview":
				sendMessagePreview(userInfo, userId, "messagepreview")
			case "followPrivate":
				sendFollowPrivate(userInfo, userId, "followPrivate", message.Body)
			case "eventCreated":
				handleEventNotif(userInfo, userId, "eventCreated", message.Body)
			case "logout":
				connections[userId].Conn.Close()
				fmt.Println("connection is closed")
			}
		}
	}()
}

func handleEventNotif(userInfo UserInfo, userId int, command string, messageBody interface{}) {
	sender, _ := models.UserRepo.GetUserByID(userId)

	bodyMap, ok := messageBody.(map[string]interface{})
	if !ok {
		log.Println("Type de corps non pris en charge pour", ok)
		return
	}

	groupId := (bodyMap["groupId"])

	intGroupId, err := strconv.Atoi(fmt.Sprintf("%v", groupId))

	if err !=  nil {
		fmt.Println("------intGroupId-----", intGroupId)
	}

	eventid := (bodyMap["id"])
	intEventid, _ := strconv.Atoi(fmt.Sprintf("%v", eventid))

	AllUsersOfGroup, err := models.MembershipRepo.GetAllUsersByGroupID(intGroupId)

	if err != nil {
		return
	}

	fmt.Println("------intGroupId-----", intGroupId)

	group, _ := models.GroupRepo.GetGroup(intGroupId)
	var messagepattern MessagePattern
	messagepattern.Sender = sender.FirstName + " " + sender.LastName
	messagepattern.GroupName = group.Title

	fmt.Println("-----------intEventid----", intEventid)

	for _, user := range AllUsersOfGroup {
		if user.UserID != userId {
			tosend, exists := connections[user.UserID]

			if exists {
				if err := EnvoyerMessage(tosend, command, messagepattern); err != nil || !exists{
					log.Println("Error writing message", command, "to connection:", err)
				}
			}

			var notification models.Notification

			notification.CreatedAt = time.Now().String()
			notification.GroupID = sql.NullInt64{Int64: int64(intGroupId), Valid: true}

			notification.IsRead = false
			notification.SenderID = sender.UserID
			notification.UserID = user.UserID
			notification.NotificationType = command
			notification.EventID = sql.NullInt64{Int64: int64(intEventid), Valid: true}

			fmt.Println("-------", messagepattern.GroupId, "++++++++", intEventid)

			err := models.NotifRepo.CreateNotification(&notification)

			if err != nil {
				fmt.Println("Notification not created", err)
			}

		}
	}

}

func sendFollowPrivate(userInfo UserInfo, userId int, command string, messageBody interface{}) {
	sender, _ := models.UserRepo.GetUserByID(userId)

	bodyMap, ok := messageBody.(map[string]interface{})
	if !ok {
		log.Println("Type de corps non pris en charge pour", ok)
		return
	}

	result := (bodyMap["userId"])

	receiverId, _ := strconv.Atoi(fmt.Sprintf("%v", result))
	receiver, _ := models.UserRepo.GetUserByID(receiverId)

	var messagepattern MessagePattern
	messagepattern.Sender = sender.FirstName + " " + sender.LastName
	messagepattern.Receiver = receiver.FirstName + " " + receiver.LastName

	tosend, exists := connections[receiver.UserID]

	fmt.Println(len(connections), "len connections")

	if exists {
		if err := EnvoyerMessage(tosend, command, messagepattern); err != nil || !exists {
			log.Println("Error writing message", command, "to connection:", err)
		}
	}

	var notification models.Notification

	notification.CreatedAt = time.Now().String()
	notification.GroupID = sql.NullInt64{Int64: int64(messagepattern.GroupId), Valid: true}
	notification.IsRead = false
	notification.SenderID = sender.UserID
	notification.UserID = receiver.UserID
	notification.NotificationType = command

	err := models.NotifRepo.CreateNotification(&notification)

	if err != nil {
		fmt.Println("Notification not created", err)
	}

}
func sendMessagePreview(userInfo UserInfo, userId int, command string) {
	messagesPreviews, err := models.MessageRepo.GetMessagePreviewsForAnUser(userId)
	if err != nil {
		log.Println("No connected user:")
		log.Println("Error: User not connected")
	}

	err = EnvoyerMessage(&userInfo, command, messagesPreviews)
	if err != nil {
		log.Println(err.Error())
		log.Printf("Error sending Message preview")
	}
}

func handleMessageForUser(message WebSocketMessage, userId int) {
	bodyMap, ok := message.Body.(map[string]interface{})
	if !ok {
		// log.Println("Type de corps non pris en charge pour 'messageforuser'")
		return
	}

	log.Println(" 🚀 ~ Message ~ handleMessageForUser")

	sender, _ := bodyMap["sender"].(string)
	receiver, _ := bodyMap["receiver"].(string)
	text, _ := bodyMap["content"].(string)
	time, _ := bodyMap["sent_time"].(string)
	avatar, _ := bodyMap["avatar"].(string)
	messagepattern := MessagePattern{
		Sender:   sender,
		Receiver: receiver,
		Text:     text,
		Time:     time,
		Avatar:   avatar,
	}

	var (
		userExists      bool
		groupExists     bool
		AllUsersOfGroup []models.User
		idGroup         int
		err             error
	)

	if idGroup, err = strconv.Atoi(messagepattern.Receiver); err == nil {
		AllUsersOfGroup, err = models.MembershipRepo.GetAllUsersByGroupID(idGroup)
		groupExists = err == nil
	}

	if !groupExists {
		userExists, _ = models.UserRepo.UserExists(models.UserRepo.GetIDFromUsernameOrEmail(messagepattern.Receiver))
	}

	if groupExists {
		handleGroupMessage(messagepattern, userId, AllUsersOfGroup, idGroup)
	}

	fmt.Println("--------------UserId")

	if userExists {
		handleUserMessage(messagepattern, userId)
	}
}

func handleGroupMessage(messagepattern MessagePattern, userId int, AllUsersOfGroup []models.User, idGroup int) {
	log.Println(" 🚀 ~ Message ~ GROUP")
	if !lib.IsBlank(messagepattern.Text) && !lib.IsBlank(messagepattern.Sender) && !lib.IsBlank(messagepattern.Receiver) {
		models.GroupChatRepo.CreateGroupChat(userId, idGroup, messagepattern.Text)
	} else {
		// SEND ERROR
		log.Println("Groupchat wasnot created")
		return
	}
	for _, user := range AllUsersOfGroup {
		if user.UserID != userId {
			sendMessageToUser(userId, messagepattern, user.UserID, "group", idGroup)
		}
	}
}

func handleUserMessage(messagepattern MessagePattern, userId int) {
	log.Println(" 🚀 ~ Message ~ ONE USER")
	log.Println(" 🚀 ~ message pattern", models.UserRepo.GetIDFromUsernameOrEmail(messagepattern.Receiver))

	sendMessageToUser(userId, messagepattern, models.UserRepo.GetIDFromUsernameOrEmail(messagepattern.Receiver), "chat", 0)
}

func sendMessageToUser(senderID int, messagepattern MessagePattern, receiverID int, messagetype string, idGroup int) {
	Command := ""
	if messagetype == "chat" {
		if !lib.IsBlank(messagepattern.Text) && !lib.IsBlank(messagepattern.Sender) && !lib.IsBlank(messagepattern.Receiver) {
			models.MessageRepo.CreateMessage(senderID, receiverID, messagepattern.Text)
		} else {
			// SEND ERROR
			return
		}
		Command = "messageforuser"
	}

	if messagetype == "group" {
		Command = "messageforgroup"
	}

	tosend, exists := connections[receiverID]
	if !exists {
		log.Println("No connected user:", messagepattern.Receiver)
		log.Println("Error: User not connected")
		// SEND ERROR
		return
	}

	// Use EnvoyerMessage function directly
	if err := EnvoyerMessage(tosend, Command, messagepattern); err != nil {
		log.Println("Error writing message to connection:", err)
		// SEND ERROR
		// log.Println("Error: Unable to send message to user")
	}
}

func EnvoyerMessage(tosend *UserInfo, Command string, Body interface{}) error {
	message := WebSocketMessage{
		Command: Command,
		Body:    Body,
	}

	jsonMessage, err := json.Marshal(message)
	if err != nil {
		return err
	}

	err = tosend.Conn.WriteMessage(websocket.TextMessage, jsonMessage)
	return err
}

func handleInProgressMessage(messageType string, messageBody interface{}) {
	bodyMap, ok := messageBody.(map[string]interface{})
	if !ok {
		// log.Println("Type de corps non pris en charge pour", messageType)
		return
	}

	sender, _ := bodyMap["sender"].(string)
	receiver, _ := bodyMap["receiver"].(string)

	var messagepattern MessagePattern
	messagepattern.Sender = sender
	messagepattern.Receiver = receiver

	// TODO CHECK IF THE MESSAGE IS FROM A GROUP OR FROM A SIMPLE DISCUSSION
	tosend, exists := connections[models.UserRepo.GetIDFromUsernameOrEmail(messagepattern.Receiver)]

	if err := EnvoyerMessage(tosend, messageType, messagepattern); err != nil && exists {
		log.Println("Error writing message", messageType, "to connection:", err)
	}
}
func handleSendInviteNotif(messageType string, messageBody interface{}, user *models.User) {
	bodyMap, ok := messageBody.(map[string]interface{})
	if !ok {
		// log.Println("Type de corps non pris en charge pour", messageType)
		return
	}

	intInvitedId, _ := strconv.Atoi(fmt.Sprintf("%v", bodyMap["invitedId"]))

	invitedUser, err := models.UserRepo.GetUserByID(intInvitedId)

	if err != nil {
		fmt.Println("waaaouuw why tf bro")
		return
	} 

	var messagepattern MessagePattern
	messagepattern.Sender = user.FirstName + " " + user.LastName
	messagepattern.Receiver = invitedUser.FirstName + " " + invitedUser.LastName
	messagepattern.GroupId, _ = strconv.Atoi(fmt.Sprintf("%v", bodyMap["groupId"]))

	group, _ := models.GroupRepo.GetGroup(messagepattern.GroupId)
	messagepattern.GroupName = group.Title

	tosend, exists := connections[invitedUser.UserID]

	fmt.Println(len(connections), "len connections")


	if err := EnvoyerMessage(tosend, messageType, messagepattern); err != nil || !exists {
		log.Println("Error writing message", messageType, "to connection:", err)
	}

	var notification models.Notification

	notification.CreatedAt = time.Now().String()
	notification.GroupID = sql.NullInt64{Int64: int64(messagepattern.GroupId), Valid: true}
	notification.IsRead = false
	notification.SenderID = user.UserID
	notification.UserID = invitedUser.UserID
	notification.NotificationType = "inviteUser"

	err = models.NotifRepo.CreateNotification(&notification)
	fmt.Println("Yes yes yo")

	if err != nil {
		fmt.Println("Notification not created")
	}

}

func handleSendGroupOwnerNotif(messageType string, messageBody interface{}, user *models.User) {
	bodyMap, ok := messageBody.(map[string]interface{})
	if !ok {
		// log.Println("Type de corps non pris en charge pour", messageType)
		return
	}

	var messagepattern MessagePattern

	messagepattern.GroupId, _ = strconv.Atoi(fmt.Sprintf("%v", bodyMap["groupId"]))
	group, _ := models.GroupRepo.GetGroup(messagepattern.GroupId)

	receiver, _ := models.UserRepo.GetUserByID(group.CreatorID)

	messagepattern.Sender = user.FirstName + " " + user.LastName
	messagepattern.Receiver = receiver.FirstName + " " + receiver.LastName
	messagepattern.GroupName = group.Title

	tosend, exists := connections[receiver.UserID]

	
	if exists {
		if err := EnvoyerMessage(tosend, messageType, messagepattern); err != nil {
			log.Println("Error writing message", messageType, "to connection:", err)
			
		}
	}

	var notification models.Notification

	notification.CreatedAt = time.Now().String()
	notification.GroupID = sql.NullInt64{Int64: int64(messagepattern.GroupId), Valid: true}
	notification.IsRead = false
	notification.SenderID = user.UserID
	notification.UserID = receiver.UserID
	notification.NotificationType = "requestGroup"

	err := models.NotifRepo.CreateNotification(&notification)

	if err != nil {
		fmt.Println("Notification not created")
	}

}
