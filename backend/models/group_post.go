package models

import (
	"database/sql"
	"server/lib"
	"time"
)

type GroupPost struct {
	PostID     int
	Title      string
	Content    string
	CreatedAt  time.Time
	AuthorID   int
	GroupID    int
	ImageURL   string
	Visibility string
	HasImage   int
}

type PostItemGroup struct {
	PostID        int
	AuthorName    string
	Title         string
	Content       string
	IsLiked       bool
	CreatedAt     string
	AuthorID      int
	GroupID       int
	ImageURL      string
	Visibility    string
	HasImage      int
	Categories    []string
	ListOfComment []CommentGroup
	NumberOfComments int
	NumberOfLikes int
}

type GroupPostRepository struct {
	db *sql.DB
}

func NewGroupPostRepository(db *sql.DB) *GroupPostRepository {
	return &GroupPostRepository{
		db: db,
	}
}

// CreatePostInGroup creates a new post in the specified group.
func (gp *GroupPostRepository) CreatePostInGroup(post *GroupPost) error {
	query := `
		INSERT INTO group_posts (title, content, created_at, author_id, group_id, image_url, visibility, has_image)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`

	result, err := gp.db.Exec(query, post.Title, post.Content, post.CreatedAt, post.AuthorID, post.GroupID, post.ImageURL, post.Visibility, post.HasImage)
	if err != nil {
		return err
	}

	_, err = result.LastInsertId()
	if err != nil {
		return err
	}

	return nil
}

// GetPostByID retrieves a post by its ID.
func (gp *GroupPostRepository) GetPostByID(postID int) (*GroupPost, error) {
	query := `
		SELECT post_id, title, content, created_at, author_id, group_id, image_url, visibility, has_image
		FROM group_posts
		WHERE post_id = ? 
	`

	row := gp.db.QueryRow(query, postID)
	var post GroupPost
	err := row.Scan(&post.PostID, &post.Title, &post.Content, &post.CreatedAt, &post.AuthorID, &post.GroupID, &post.ImageURL, &post.Visibility, &post.HasImage)
	if err != nil {
		return nil, err
	}

	return &post, nil
}

// UpdatePost updates the information of a post.
func (gp *GroupPostRepository) UpdatePost(post *GroupPost) error {
	query := `
		UPDATE group_posts
		SET title=?, content=?, created_at=?, author_id=?, group_id=?, image_url=?, visibility=?, has_image=?
		WHERE post_id=?
	`

	_, err := gp.db.Exec(query, post.Title, post.Content, post.CreatedAt, post.AuthorID, post.GroupID, post.ImageURL, post.Visibility, post.HasImage, post.PostID)
	if err != nil {
		return err
	}

	return nil
}

// DeletePost deletes a post by its ID.
func (gp *GroupPostRepository) DeletePost(postID int) error {
	query := `
		DELETE FROM group_posts
		WHERE post_id=?
	`

	_, err := gp.db.Exec(query, postID)
	if err != nil {
		return err
	}

	return nil
}

// GetAllPosts retrieves all posts in the specified group.
func (gp *GroupPostRepository) GetAllPosts(groupID int) ([]GroupPost, error) {
	query := `
		SELECT post_id, title, content, created_at, author_id, group_id, image_url, visibility, has_image
		FROM group_posts
		WHERE group_id = ?
	`

	rows, err := gp.db.Query(query, groupID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []GroupPost
	for rows.Next() {
		var post GroupPost
		err := rows.Scan(&post.PostID, &post.Title, &post.Content, &post.CreatedAt, &post.AuthorID, &post.GroupID, &post.ImageURL, &post.Visibility, &post.HasImage)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return posts, nil
}

// Get all posts from database
func (pr *GroupPostRepository) GetAllPostsItems(groupid, userId int) ([]PostItemGroup, error) {
	var posts []*GroupPost

	rows, err := pr.db.Query("SELECT post_id, title, content, created_at, author_id, group_id, image_url, visibility, has_image FROM group_posts WHERE group_id= ? ORDER BY created_at DESC", groupid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var post GroupPost
		err := rows.Scan(&post.PostID, &post.Title, &post.Content, &post.CreatedAt, &post.AuthorID, &post.GroupID, &post.ImageURL, &post.Visibility, &post.HasImage)
		if err != nil {
			return nil, err
		}
		posts = append(posts, &post)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}
	tabPostItem := []PostItemGroup{}

	for i := 0; i < len(posts); i++ {
		tabUser, _ := UserRepo.SelectAllUsers()

		user := ""
		for j := 0; j < len(tabUser); j++ {
			if posts[i].AuthorID == tabUser[j].UserID {
				user = tabUser[j].Nickname
				break
			}
		}
		tabAllComments, _ := CommentGroupRepo.GetAllCommentsByPostID(posts[i].PostID)

		Category := PostCategoryRepo.GetPostCategory(posts[i].PostID)
		CountLikesForPost, _ := PostGroupLikeRepo.CountLikesByPostID(posts[i].PostID)
		_, err = PostGroupLikeRepo.IsLiked(posts[i].PostID, userId)

		Isliked := true

		if err != nil {
			Isliked = false
		}

		// TopUser, _ := UserRepo.SelectAllUsersByPost(posts[i].ID)
		// tabTopUser := []string{}
		// cpt := 0
		// for l := 0; l < len(TopUser); l++ {
		// 	if cpt < 3 {
		// 		tabTopUser = append(tabTopUser, TopUser[l].AvatarURL)
		// 	}
		// 	cpt++
		// }

		// lastmodif := strings.ReplaceAll(posts[i].ModifiedDate, "T", " ")
		// lastmodif = strings.ReplaceAll(lastmodif, "Z", "")
		// urlImage := strings.ReplaceAll(posts[i].ImageURL, "jpg", "jpg")

		PostItemi := PostItemGroup{
			PostID:        posts[i].PostID,
			AuthorName:    user,
			Title:         posts[i].Title,
			Content:       posts[i].Content,
			CreatedAt:     lib.TimeSinceCreation(posts[i].CreatedAt.Format("2006-01-02 15:04:05")),
			AuthorID:      posts[i].AuthorID,
			GroupID:       posts[i].GroupID,
			ImageURL:      posts[i].ImageURL,
			Visibility:    posts[i].Visibility,
			HasImage:      posts[i].HasImage,
			ListOfComment: tabAllComments,
			Categories:    Category,
			NumberOfLikes: CountLikesForPost,
			NumberOfComments: len(tabAllComments) ,
			IsLiked:       Isliked,
		}

		tabPostItem = append(tabPostItem, PostItemi)
	}

	return tabPostItem, nil
}
