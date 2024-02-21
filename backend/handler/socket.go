package handler

// TODO CE CODE N'EST PAS BON (OFT IL EST BON MAIS C'EST MOSH)
// TODO JE VAIS CLEAN APRES PARDONEZZZZZZ

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

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

	log.Println("socket request")

	// Upgrade the HTTP server connection to the WebSocket protocol.
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}

	userId, _ := strconv.Atoi(session.UserID)
	user, _ := models.UserRepo.GetUserByID(userId)

	var nicknameOrEmail string
	if user.Nickname != "" {
		nicknameOrEmail = user.Nickname
	} else {
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

	// Handle WebSocket messages in a separate goroutine
	go func() {
		defer func() {
			log.Println("Goroutine is closed")
		}()
		for {
			_, p, err := conn.ReadMessage()
			if err != nil {
				log.Println("Error reading message:", err)
				return
			}

			var message WebSocketMessage
			err = json.Unmarshal(p, &message)
			if err != nil {
				log.Println("Error unmarshalling message:", err)
				continue
			}

			switch message.Command {
			case "messageforuser":
				log.Println("message recu de js")

				bodyMap, ok := message.Body.(map[string]interface{})
				if !ok {
					log.Println("Type de corps non pris en charge pour 'messageforuser'")
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

				log.Println(messagepattern, "message pattern")
				// TODO: Verifier si le receiver existe dans le BD

				// Validate and save message
				if !lib.IsBlank(messagepattern.Text) && !lib.IsBlank(messagepattern.Sender) && !lib.IsBlank(messagepattern.Receiver) {
					models.MessageRepo.CreateMessage(userId, models.UserRepo.GetIDFromUsernameOrEmail(messagepattern.Receiver), messagepattern.Text, messagepattern.Time)
				} else {
					log.Println("Cannot send empty messages.")
					// SEND ERROR
				}

				// Send the message to the specified user
				tosend, exists := connections[models.UserRepo.GetIDFromUsernameOrEmail(messagepattern.Receiver)]
				if !exists {
					log.Println("No connected user:", messagepattern.Receiver)
					log.Println("Error: User not connected")
					continue
					// SEND ERROR
				}

				log.Println("Connected user:", messagepattern.Receiver, "message in progress")

				// Use EnvoyerMessage function directly
				if err := EnvoyerMessage(tosend, "messageforuser", messagepattern); err != nil {
					log.Println("Error writing message to connection:", err)
					// SEND ERROR
					log.Println("Error: Unable to send message to user")
					continue
				}
			case "typeinprogress":
				// TODO C'ets repetitif les 2 lignes laa
				bodyMap, ok := message.Body.(map[string]interface{})
				if !ok {
					log.Println("Type de corps non pris en charge pour 'messageforuser'")
					return
				}

				sender, _ := bodyMap["sender"].(string)
				receiver, _ := bodyMap["receiver"].(string)
				var messagepattern MessagePattern
				messagepattern.Sender = sender
				messagepattern.Receiver = receiver

				tosend, exists := connections[models.UserRepo.GetIDFromUsernameOrEmail(receiver)]
				if !exists {
					continue
				}

				if err := EnvoyerMessage(tosend, "typeinprogress", messagepattern); err != nil {
					log.Println("Error writing message typeinprogress to connection:", err)
					continue
				}
			case "nontypeinprogress":
				bodyMap, ok := message.Body.(map[string]interface{})
				if !ok {
					log.Println("Type de corps non pris en charge pour 'messageforuser'")
					return
				}

				sender, _ := bodyMap["sender"].(string)
				receiver, _ := bodyMap["receiver"].(string)
				var messagepattern MessagePattern
				messagepattern.Sender = sender
				messagepattern.Receiver = receiver

				tosend, exists := connections[models.UserRepo.GetIDFromUsernameOrEmail(receiver)]
				if !exists {
					continue
				}

				if err := EnvoyerMessage(tosend, "nontypeinprogress", messagepattern); err != nil {
					log.Println("Error writing message nontypeinprogress to connection:", err)
					continue
				}

			}
		}
	}()
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
