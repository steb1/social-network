package models

import (
	"database/sql"
	"server/lib"
)

const (
	StatusFollow   = "Unfollow"
	StatusUnfollow = "Follow"
)

// Subscription structure represents the "subscriptions" table
type Subscription struct {
	SubscriptionID  int `json:"subscription_id"`
	FollowerUserID  int `json:"follower_user_id"`
	FollowingUserID int `json:"following_user_id"`
}

type SubscriptionRepository struct {
	db *sql.DB
}

func NewSubscriptionRepository(db *sql.DB) *SubscriptionRepository {
	return &SubscriptionRepository{
		db: db,
	}
}

// CreateSubscription adds a new subscription to the database
func (sr *SubscriptionRepository) CreateSubscription(subscription *Subscription) error {
	query := `
		INSERT INTO subscriptions (follower_user_id, following_user_id)
		VALUES (?, ?)
	`
	_, err := sr.db.Exec(query, subscription.FollowerUserID, subscription.FollowingUserID)
	if err != nil {
		return err
	}

	return nil
}

// GetSubscription retrieves a subscription from the database by subscription_id
func (sr *SubscriptionRepository) GetSubscription(subscriptionID int) (*Subscription, error) {
	query := "SELECT * FROM subscriptions WHERE subscription_id = ?"
	var subscription Subscription
	err := sr.db.QueryRow(query, subscriptionID).Scan(&subscription.SubscriptionID, &subscription.FollowerUserID, &subscription.FollowingUserID)
	if err != nil {
		return nil, err
	}
	return &subscription, nil
}

