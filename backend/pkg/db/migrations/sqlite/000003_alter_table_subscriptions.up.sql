CREATE UNIQUE INDEX IF NOT EXISTS unique_subscription
ON subscriptions (follower_user_id, following_user_id);

CREATE TABLE IF NOT EXISTS "follow_requests" (
  "follow_request_id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  "follower_user_id" integer NOT NULL,
  "following_user_id" integer NOT NULL,
  "status" text NOT NULL DEFAULT 'pending', -- Added column for status (pending/accepted/declined)
  CHECK (status IN ('pending', 'accepted', 'declined')), -- CHECK constraint
  FOREIGN KEY (follower_user_id) REFERENCES "users" (user_id),
  FOREIGN KEY (following_user_id) REFERENCES "users" (user_id)
);
