package models

import "time"

// User structure represents the "users" table
type User struct {
	UserID      int       `json:"user_id"`
	Email       string    `json:"email"`
	Password    string    `json:"password"`
	FirstName   string    `json:"first_name"`
	LastName    string    `json:"last_name"`
	DateOfBirth time.Time `json:"date_of_birth"`
	Avatar      string    `json:"avatar"`
	Nickname    string    `json:"nickname"`
	AboutMe     string    `json:"about_me"`
}

// Group structure represents the "groups" table
type Group struct {
	GroupID     int    `json:"group_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	CreatorID   int    `json:"creator_id"`
}

// Membership structure represents the "memberships" table
type Membership struct {
	MembershipID     int       `json:"membership_id"`
	UserID           int       `json:"user_id"`
	GroupID          int       `json:"group_id"`
	JoinedAt         time.Time `json:"joined_at"`
	InvitationStatus string    `json:"invitation_status"`
	MembershipStatus string    `json:"membership_status"`
}

// Post structure represents the "posts" table
type Post struct {
	PostID     int       `json:"post_id"`
	Title      string    `json:"title"`
	Category   string    `json:"category"`
	Content    string    `json:"content"`
	CreatedAt  time.Time `json:"created_at"`
	AuthorID   int       `json:"author_id"`
	ImageURL   string    `json:"image_url"`
	Visibility string    `json:"visibility"`
}

// PostVisibility structure represents the "post_visibilities" table
type PostVisibility struct {
	PostVisibilityID int `json:"post_visibility_id"`
	PostID           int `json:"post_id"`
	UserIDAuthorized int `json:"user_id_authorized"`
}

// Subscription structure represents the "subscriptions" table
type Subscription struct {
	SubscriptionID  int `json:"subscription_id"`
	FollowerUserID  int `json:"follower_user_id"`
	FollowingUserID int `json:"following_user_id"`
}

// Event structure represents the "events" table
type Event struct {
	EventID     int       `json:"event_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	EventDate   time.Time `json:"event_date"`
	GroupID     int       `json:"group_id"`
}

// Attendance structure represents the "attendance" table
type Attendance struct {
	AttendanceID     int `json:"attendance_id"`
	UserID           int `json:"user_id"`
	EventID          int `json:"event_id"`
	AttendanceOption int `json:"attendance_option"`
}

// Comment structure represents the "comments" table
type Comment struct {
	CommentID int       `json:"comment_id"`
	Content   string    `json:"content"`
	AuthorID  int       `json:"author_id"`
	PostID    int       `json:"post_id"`
	CreatedAt time.Time `json:"created_at"`
}

// PostLike structure represents the "post_likes" table
type PostLike struct {
	PostLikeID int `json:"post_like_id"`
	AuthorID   int `json:"author_id"`
	PostID     int `json:"post_id"`
	Rate       int `json:"rate"`
}

// CommentLike structure represents the "comment_likes" table
type CommentLike struct {
	CommentLikeID int `json:"comment_like_id"`
	AuthorID      int `json:"author_id"`
	CommentID     int `json:"comment_id"`
	Rate          int `json:"rate"`
}

// Notification structure represents the "notifications" table
type Notification struct {
	NotificationID int       `json:"notification_id"`
	UserID         int       `json:"user_id"`
	Type           string    `json:"type"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
}

// Message structure represents the "messages" table
type Message struct {
	MessageID  int       `json:"message_id"`
	SenderID   int       `json:"sender_id"`
	ReceiverID int       `json:"receiver_id"`
	Content    string    `json:"content"`
	SentTime   time.Time `json:"sent_time"`
}

// GroupChat structure represents the "group_chats" table
type GroupChat struct {
	GroupChatID int       `json:"group_chat_id"`
	SenderID    int       `json:"sender_id"`
	GroupID     int       `json:"group_id"`
	Content     string    `json:"content"`
	SentTime    time.Time `json:"sent_time"`
}

// Session structure represents the "sessions" table
type Session struct {
	Token  string    `json:"token"`
	UserID int       `json:"user_id"`
	Expiry time.Time `json:"expiry"`
}
