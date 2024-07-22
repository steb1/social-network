package models

import (
	"database/sql"
	"fmt"
)

const (
	StatusPending  = "pending"
	StatusAccepted = "accepted"
	StatusRejected = "declined"
)

// FollowRequest structure represents the "subscriptions" table
type FollowRequest struct {
	FollowRequestID int    `json:"subscription_id"`
	FollowerUserID  int    `json:"follower_user_id"`
	FollowingUserID int    `json:"following_user_id"`
	Status          string `json:"status"`
}

type FollowRequestRepository struct {
	db *sql.DB
}

func NewFollowRequestRepository(db *sql.DB) *FollowRequestRepository {
	return &FollowRequestRepository{
		db: db,
	}
}

func (sr *FollowRequestRepository) CreateFollowRequest(followRequest *FollowRequest) error {
	query := `
		INSERT INTO follow_requests (follower_user_id, following_user_id, status)
		VALUES (?, ?, ?)
	`
	_, err := sr.db.Exec(query, followRequest.FollowerUserID, followRequest.FollowingUserID, followRequest.Status)
	if err != nil {
		return err
	}

	return nil
}

func (sr *FollowRequestRepository) UpdateFollowRequest(followRequest *FollowRequest) error {
	query := `
		UPDATE follow_requests
		SET follower_user_id = ?, following_user_id = ?
		WHERE follow_request_id = ?
	`
	_, err := sr.db.Exec(query, followRequest.FollowerUserID, followRequest.FollowingUserID, followRequest.FollowRequestID)
	if err != nil {
		return err
	}
	return nil
}

func (sr *FollowRequestRepository) DeleteFollowRequest(followerUserId, followingUserId int) error {
	query := "DELETE FROM follow_requests WHERE follower_user_id = ? AND following_user_id = ? "
	_, err := sr.db.Exec(query, followerUserId, followingUserId)
	if err != nil {
		return err
	}
	return nil
}

func (sr *FollowRequestRepository) HasPendingRequestFromAnUser(requesterUserId, userId int) (bool, error) {
	query := ` 
	SELECT COUNT(*)
			FROM follow_requests
			WHERE follower_user_id = ?
  			AND following_user_id = ?
  			AND status = 'pending';

	`
	var total int
	err := sr.db.QueryRow(query, requesterUserId, userId).Scan(&total)
	if err != nil {
		return false, err
	}
	if total == 0 {
		return false, nil
	}

	return true, nil
}

func (sr *FollowRequestRepository) AcceptFollowingRequest(followerUserID, followingUserId int) error {
	query := ` 
	UPDATE follow_requests
	SET status = ? 
	WHERE follower_user_id = ?
  			AND following_user_id = ?
	`
	// Set the status to Accepted and Create a new Subscription
	_, err := sr.db.Exec(query, StatusAccepted, followerUserID, followingUserId)

	if err != nil {
		return err
	}

	var subcription Subscription
	subcription.FollowerUserID = followerUserID
	subcription.FollowingUserID = followingUserId

	err = SubscriptionRepo.CreateSubscription(&subcription)
	if err != nil {
		return err
	}
	// Delete the follow Request because of the UNIQUE constraint on the Follow Request table
	err = sr.DeleteFollowRequest(followerUserID, followingUserId)
	if err != nil {
		return err
	}

	return nil
}

func (sr *FollowRequestRepository) RejectFollowingRequest(followerUserID, followingUserId int) error {
	query := ` 
	UPDATE follow_requests
	SET status = ? 
	WHERE follower_user_id = ?
  			AND following_user_id = ?
	`
	// Set the status to Accepted and Create a new Subscription
	_, err := sr.db.Exec(query, StatusRejected, followerUserID, followingUserId)

	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	// Delete the follow Request because of the UNIQUE constraint on the Follow Request table
	err = sr.DeleteFollowRequest(followerUserID, followingUserId)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}

	return nil
}
func (sr *FollowRequestRepository) GetFollowRequestersForAnUser(userId int) ([]*User, error) {
	query := "SELECT * FROM follow_requests WHERE following_user_id = ? AND status = 'pending'"

	rows, err := sr.db.Query(query, userId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var followRequesters []*User
	var followRequest FollowRequest
	for rows.Next() {
		err := rows.Scan(&followRequest.FollowRequestID, &followRequest.FollowerUserID, &followRequest.FollowingUserID, &followRequest.Status)
		if err != nil {
			return nil, err
		}
		user, err := UserRepo.GetUserByID(followRequest.FollowerUserID)
		if err != nil {
			return nil, err
		}
		followRequesters = append(followRequesters, user)
	}
	return followRequesters, nil
}
