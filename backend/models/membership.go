package models

import (
	"database/sql"
)

// Membership structure represents the "memberships" table
type Membership struct {
	MembershipID     int    `json:"membership_id"`
	UserID           int    `json:"user_id"`
	GroupID          int    `json:"group_id"`
	JoinedAt         string `json:"joined_at"`
	InvitationStatus string `json:"invitation_status"`
	MembershipStatus string `json:"membership_status"`
}

type MembershipRepository struct {
	db *sql.DB
}

func NewMembershipRepository(db *sql.DB) *MembershipRepository {
	return &MembershipRepository{
		db: db,
	}
}

// CreateMembership adds a new membership to the database
func (cm *MembershipRepository) CreateMembership(membership *Membership) error {
	query := `
		INSERT INTO memberships (user_id, group_id, joined_at, invitation_status, membership_status)
		VALUES (?, ?, ?, ?, ?)
	`
	result, err := cm.db.Exec(query, membership.UserID, membership.GroupID, membership.JoinedAt, membership.InvitationStatus, membership.MembershipStatus)
	if err != nil {
		return err
	}

	lastInsertID, err := result.LastInsertId()
	if err != nil {
		return err
	}

	membership.MembershipID = int(lastInsertID)
	return nil
}

// GetMembership retrieves a membership from the database by membership_id
func (cm *MembershipRepository) GetMembership(membershipID int) (*Membership, error) {
	query := "SELECT * FROM memberships WHERE membership_id = ?"
	var membership Membership
	err := cm.db.QueryRow(query, membershipID).Scan(&membership.MembershipID, &membership.UserID, &membership.GroupID, &membership.JoinedAt, &membership.InvitationStatus, &membership.MembershipStatus)
	if err != nil {
		return nil, err
	}
	return &membership, nil
}

// GetMembership retrieves a membership from the database by membership_id
func (cm *MembershipRepository) GetMembershipbyGroupAndUserId(groupId, userID int) (*Membership, error) {
	query := "SELECT * FROM memberships WHERE group_id = ? AND user_id = ? "
	var membership Membership
	err := cm.db.QueryRow(query, groupId, userID).Scan(&membership.MembershipID, &membership.UserID, &membership.GroupID, &membership.JoinedAt, &membership.InvitationStatus, &membership.MembershipStatus)
	if err != nil {
		return nil, err
	}
	return &membership, nil
}

// UpdateMembership updates an existing membership in the database
func (cm *MembershipRepository) UpdateMembership(membership *Membership) error {
	query := `
		UPDATE memberships
		SET user_id = ?, group_id = ?, joined_at = ?, invitation_status = ?, membership_status = ?
		WHERE membership_id = ?
	`
	_, err := cm.db.Exec(query, membership.UserID, membership.GroupID, membership.JoinedAt, membership.InvitationStatus, membership.MembershipStatus, membership.MembershipID)
	if err != nil {
		return err
	}
	return nil
}

// DeleteMembership removes a membership from the database by membership_id
func (cm *MembershipRepository) DeleteMembership(membershipID int) error {
	query := "DELETE FROM memberships WHERE membership_id = ?"
	_, err := cm.db.Exec(query, membershipID)
	if err != nil {
		return err
	}
	return nil
}

func (cm *MembershipRepository) CheckIfMembershispExist(userId, groupId int) bool {
	query := "SELECT * FROM memberships WHERE group_id = ? AND user_id = ?"
	var membership Membership
	err := cm.db.QueryRow(query, groupId, userId).Scan(&membership.MembershipID, &membership.UserID, &membership.GroupID, &membership.JoinedAt, &membership.InvitationStatus, &membership.MembershipStatus)
	return err == nil
}

func (cm *MembershipRepository) CheckIfSubscribed(userId, groupId int, option string) bool {
	query := "SELECT * FROM memberships WHERE group_id = ? AND user_id = ? AND membership_status= ?"
	var membership Membership
	err := cm.db.QueryRow(query, groupId, userId, option).Scan(&membership.MembershipID, &membership.UserID, &membership.GroupID, &membership.JoinedAt, &membership.InvitationStatus, &membership.MembershipStatus)

	return err == nil
}

