CREATE TABLE IF NOT EXISTS "users" (
  "user_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "first_name" text NOT NULL,
  "last_name" text NOT NULL,
  "date_of_birth" date NOT NULL,
  "avatar" text,
  "nickname" text,
  "about_me" text
);

CREATE TABLE IF NOT EXISTS "groups" (
  "group_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "creator_id" integer NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES "users" (user_id)
);

CREATE TABLE IF NOT EXISTS "memberships" (
  "membership_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" integer NOT NULL,
  "group_id" integer NOT NULL,
  "joinedAt" datetime NOT NULL,
  "invitation_status" text NOT NULL,
  "membership_status" text NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "users" (user_id),
  FOREIGN KEY (group_id) REFERENCES "groups" (group_id)
);

CREATE TABLE IF NOT EXISTS "posts" (
  "post_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" text NOT NULL,
  "category" text NOT NULL,
  "content" text NOT NULL,
  "createdAt" datetime NOT NULL DEFAULT(CURRENT_TIMESTAMP),
  "author_id" integer NOT NULL,
  "imageURL" text,
  "visibility" text NOT NULL,
  FOREIGN KEY (author_id) REFERENCES "users" (user_id)
);

-- Table for 'post_category'
CREATE TABLE IF NOT EXISTS "post_category" (
    id VARCHAR PRIMARY KEY,
    categoryID VARCHAR,
    postID VARCHAR,
    FOREIGN KEY (categoryID) REFERENCES category(category_id),
    FOREIGN KEY (postID) REFERENCES posts(post_id)
);
-- Table for 'category'
CREATE TABLE IF NOT EXISTS "category" (
    category_id VARCHAR PRIMARY KEY,
    name VARCHAR,
    createDate DATE,
    modifiedDate DATE
);

CREATE TABLE IF NOT EXISTS "post_visibilities" (
  "post_visibility_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "post_id" integer NOT NULL,
  "user_id_authorized" integer NOT NULL,
  FOREIGN KEY (post_id) REFERENCES "posts" (post_id),
  FOREIGN KEY (user_id_authorized) REFERENCES "users" (user_id)
);

-- follower_user_id represents the user who is following another user. 
-- following_user_id represents the user who is being followed.
CREATE TABLE IF NOT EXISTS "subscriptions" (
  "subscription_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "follower_user_id" integer NOT NULL,
  "following_user_id" integer NOT NULL,
  FOREIGN KEY (follower_user_id) REFERENCES "users" (user_id),
  FOREIGN KEY (following_user_id) REFERENCES "users" (user_id)
);

CREATE TABLE IF NOT EXISTS "events" (
  "event_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "event_date" datetime NOT NULL,
  "group_id" integer NOT NULL,
  FOREIGN KEY (group_id) REFERENCES "groups" (group_id)
);

CREATE TABLE IF NOT EXISTS "attendance" (
  "attendance_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" integer NOT NULL,
  "event_id" integer NOT NULL,
  "attendance_option" integer NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "users" (user_id),
  FOREIGN KEY (event_id) REFERENCES "events" (event_id)
);

CREATE TABLE IF NOT EXISTS "comments" (
  "comment_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "content" text NOT NULL,
  "author_id" integer NOT NULL,
  "post_id" integer NOT NULL,
  "createdAt" datetime NOT NULL DEFAULT(CURRENT_TIMESTAMP),
  FOREIGN KEY (author_id) REFERENCES "users" (user_id),
  FOREIGN KEY (post_id) REFERENCES "posts" (post_id)
);

CREATE TABLE IF NOT EXISTS "post_likes" (
  "post_like_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "author_id" integer NOT NULL,
  "post_id" integer NOT NULL,
  "rate" integer NOT NULL,
  FOREIGN KEY (author_id) REFERENCES "users" (user_id),
  FOREIGN KEY (post_id) REFERENCES "posts" (post_id)
);

CREATE TABLE IF NOT EXISTS "comment_likes" (
  "comment_like_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "author_id" integer NOT NULL,
  "comment_id" integer NOT NULL,
  "rate" integer NOT NULL,
  FOREIGN KEY (author_id) REFERENCES "users" (user_id),
  FOREIGN KEY (comment_id) REFERENCES "comments" (comment_id)
);

CREATE TABLE IF NOT EXISTS "notifications" (
  "notification_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "user_id" integer NOT NULL,
  "type" text NOT NULL,
  "status" text NOT NULL,
  "createdAt" datetime NOT NULL DEFAULT(CURRENT_TIMESTAMP),
  FOREIGN KEY (user_id) REFERENCES "users" (user_id)
);

CREATE TABLE IF NOT EXISTS "messages" (
  "message_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "sender_id" integer NOT NULL,
  "receiver_id" integer NOT NULL,
  "content" text NOT NULL,
  "sent_time" datetime NOT NULL DEFAULT(CURRENT_TIMESTAMP),
  FOREIGN KEY (sender_id) REFERENCES "users" (user_id),
  FOREIGN KEY (receiver_id) REFERENCES "users" (user_id)
);

CREATE TABLE IF NOT EXISTS "group_chats" (
  "group_chat_id" integer PRIMARY KEY AUTOINCREMENT,
  "sender_id" integer NOT NULL,
  "group_id" integer NOT NULL,
  "content" text NOT NULL,
  "sent_time" datetime NOT NULL DEFAULT(CURRENT_TIMESTAMP),
  FOREIGN KEY (sender_id) REFERENCES "users" (user_id),
  FOREIGN KEY (group_id) REFERENCES "groups" (group_id)
);

CREATE TABLE IF NOT EXISTS "sessions" (
  "token" text PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL,
  "expiry" datetime NOT NULL,
  FOREIGN KEY (user_id) REFERENCES "users" (user_id)
);