// UpdateSubscription updates an existing subscription in the database
func (sr *SubscriptionRepository) UpdateSubscription(subscription *Subscription) error {
	query := `
		UPDATE subscriptions
		SET follower_user_id = ?, following_user_id = ?
		WHERE subscription_id = ?
	`
	_, err := sr.db.Exec(query, subscription.FollowerUserID, subscription.FollowingUserID, subscription.SubscriptionID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteSubscription removes a subscription from the database by subscription_id
func (sr *SubscriptionRepository) DeleteSubscription(followeUserId, followingUserId int) error {
	query := "DELETE FROM subscriptions WHERE follower_user_id = ? AND following_user_id = ? "
	_, err := sr.db.Exec(query, followeUserId, followingUserId)
	if err != nil {
		return err
	}
	return nil
}

/*  GET ALL THE LAST MESSAGE
SELECT
    u.first_name,
	u.last_name,
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
        sender_id = 3
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
        receiver_id = 3
    GROUP BY
        sender_id
) received ON u.user_id = received.user_id
GROUP BY
    u.user_id,
    u.nickname
ORDER BY
    last_interaction_time DESC NULLS LAST,
    LOWER(u.nickname);*/

func (sr *SubscriptionRepository) GetAbleToTalk(userID int) ([]*User, error) {
	query := ` 
		SELECT u.user_id, u.email, u.first_name, u.last_name, u.date_of_birth, u.avatar, u.nickname, u.about_me
		FROM subscriptions s
		JOIN users u ON s.following_user_id = u.user_id
		WHERE s.follower_user_id = ?

		UNION

		SELECT u.user_id, u.email, u.first_name, u.last_name, u.date_of_birth, u.avatar, u.nickname, u.about_me
		FROM subscriptions s
		JOIN users u ON s.follower_user_id = u.user_id
		WHERE s.following_user_id = ?;
`
	rows, err := sr.db.Query(query, userID, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ableToTalk []*User

	for rows.Next() {
		var user User
		var nickname sql.NullString
		err := rows.Scan(&user.UserID, &user.Email, &user.FirstName, &user.LastName, &user.DateOfBirth, &user.Avatar, &nickname, &user.AboutMe)
		if err != nil {
			return nil, err
		}
		user.Nickname = lib.GetStringFromNullString(nickname)
		ableToTalk = append(ableToTalk, &user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return ableToTalk, nil
}

func (sr *SubscriptionRepository) GetFollowers(userId int) ([]*User, error) {
	query := ` 
        SELECT u.user_id, u.email, u.first_name, u.last_name, u.date_of_birth, u.avatar, u.nickname, u.about_me
        FROM subscriptions s
        JOIN users u ON s.follower_user_id = u.user_id
        WHERE s.following_user_id = ?;
    `
	rows, err := sr.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followers []*User

	for rows.Next() {
		var follower User
		var nickname sql.NullString
		err := rows.Scan(&follower.UserID, &follower.Email, &follower.FirstName, &follower.LastName, &follower.DateOfBirth, &follower.Avatar, &nickname, &follower.AboutMe)
		if err != nil {
			return nil, err
		}
		follower.Nickname = lib.GetStringFromNullString(nickname)
		followers = append(followers, &follower)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return followers, nil
}

func (sr *SubscriptionRepository) GetFollowersToInvite(userId, intGroupId int) ([]*User, error) {
	query := ` 
        SELECT u.user_id, u.email, u.first_name, u.last_name, u.date_of_birth, u.avatar, u.nickname, u.about_me
        FROM subscriptions s
        JOIN users u ON s.follower_user_id = u.user_id
        WHERE s.following_user_id = ?;
    `
	rows, err := sr.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followers []*User

	for rows.Next() {
		var follower User
		var nickname sql.NullString

		err := rows.Scan(&follower.UserID, &follower.Email, &follower.FirstName, &follower.LastName, &follower.DateOfBirth, &follower.Avatar, &nickname, &follower.AboutMe)
		if err != nil {
			return nil, err
		}
		follower.Nickname = lib.GetStringFromNullString(nickname)

		exist := MembershipRepo.CheckIfIsMember(follower.UserID, intGroupId)
		isSubscribed := MembershipRepo.CheckIfSubscribed(follower.UserID, intGroupId, "pending")

		_, err = GroupRepo.IsOwner(intGroupId, follower.UserID)

		IsOwner := false
		if err == nil {
			IsOwner = true
		}

		isInvited := InvitationRepo.IsInvited(follower.UserID, intGroupId)

		//fmt.Println("exist :", exist, " / IsOwner : ", IsOwner,  " / isSubscribed : ", isSubscribed," / IsInvited : ", isInvited, " / userId : ", userId)

		if !exist && !IsOwner && !isInvited && !isSubscribed {
			followers = append(followers, &follower)
		}

	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return followers, nil
}

func (sr *SubscriptionRepository) GetFollowing(userId int) ([]*User, error) {
	query := ` 
        SELECT u.user_id, u.email, u.first_name, u.last_name, u.date_of_birth, u.avatar, u.nickname, u.about_me
        FROM subscriptions s
        JOIN users u ON s.following_user_id = u.user_id
        WHERE s.follower_user_id = ?;
    `
	rows, err := sr.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var following []*User

	for rows.Next() {
		var followee User
		var nickname sql.NullString

		err := rows.Scan(&followee.UserID, &followee.Email, &followee.FirstName, &followee.LastName, &followee.DateOfBirth, &followee.Avatar, &nickname, &followee.AboutMe)
		if err != nil {
			return nil, err
		}
		followee.Nickname = lib.GetStringFromNullString(nickname)
		following = append(following, &followee)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return following, nil
}

func (sr *SubscriptionRepository) GetFollowingToInvite(userId, intGroupId int) ([]*User, error) {
	query := ` 
        SELECT u.user_id, u.email, u.first_name, u.last_name, u.date_of_birth, u.avatar, u.nickname, u.about_me
        FROM subscriptions s
        JOIN users u ON s.following_user_id = u.user_id
        WHERE s.follower_user_id = ?;
    `
	rows, err := sr.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var following []*User

	for rows.Next() {
		var followee User
		err := rows.Scan(&followee.UserID, &followee.Email, &followee.FirstName, &followee.LastName, &followee.DateOfBirth, &followee.Avatar, &followee.Nickname, &followee.AboutMe)
		if err != nil {
			return nil, err
		}

		exist := MembershipRepo.CheckIfIsMember(followee.UserID, intGroupId)
		isSubscribed := MembershipRepo.CheckIfSubscribed(followee.UserID, intGroupId, "pending")

		_, err = GroupRepo.IsOwner(intGroupId, followee.UserID)

		IsOwner := false
		if err == nil {
			IsOwner = true
		}
		isInvited := InvitationRepo.IsInvited(followee.UserID, intGroupId)

		if !exist && !IsOwner && !isInvited && !isSubscribed {
			following = append(following, &followee)
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return following, nil
}

func (sr *SubscriptionRepository) UserAlreadyFollow(followerUserId, followingUserId int) (bool, error) {
	query := "SELECT COUNT(*) as total FROM subscriptions WHERE follower_user_id = ? AND following_user_id = ?"
	var total int

	err := sr.db.QueryRow(query, followerUserId, followingUserId).Scan(&total)
	if err != nil {
		return false, err
	}
	if total == 0 {
		return false, nil
	}

	return true, nil
}

func (sr *SubscriptionRepository) GetFollowingStatus(requesterUserId, userId int) (string, error) {
	ok, _ := sr.UserAlreadyFollow(requesterUserId, userId)
	if ok {
		return StatusFollow, nil
	}
	ok, _ = FollowRequestRepo.HasPendingRequestFromAnUser(requesterUserId, userId)
	if ok {
		return StatusPending, nil
	}

	return StatusUnfollow, nil
}
