package handler

// TODO CE CODE N'EST PAS BON (OFT IL EST BON MAIS C'EST MOSH)
// TODO JE VAIS CLEAN APRES PARDONEZZZZZZ

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"sync"

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
	Sender   string `json:"sender"`
	Receiver string `json:"receiver"`
	Text     string `json:"text"`
	Time     string `json:"time"`
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

			}
		}
	}()
}

func handleMessageForUser(message WebSocketMessage, userId int) {
	bodyMap, ok := message.Body.(map[string]interface{})
	if !ok {
		// log.Println("Type de corps non pris en charge pour 'messageforuser'")
		return
	}

	sender, _ := bodyMap["sender"].(string)
	receiver, _ := bodyMap["receiver"].(string)
	text, _ := bodyMap["text"].(string)
	time, _ := bodyMap["time"].(string)

	messagepattern := MessagePattern{
		Sender:   sender,
		Receiver: receiver,
		Text:     text,
		Time:     time,
	}

	var (
		userExists      bool
		groupExists     bool
		AllUsersOfGroup []models.User
	)

	if idGroup, err := strconv.Atoi(messagepattern.Receiver); err == nil {
		AllUsersOfGroup, err = models.MembershipRepo.GetAllUsersByGroupID(idGroup)
		groupExists = err == nil
	}

	if !groupExists {
		userExists, _ = models.UserRepo.UserExists(models.UserRepo.GetIDFromUsernameOrEmail(messagepattern.Receiver))
	}

	if groupExists {
		handleGroupMessage(messagepattern, userId, AllUsersOfGroup)
	}

	if userExists {
		handleUserMessage(messagepattern, userId)
	}
}

func handleGroupMessage(messagepattern MessagePattern, userId int, AllUsersOfGroup []models.User) {
	for _, user := range AllUsersOfGroup {
		if user.UserID != userId {
			sendMessageToUser(userId, messagepattern, user.UserID)
		}
	}
}

func handleUserMessage(messagepattern MessagePattern, userId int) {
	sendMessageToUser(userId, messagepattern, models.UserRepo.GetIDFromUsernameOrEmail(messagepattern.Receiver))
}

func sendMessageToUser(senderID int, messagepattern MessagePattern, receiverID int) {
	if !lib.IsBlank(messagepattern.Text) && !lib.IsBlank(messagepattern.Sender) && !lib.IsBlank(messagepattern.Receiver) {
		models.MessageRepo.CreateMessage(senderID, receiverID, messagepattern.Text)
	} else {
		// log.Println("Cannot send empty messages.")
		// SEND ERROR
		return
	}

	tosend, exists := connections[receiverID]
	if !exists {
		// log.Println("No connected user:", messagepattern.Receiver)
		// log.Println("Error: User not connected")
		// SEND ERROR
		return
	}

	// log.Println("Connected user:", messagepattern.Receiver, "message in progress")

	// Use EnvoyerMessage function directly
	if err := EnvoyerMessage(tosend, "messageforuser", messagepattern); err != nil {
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

	tosend, exists := connections[models.UserRepo.GetIDFromUsernameOrEmail(messagepattern.Receiver)]
	if !exists {
		return
	}

	if err := EnvoyerMessage(tosend, messageType, messagepattern); err != nil {
		log.Println("Error writing message", messageType, "to connection:", err)
	}
}
