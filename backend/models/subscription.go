package models

import "database/sql"

// Subscription structure represents the "subscriptions" table
type Subscription struct {
	SubscriptionID  int `json:"subscription_id"`
	FollowerUserID  int `json:"follower_user_id"`
	FollowingUserID int `json:"following_user_id"`
}

type SubscriptionRepository struct {
	db *sql.DB
}

func NewSubscriptionRepository (db *sql.DB) *SubscriptionRepository {
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
func (sr *SubscriptionRepository) DeleteSubscription(subscriptionID int) error {
	query := "DELETE FROM subscriptions WHERE subscription_id = ?"
	_, err := sr.db.Exec(query, subscriptionID)
	if err != nil {
		return err
	}
	return nil
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
        err := rows.Scan(&follower.UserID, &follower.Email, &follower.FirstName, &follower.LastName, &follower.DateOfBirth, &follower.Avatar, &follower.Nickname, &follower.AboutMe)
        if err != nil {
            return nil, err
        }
        followers = append(followers, &follower)
    }

    if err := rows.Err(); err != nil {
        return nil, err
    }

    return followers, nil
}