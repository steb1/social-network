package models

import "database/sql"

// PostLike structure represents the "post_likes" table
type PostLike struct {
	PostLikeID int `json:"post_like_id"`
	AuthorID   int `json:"author_id"`
	PostID     int `json:"post_id"`
	Rate       int `json:"rate"`
}

type PostLikeRepository struct {
	db *sql.DB
}

func NewPostLikeRepository(db *sql.DB) *PostLikeRepository {
	return &PostLikeRepository{
		db: db,
	}
}

// CreatePostLike adds a new post like to the database
func (plr *PostLikeRepository) CreatePostLike(postLike *PostLike) error {
	query := `
		INSERT INTO post_likes (author_id, post_id, rate)
		VALUES (?, ?, ?)
	`
	_, err := plr.db.Exec(query, postLike.AuthorID, postLike.PostID, postLike.Rate)
	if err != nil {
		return err
	}

	return nil
}

// GetPostLike retrieves a post like from the database by post_like_id
func  (plr *PostLikeRepository) GetPostLike(postLikeID int) (*PostLike, error) {
	query := "SELECT * FROM post_likes WHERE post_like_id = ?"
	var postLike PostLike
	err := plr.db.QueryRow(query, postLikeID).Scan(&postLike.PostLikeID, &postLike.AuthorID, &postLike.PostID, &postLike.Rate)
	if err != nil {
		return nil, err
	}
	return &postLike, nil
}

// UpdatePostLike updates an existing post like in the database
func  (plr *PostLikeRepository) UpdatePostLike(postLike *PostLike) error {
	query := `
		UPDATE post_likes
		SET author_id = ?, post_id = ?, rate = ?
		WHERE post_like_id = ?
	`
	_, err := plr.db.Exec(query, postLike.AuthorID, postLike.PostID, postLike.Rate, postLike.PostLikeID)
	if err != nil {
		return err
	}
	return nil
}

// GetUserLikedPosts retrieves posts liked by a specific user from the database
func (pr *PostRepository) GetUserLikedPosts(userID int) ([]*Post, error) {
    rows, err := pr.db.Query("SELECT p.post_id, p.title, p.category, p.content, p.created_at, p.author_id, p.image_url, p.visibility FROM post p INNER JOIN post_like pl ON p.post_id = pl.post_id WHERE pl.author_id = ?", userID)
    if err != nil {
        return nil, err
    }
    defer rows.Close()

    var posts []*Post
    for rows.Next() {
        var post Post
        err := rows.Scan(&post.PostID, &post.Title, &post.Category, &post.Content, &post.CreatedAt, &post.AuthorID, &post.ImageURL, &post.Visibility)
        if err != nil {
            return nil, err
        }
        posts = append(posts, &post)
    }

    return posts, nil
}


// DeletePostLike removes a post like from the database by post_like_id
func  (plr *PostLikeRepository) DeletePostLike(postLikeID int) error {
	query := "DELETE FROM post_likes WHERE post_like_id = ?"
	_, err := plr.db.Exec(query, postLikeID)
	if err != nil {
		return err
	}
	return nil
}
