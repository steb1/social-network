package handler

// TODO CE CODE N'EST PAS BON (OFT IL EST BON MAIS C'EST MOSH)
// TODO JE VAIS CLEAN APRES PARDONEZZZZZZ

import (
	"encoding/json"
	"log"
	"net/http"
	"sort"
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
	session, _ := IsAuthenticated(r)

	log.Println("socket request")

	// Upgrade the HTTP server connection to the WebSocket protocol.
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error upgrading to WebSocket:", err)
		return
	}

	UserId, _ := strconv.Atoi(session.UserID)
	user, _ := models.UserRepo.GetUserByID(UserId)

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

	existingUser, isin := connections[UserId]

	if isin {
		existingUser.Conn = conn
		sendCurrentUsers(existingUser, UserId)
	} else {
		connections[UserId] = &userInfo
		notifyUserJoined()
		sendCurrentUsers(&userInfo, UserId)
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

				var messagepattern MessagePattern
				messagepattern.Sender = sender
				messagepattern.Receiver = receiver
				messagepattern.Text = text
				messagepattern.Time = time

				// TODO: Verifier si le receiver existe dans le BD

				// Validate and save message
				if !lib.IsBlank(messagepattern.Text) && !lib.IsBlank(messagepattern.Sender) && !lib.IsBlank(messagepattern.Receiver) {
					models.MessageRepo.CreateMessage(UserId, models.UserRepo.GetIDFromUsernameOrEmail(messagepattern.Receiver), messagepattern.Text, messagepattern.Time)
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
			case "getusersonline":
				for _, user := range connections {
					sendCurrentUsers(user, models.UserRepo.GetIDFromUsernameOrEmail(user.Nickname))
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

func notifyUserJoined() {
	for _, user := range connections {
		sendCurrentUsers(user, models.UserRepo.GetIDFromUsernameOrEmail(user.Nickname))
	}
}

func sendCurrentUsers(tosend *UserInfo, user_id int) {
	// var users []UserByConnection
	// usernames, err := controllers.GetUsersByLastTimeYouTalkedTo(user_id)
	// if err != nil {
	// 	fmt.Println("Error")
	// }
	// /**** ONLINE and OFFLINE ***/
	// for _, username := range usernames {
	// 	var user UserByConnection
	// 	user.Username = username
	// 	if _, found := connections[models.UserRepo.GetIDFromUsernameOrEmail(username)]; !found {
	// 		user.Connected = false
	// 	} else {
	// 		user.Connected = true
	// 	}
	// 	users = append(users, user)
	// }

	// err = EnvoyerMessage(tosend, "userPartitionConnection", users)
	// if err != nil {
	// 	fmt.Println(err)
	// 	return
	// }
}

func notifyUserLeft(ID int) {
	for _, user := range connections {
		sendCurrentUsers(user, models.UserRepo.GetIDFromUsernameOrEmail(user.Nickname))
	}
}

type ModelsPartitionUsersByConnection struct {
	Connecteds    []string
	NonConnecteds []string
}
type UserByConnection struct {
	Username  string
	Connected bool
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

func PartitionUsersByConnection(allUsers []string, connections map[int]*UserInfo) ([]string, []string) {
	nonConnectedUsers := make([]string, 0, len(allUsers))
	connectedUsers := make([]string, 0, len(allUsers))

	for _, user := range allUsers {
		if _, found := connections[models.UserRepo.GetIDFromUsernameOrEmail(user)]; !found {
			nonConnectedUsers = append(nonConnectedUsers, user)
		} else {
			connectedUsers = append(connectedUsers, user)
		}
	}

	sort.Strings(nonConnectedUsers)
	sort.Strings(connectedUsers)

	return nonConnectedUsers, connectedUsers
}
