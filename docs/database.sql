-- 1. Пайдаланушылар кестесі
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    iin VARCHAR(12) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Student', 'Commandant'))
);

-- 2. Студенттер кестесі (users кестесімен 1:1 байланыс)
CREATE TABLE students (
    user_id INT PRIMARY KEY,
    gpa DECIMAL(3, 2) CHECK (gpa >= 0.0 AND gpa <= 4.0),
    course INT CHECK (course BETWEEN 1 AND 4),
    faculty VARCHAR(100) NOT NULL,
    social_status VARCHAR(100) DEFAULT 'None',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Коменданттар кестесі
CREATE TABLE commandants (
    user_id INT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Бөлмелер кестесі
CREATE TABLE rooms (
    room_number INT PRIMARY KEY,
    capacity INT NOT NULL CHECK (capacity > 0),
    occupied_beds INT DEFAULT 0 CHECK (occupied_beds <= capacity)
);

-- 5. Өтінімдер кестесі
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Reserve')),
    total_points DECIMAL(5, 2) DEFAULT 0.0,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

-- 6. QR Ордерлер кестесі
CREATE TABLE qr_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT UNIQUE NOT NULL,
    room_number INT NOT NULL,
    qr_data TEXT NOT NULL,
    issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (room_number) REFERENCES rooms(room_number)
);-- 1. Пайдаланушылар кестесі
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    iin VARCHAR(12) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Student', 'Commandant'))
);

-- 2. Студенттер кестесі (users кестесімен 1:1 байланыс)
CREATE TABLE students (
    user_id INT PRIMARY KEY,
    gpa DECIMAL(3, 2) CHECK (gpa >= 0.0 AND gpa <= 4.0),
    course INT CHECK (course BETWEEN 1 AND 4),
    faculty VARCHAR(100) NOT NULL,
    social_status VARCHAR(100) DEFAULT 'None',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Коменданттар кестесі
CREATE TABLE commandants (
    user_id INT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Бөлмелер кестесі
CREATE TABLE rooms (
    room_number INT PRIMARY KEY,
    capacity INT NOT NULL CHECK (capacity > 0),
    occupied_beds INT DEFAULT 0 CHECK (occupied_beds <= capacity)
);

-- 5. Өтінімдер кестесі
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Reserve')),
    total_points DECIMAL(5, 2) DEFAULT 0.0,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

-- 6. QR Ордерлер кестесі
CREATE TABLE qr_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT UNIQUE NOT NULL,
    room_number INT NOT NULL,
    qr_data TEXT NOT NULL,
    issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (room_number) REFERENCES rooms(room_number)
);

-- 1. Пайдаланушыларды енгізу
INSERT INTO users (iin, full_name, email, role) 
VALUES ('050101500111', 'Әлібеков Асан Серікұлы', 'asan@kaznu.kz', 'Student'),
       ('800512300222', 'Серікова Әлия Мұратқызы', 'aliya@kaznu.kz', 'Commandant');

-- 2. Студент пен Комендант мәліметін енгізу
INSERT INTO students (user_id, gpa, course, faculty, social_status) 
VALUES (1, 3.85, 2, 'Ақпараттық технологиялар', 'Көпбалалы отбасы');

INSERT INTO commandants (user_id, employee_id) 
VALUES (2, 'EMP-1042');

-- 3. Бөлме қосу
INSERT INTO rooms (room_number, capacity, occupied_beds) 
VALUES (305, 4, 2);

-- 4. Өтінім беру
INSERT INTO applications (student_id, status, total_points) 
VALUES (1, 'Approved', 88.50);

-- 5. QR Ордер қалыптастыру
INSERT INTO qr_orders (application_id, room_number, qr_data) 
VALUES (1, 305, 'QR_ORD_2026_001_A305');

-- Өтінім мәртебесін және балын жаңарту
UPDATE applications 
SET status = 'Approved', total_points = 92.00 
WHERE id = 1;

-- Бөлмедегі бос емес орындар санын 1-ге арттыру
UPDATE rooms 
SET occupied_beds = occupied_beds + 1 
WHERE room_number = 305;

-- Қабылданбай қалған немесе ескі өтінімді жою
DELETE FROM applications 
WHERE status = 'Rejected';

-- Белгілі бір QR-ордерді өшіру
DELETE FROM qr_orders 
WHERE id = 1;

SELECT * FROM users;
SELECT * FROM students;
SELECT * FROM applications;