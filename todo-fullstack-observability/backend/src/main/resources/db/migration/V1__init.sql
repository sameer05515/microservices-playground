CREATE TABLE users (id BIGINT NOT NULL AUTO_INCREMENT, username VARCHAR(100) NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(20) NOT NULL, PRIMARY KEY (id), CONSTRAINT uk_users_username UNIQUE (username));
CREATE TABLE todos (id BIGINT NOT NULL AUTO_INCREMENT, title VARCHAR(200) NOT NULL, description TEXT, completed BOOLEAN NOT NULL, user_id BIGINT NOT NULL, version BIGINT, PRIMARY KEY (id), CONSTRAINT fk_todos_user FOREIGN KEY (user_id) REFERENCES users(id));
CREATE INDEX idx_todos_user ON todos(user_id);
CREATE INDEX idx_todos_user_completed ON todos(user_id, completed);
