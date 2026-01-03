CREATE TABLE todos(
 id BIGINT NOT NULL AUTO_INCREMENT,
 title VARCHAR(200) NOT NULL,
 description TEXT,
 completed BOOLEAN NOT NULL,
 user_id BIGINT NOT NULL,
 version BIGINT,
 PRIMARY KEY(id)
);
CREATE INDEX idx_todos_user ON todos(user_id);
CREATE INDEX idx_todos_user_completed ON todos(user_id,completed);
