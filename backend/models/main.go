package models

import (
	"database/sql"
	"log"
	"os"

	"server/lib"
)

var (
	db                   *sql.DB
	AttendanceRepo       *AttendanceRepository
	UserRepo             *UserRepository
	PostRepo             *PostRepository
	PostCategoryRepo     *PostCategorieRepository
	CommentRepo          *CommentRepository
	CategoryRepo         *CategoryRepository
	NotifRepo            *NotificationRepository
	MessageRepo          *MessageRepository
	Comment_likeRepo     *CommentLikeRepository
	EventRepo            *EventRepository
	GroupChatRepo        *GroupChatRepository
	GroupRepo            *GroupRepository
	MembershipRepo       *MembershipRepository
	PostLikeRepo         *PostLikeRepository
	PostVisibilityRepo   *PostVisibilityRepository
	SessionRepo          *SessionRepository
	SubscriptionRepo     *SubscriptionRepository
	FollowRequestRepo    *FollowRequestRepository
	GroupPostRepo        *GroupPostRepository
	CommentGroupRepo     *CommentGroupRepository
	CommentGroupLikeRepo *CommentGroupLikeRepository
	PostGroupLikeRepo    *PostGroupLikeRepository
	InvitationRepo       *InvitationRepository
)

func init() {
	lib.LoadEnv(".env")
	d, err := sql.Open("sqlite3", os.Getenv("DATABASE"))
	if err != nil {
		log.Fatal("❌ Couldn't open the database")
	}
	db = d

	if err = db.Ping(); err != nil {
		log.Fatal("❌ Connection to the database is dead")
	}

	query, err := os.ReadFile("./pkg/db/migrations/sqlite/000001_create_initial_schema.up.sql")
	if err != nil {
		log.Fatal("couldn't read setup.sql")
	}
	if _, err = db.Exec(string(query)); err != nil {
		log.Fatal("database setup wasn't successful", err)
	}

	UserRepo = NewUserRepository(db)
	NotifRepo = NewNotificationRepository(db)
	PostRepo = NewPostRepository(db)
	CommentRepo = NewCommentRepository(db)
	CategoryRepo = NewCategoryRepository(db)
	PostCategoryRepo = NewPostCategorieRepository(db)
	AttendanceRepo = NewAttendanceRepository(db)
	Comment_likeRepo = NewCommentLikeRepository(db)
	EventRepo = NewEventRepository(db)
	GroupChatRepo = NewGroupChatRepository(db)
	GroupRepo = NewGroupRepository(db)
	MembershipRepo = NewMembershipRepository(db)
	MessageRepo = NewMessageRepository(db)
	PostLikeRepo = NewPostLikeRepository(db)
	PostVisibilityRepo = NewPostVisibilityRepository(db)
	SessionRepo = NewSessionRepository(db)
	SubscriptionRepo = NewSubscriptionRepository(db)
	FollowRequestRepo = NewFollowRequestRepository(db)
	GroupPostRepo = NewGroupPostRepository(db)
	CommentGroupRepo = NewCommentGroupRepository(db)
	CommentGroupLikeRepo = NewCommentGroupLikeRepository(db)
	PostGroupLikeRepo = NewPostGroupLikeRepository(db)
	InvitationRepo = NewInvitationRepository(db)

	log.Println("✅ Database init with success")
}