func (cm *MembershipRepository) CheckIfIsMember(userId, groupId int) bool {
	query := "SELECT * FROM memberships WHERE group_id = ? AND user_id = ? AND membership_status != 'pending'"
	var membership Membership
	err := cm.db.QueryRow(query, groupId, userId).Scan(&membership.MembershipID, &membership.UserID, &membership.GroupID, &membership.JoinedAt, &membership.InvitationStatus, &membership.MembershipStatus)
	// S'il fait la requête et que dans ce cas là si y a aucune ligne donc il va retourner there is no row and the error will be != nil
	// S'il trouve une ligne l
	return err == nil
}

func (cm *MembershipRepository) CheckGroupIsPublic(userId, groupId int) bool {
	query := "SELECT * FROM memberships WHERE group_id = ? AND user_id = ?"
	var membership Membership
	err := cm.db.QueryRow(query, groupId, userId).Scan(&membership.MembershipID, &membership.UserID, &membership.GroupID, &membership.JoinedAt, &membership.InvitationStatus, &membership.MembershipStatus)
	return err == nil
}

func (cm *MembershipRepository) GetAllRequestByGroupID(groupID int) ([]User, error) {
	query := `
		SELECT u.user_id, u.email, u.password, u.first_name, u.last_name, u.date_of_birth, u.avatar, u.nickname, u.about_me, u.account_type
		FROM users u
		INNER JOIN memberships m ON u.user_id = m.user_id
		WHERE m.group_id = ? AND m.membership_status = "pending"
	`

	rows, err := cm.db.Query(query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(
			&user.UserID, &user.Email, &user.Password, &user.FirstName, &user.LastName,
			&user.DateOfBirth, &user.Avatar, &user.Nickname, &user.AboutMe, &user.AccountType,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

// Structure pour stocker les informations sur un groupe
type GroupInfo struct {
	GroupID          int ``
	GroupName        string
	GroupDescription string
	Users            []UserInfo
}

type UserInfo struct {
	ID              int
	Avatar          string
	NicknameOrEmail string
}

func (cm *MembershipRepository) GetAllGroupsForUser(userID int) ([]*GroupInfo, error) {
	query := `
		SELECT groups.group_id, groups.title, groups.description
		FROM memberships
		INNER JOIN groups ON memberships.group_id = groups.group_id
		WHERE memberships.user_id = ? AND memberships.membership_status = 'accepted';
	`

	rows, err := cm.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var groups []*GroupInfo
	for rows.Next() {
		var group GroupInfo
		err := rows.Scan(&group.GroupID, &group.GroupName, &group.GroupDescription)
		if err != nil {
			return nil, err
		}

		users, err := cm.GetAllUsersByGroupID(group.GroupID)
		if err != nil {
			return nil, err
		}

		var userInfos []UserInfo
		for _, user := range users {
			nicknameOrEmail := user.Nickname
			if nicknameOrEmail == "" {
				nicknameOrEmail = user.Email
			}
			userInfos = append(userInfos, UserInfo{
				ID:              user.UserID,
				Avatar:          user.Avatar,
				NicknameOrEmail: nicknameOrEmail,
			})
		}

		group.Users = userInfos
		groups = append(groups, &group)
	}

	return groups, rows.Err()
}

func (cm *MembershipRepository) GetAllUsersByGroupID(groupID int) ([]User, error) {
	query := `
		SELECT u.user_id, u.email, u.password, u.first_name, u.last_name, u.date_of_birth, u.avatar, COALESCE(u.nickname, u.email) as nickname, u.about_me
		FROM users u
		INNER JOIN memberships m ON u.user_id = m.user_id
		WHERE m.group_id = ? AND m.membership_status = "accepted" 
	`

	rows, err := cm.db.Query(query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []User
	for rows.Next() {
		var user User
		err := rows.Scan(
			&user.UserID, &user.Email, &user.Password, &user.FirstName, &user.LastName,
			&user.DateOfBirth, &user.Avatar, &user.Nickname, &user.AboutMe,
		)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, rows.Err()
}
