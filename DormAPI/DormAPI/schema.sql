-- MySQL: жатақхана АЖ үшін деректер қоры
CREATE DATABASE IF NOT EXISTS dorm_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dorm_db;

DROP TABLE IF EXISTS rooms;

CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_number INT NOT NULL UNIQUE,
    capacity INT NOT NULL,
    occupied_beds INT NOT NULL DEFAULT 0,
    CONSTRAINT chk_capacity CHECK (capacity > 0),
    CONSTRAINT chk_occupied CHECK (occupied_beds >= 0 AND occupied_beds <= capacity)
);

INSERT INTO rooms (room_number, capacity, occupied_beds) VALUES
(301, 4, 2),
(302, 4, 2),
(303, 3, 1),
(304, 4, 0),
(305, 4, 1);
