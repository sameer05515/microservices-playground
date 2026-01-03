CREATE TABLE users (
 id BIGINT NOT NULL AUTO_INCREMENT,
 username VARCHAR(100) NOT NULL,
 password VARCHAR(255) NOT NULL,
 role VARCHAR(20) NOT NULL,
 PRIMARY KEY(id),
 CONSTRAINT uk_users_username UNIQUE(username)
);
CREATE TABLE refresh_tokens (
 id BIGINT NOT NULL AUTO_INCREMENT,
 token VARCHAR(200) NOT NULL,
 user_id BIGINT NOT NULL,
 expires_at TIMESTAMP(6) NOT NULL,
 revoked_at TIMESTAMP(6) NULL,
 PRIMARY KEY(id),
 CONSTRAINT uk_refresh_token UNIQUE(token),
 CONSTRAINT fk_refresh_user FOREIGN KEY(user_id) REFERENCES users(id)
);
CREATE INDEX idx_refresh_expires ON refresh_tokens(expires_at);
