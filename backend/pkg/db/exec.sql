-- INSERT INTO posts (title, content, author_id, created_at, visibility, has_image)
-- VALUES   
-- ('Title  1', 'This is a third long body text for post  1. It can contain even more content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac ultricies justo. Phasellus eget libero id dui feugiat congue. Donec eget euismod justo. Sed at purus a nunc congue venenatis. In hac habitasse platea dictumst. Fusce vestibulum vel nunc in sagittis. Sed nec libero et libero sagittis luctus vel a tellus. Sed nec posuere erat. Fusce auctor fringilla nulla, sit amet varius ligula. Maecenas et convallis odio. Sed ut tincidunt urna. Proin et dapibus turpis. Sed tincidunt libero nec neque efficitur, in tincidunt justo tristique.', '1', '2023-09-03  15:30:00', 'public', '0'),
-- ('Title  2', 'This is another long body text for post  2. It can also contain multiple sentences and paragraphs. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac ultricies justo. Phasellus eget libero id dui feugiat congue. Donec eget euismod justo. Sed at purus a nunc congue venenatis. In hac habitasse platea dictumst. Fusce vestibulum vel nunc in sagittis. Sed nec libero et libero sagittis luctus vel a tellus. Sed nec posuere erat. Fusce auctor fringilla nulla, sit amet varius ligula. Maecenas et convallis odio. Sed ut tincidunt urna. Proin et dapibus turpis. Sed tincidunt libero nec neque efficitur, in tincidunt justo tristique.', '2', '2023-09-03  15:00:00', 'public', '0'),
-- ('Title  3', 'This is a third long body text for post  3. It can contain even more content. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac ultricies justo. Phasellus eget libero id dui feugiat congue. Donec eget euismod justo. Sed at purus a nunc congue venenatis. In hac habitasse platea dictumst. Fusce vestibulum vel nunc in sagittis. Sed nec libero et libero sagittis luctus vel a tellus. Sed nec posuere erat. Fusce auctor fringilla nulla, sit amet varius ligula. Maecenas et convallis odio. Sed ut tincidunt urna. Proin et dapibus turpis. Sed tincidunt libero nec neque efficitur, in tincidunt justo tristique.', '3', '2023-09-03  15:30:00', 'public', '0');
-- DELETE FROM posts

-- INSERT INTO post_categories (category_id, post_id)
-- VALUES
--     ('1', '12'),
--     ('2', '12'),
--     ('6', '12'),
--     ('2', '13'),
--     ('6', '14');

-- INSERT INTO comments (content, author_id, createdAt, post_id)
-- VALUES 
--     ('This is a little comment text for post 3', '6', '2024-02-07 14:30:00', '12'),
--     ('I love taking photos of nature and animals. 🌳🐶', '4', '2024-02-07 14:40:00', '12'),
--     ('I enjoy people and emotions. 😊😢 ', '4', '2024-02-07 14:50:00', '12'),
--     ('This is a little comment text for post yoows', '5', '2024-02-06 14:30:00', '14'),
--     ('I love taking photos of nature and animals.', '1', '2024-02-06 14:40:00', '14'),
--     ('Just a comment for the yayediop post I love taking photos of nature and animals.', '5', '2024-02-06 14:40:00', '13');
-- DELETE FROM posts WHERE post_id > 49;
-- DELETE FROM comments WHERE post_id > 49;
-- DELETE FROM post_categories WHERE post_id > 14;
-- DELETE FROM comments WHERE comment_id > 8;
-- DELETE FROM post_visibilities;

-- INSERT INTO post_likes (author_id, post_id, rate)
-- VALUES 
--         ('2', '12', '1'),
--         ('2', '14', '1');
-- ALTER TABLE comments ADD COLUMN has_image INTEGER NOT NULL DEFAULT 0;

-- First, drop the existing table
DROP TABLE IF EXISTS "notifications";

-- Then, recreate the table with the new structure
CREATE TABLE IF NOT EXISTS "notifications" (
    notification_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    user_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    notification_type TEXT NOT NULL,
    group_id INTEGER,
    event_id INTEGER,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES "users" (user_id),
    FOREIGN KEY (sender_id) REFERENCES "users" (user_id),
    FOREIGN KEY (group_id) REFERENCES "groups" (group_id),
    FOREIGN KEY (event_id) REFERENCES "events" (event_id)
);
