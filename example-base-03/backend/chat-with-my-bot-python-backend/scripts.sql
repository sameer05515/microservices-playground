CREATE TABLE country (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    capital VARCHAR(255) NOT NULL
);

INSERT INTO country (name, capital) VALUES ('India', 'New Delhi');
INSERT INTO country (name, capital) VALUES ('United States', 'Washington, D.C.');
INSERT INTO country (name, capital) VALUES ('United Kingdom', 'London');
INSERT INTO country (name, capital) VALUES ('France', 'Paris');
INSERT INTO country (name, capital) VALUES ('Germany', 'Berlin');
