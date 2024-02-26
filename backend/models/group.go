package models

import (
	"database/sql"
	"log"
)

// Group structure represents the "groups" table
type Group struct {
	GroupID     int    `json:"group_id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	CreatorID   int    `json:"creator_id"`
	User 		*User
}

type GroupRepository struct {
	db *sql.DB
}

func NewGroupRepository(db *sql.DB) *GroupRepository {
	return &GroupRepository{
		db: db,
	}
}

// CreateGroup adds a new group to the database
func (gr *GroupRepository) CreateGroup(group *Group) (error, int) {
	query := `
		INSERT INTO groups (title, description, creator_id)
		VALUES (?, ?, ?)
	`
	result, err := gr.db.Exec(query, group.Title, group.Description, group.CreatorID)
	if err != nil {
		return err, 0
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return err, 0
	}

	group.GroupID = int(lastInsertID)
	return nil, int(lastInsertID)
}

// GetGroup retrieves a group from the database by group_id
func (gr *GroupRepository) GetGroup(groupID int) (*Group, error) {
	query := "SELECT * FROM groups WHERE group_id = ?"
	var group Group
	err := gr.db.QueryRow(query, groupID).Scan(&group.GroupID, &group.Title, &group.Description, &group.CreatorID)
	if err != nil {
		return nil, err
	}
	group.User, _ = UserRepo.GetUserByID(group.CreatorID)
	return &group, nil
}

// GetGroup retrieves a group from the database by group_id
func (gr *GroupRepository) IsOwner(groupID, user_id int) (*Group, error) {
	query := "SELECT * FROM groups WHERE group_id = ? AND Creator_id = ?"
	var group Group
	err := gr.db.QueryRow(query, groupID, user_id).Scan(&group.GroupID, &group.Title, &group.Description, &group.CreatorID)
	if err != nil {
		return nil, err
	}
	return &group, nil
}

// UpdateGroup updates an existing group in the database
func (gr *GroupRepository) UpdateGroup(group *Group) error {
	query := `
		UPDATE groups
		SET title = ?, description = ?, creator_id = ?
		WHERE group_id = ?
	`
	_, err := gr.db.Exec(query, group.Title, group.Description, group.CreatorID, group.GroupID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteGroup removes a group from the database by group_id
func (gr *GroupRepository) DeleteGroup(groupID int) error {
	query := "DELETE FROM groups WHERE group_id = ?"
	_, err := gr.db.Exec(query, groupID)
	if err != nil {
		return err
	}
	return nil
}

func (gr *GroupRepository) GetAllPublicGroup(userid int) []Group {
	rows, err := gr.db.Query("SELECT * FROM groups WHERE creator_id != ? ORDER BY group_id DESC", userid)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var groups []Group

	for rows.Next() {
		var group Group
		err := rows.Scan(&group.GroupID, &group.Title, &group.Description, &group.CreatorID)
		if err != nil {
			log.Fatal(err)
		}

		exist := MembershipRepo.CheckIfMembershispExist(userid, group.GroupID)
		isInvited := InvitationRepo.IsInvited(userid, group.GroupID)

		if !exist && !isInvited {
			groups = append(groups, group)
		}
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	return groups
}
func (gr *GroupRepository) SubcribedGroups(userid int) []Group {
	rows, err := gr.db.Query("SELECT * FROM groups WHERE creator_id != ? ORDER BY group_id DESC", userid)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var groups []Group

	for rows.Next() {
		var group Group
		err := rows.Scan(&group.GroupID, &group.Title, &group.Description, &group.CreatorID)
		if err != nil {
			log.Fatal(err)
		}

		exist := MembershipRepo.CheckIfSubscribed(userid, group.GroupID, "accepted")

		if exist {
			groups = append(groups, group)
		}
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	return groups
}

func (gr *GroupRepository) GetUserOwnGroups(userid int) []Group {
	rows, err := gr.db.Query("SELECT * FROM groups WHERE creator_id = ? ORDER BY group_id DESC", userid)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	var groups []Group

	for rows.Next() {
		var group Group
		err := rows.Scan(&group.GroupID, &group.Title, &group.Description, &group.CreatorID)
		if err != nil {
			log.Fatal(err)
		}

		groups = append(groups, group)
	}

	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}

	return groups
}

func (gr *GroupRepository) CheckGroupExist(name string) bool {
	query := "SELECT * FROM groups WHERE title = ?"
	var group Group
	err := gr.db.QueryRow(query, name).Scan(&group.GroupID, &group.Title, &group.Description, &group.CreatorID)
	return err != nil
}

func (gr *GroupRepository) GetAllInvitedGroup(userID int) ([]Group, error) {
	var groups []Group

	// Query to retrieve groups where the user has been invited
	query := `
		SELECT g.group_id, g.title, g.description, g.creator_id
		FROM groups g
		JOIN invitations i ON g.group_id = i.group_id
		WHERE i.receiver_id = ?
	`

	rows, err := gr.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var group Group
		if err := rows.Scan(&group.GroupID, &group.Title, &group.Description, &group.CreatorID); err != nil {
			return nil, err
		}
		groups = append(groups, group)
	}

	return groups, nil
}