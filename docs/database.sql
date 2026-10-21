PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS qr_orders;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS commandants;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    iin TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('Student', 'Commandant'))
);

CREATE TABLE students (
    user_id INTEGER PRIMARY KEY,
    gpa REAL CHECK (gpa >= 0.0 AND gpa <= 4.0),
    course INTEGER CHECK (course BETWEEN 1 AND 4),
    faculty TEXT NOT NULL,
    social_status TEXT DEFAULT 'None',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE commandants (
    user_id INTEGER PRIMARY KEY,
    employee_id TEXT NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE rooms (
    room_number INTEGER PRIMARY KEY,
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    occupied_beds INTEGER DEFAULT 0 CHECK (occupied_beds <= capacity)
);

CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Reserve')),
    total_points REAL DEFAULT 0.0,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE
);

CREATE TABLE qr_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER UNIQUE NOT NULL,
    room_number INTEGER NOT NULL,
    qr_data TEXT NOT NULL,
    issue_date TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (room_number) REFERENCES rooms(room_number)
);

-- Деректерді қосу
INSERT INTO users (iin, full_name, email, role) VALUES 
('050101500111', 'Әлібеков Асан Серікұлы', 'asan@kaznu.kz', 'Student'),
('040202600222', 'Қасымова Аружан Мұратқызы', 'aruzhan@kaznu.kz', 'Student'),
('050303500333', 'Нұрланов Данияр Ерланұлы', 'daniyar@kaznu.kz', 'Student'),
('030404600444', 'Асқарова Динара Бақытқызы', 'dinara@kaznu.kz', 'Student'),
('050505500555', 'Серіков Болат Қайратұлы', 'bolat@kaznu.kz', 'Student'),
('040606600666', 'Жұмабаева Айгерім Арманқызы', 'aigerim@kaznu.kz', 'Student'),
('050707500777', 'Кенесов Нұрсұлтан Талғатұлы', 'nursultan@kaznu.kz', 'Student'),
('040808600888', 'Сапарбаева Мадина Айдозқызы', 'madina@kaznu.kz', 'Student'),
('050909500999', 'Оспанов Ернар Нұржанұлы', 'ernar@kaznu.kz', 'Student'),
('041010600101', 'Төлеуова Аяулым Мұхтарқызы', 'ayaulym@kaznu.kz', 'Student'),
('051111500202', 'Бақытов Санжар Дәуренұлы', 'sanzhar@kaznu.kz', 'Student'),
('041212600303', 'Рұстембекова Алуа Ғалымқызы', 'alua@kaznu.kz', 'Student'),
('800512300333', 'Серікова Әлия Мұратқызы', 'aliya@kaznu.kz', 'Commandant'),
('780315400444', 'Жолдасов Марат Сәбитұлы', 'marat@kaznu.kz', 'Commandant');

INSERT INTO students (user_id, gpa, course, faculty, social_status) VALUES 
(1, 3.85, 2, 'Ақпараттық технологиялар', 'Көпбалалы отбасы'),
(2, 3.20, 1, 'Механика-математика', 'None'),
(3, 3.90, 3, 'Ақпараттық технологиялар', 'Жетім бала'),
(4, 3.65, 2, 'Филология', 'None'),
(5, 2.95, 1, 'Физика-техникалық', 'None'),
(6, 3.75, 4, 'Экономика', 'Толық емес отбасы'),
(7, 3.10, 2, 'Химия', 'None'),
(8, 3.98, 3, 'Ақпараттық технологиялар', 'Көпбалалы отбасы'),
(9, 2.80, 1, 'Тарих', 'None'),
(10, 3.50, 2, 'Биология', 'None'),
(11, 3.40, 3, 'География', 'None'),
(12, 3.88, 1, 'Заң', 'Мүгедектігі бар');

INSERT INTO commandants (user_id, employee_id) VALUES 
(13, 'EMP-1042'),
(14, 'EMP-1043');

INSERT INTO rooms (room_number, capacity, occupied_beds) VALUES 
(301, 4, 2),
(302, 4, 2),
(303, 3, 1),
(304, 4, 0),
(305, 4, 1);

INSERT INTO applications (student_id, status, total_points) VALUES 
(1, 'Approved', 92.00),
(2, 'Rejected', 55.00),
(3, 'Approved', 95.50),
(4, 'Approved', 82.00),
(5, 'Pending', 60.00),
(6, 'Approved', 88.00),
(7, 'Reserve', 70.00),
(8, 'Approved', 98.00),
(9, 'Rejected', 48.00),
(10, 'Pending', 75.00),
(11, 'Reserve', 72.50),
(12, 'Approved', 94.00);

INSERT INTO qr_orders (application_id, room_number, qr_data) VALUES 
(1, 301, 'QR_ORD_2026_001_A301'),
(3, 301, 'QR_ORD_2026_003_A301'),
(4, 302, 'QR_ORD_2026_004_A302'),
(6, 302, 'QR_ORD_2026_006_A302'),
(8, 303, 'QR_ORD_2026_008_A303'),
(12, 305, 'QR_ORD_2026_012_A305');

UPDATE applications 
SET status = 'Approved', total_points = 92.00 
WHERE id = 11;

UPDATE rooms 
SET occupied_beds = occupied_beds + 1 
WHERE room_number = 305;

DELETE FROM applications 
WHERE status = 'Rejected';


SELECT * FROM users;
SELECT * FROM students;
SELECT * FROM rooms;
SELECT * FROM applications;
SELECT * FROM qr_orders;

SELECT full_name, email 
FROM users 
WHERE role = 'Student';

SELECT * 
FROM students 
WHERE gpa >= 3.5 AND course = 2;

SELECT DISTINCT faculty 
FROM students;

SELECT user_id, faculty, gpa 
FROM students 
ORDER BY gpa DESC;

SELECT faculty, 
       COUNT(user_id) AS student_count, 
       ROUND(AVG(gpa), 2) AS avg_gpa 
FROM students 
GROUP BY faculty;

SELECT faculty, ROUND(AVG(gpa), 2) AS avg_gpa 
FROM students 
GROUP BY faculty 
HAVING AVG(gpa) >= 3.5;

SELECT status, COUNT(*) AS total_applications 
FROM applications 
GROUP BY status;

SELECT id, student_id, total_points 
FROM applications 
WHERE total_points > (SELECT AVG(total_points) FROM applications);

SELECT social_status, 
       MAX(gpa) AS max_gpa, 
       MIN(gpa) AS min_gpa 
FROM students 
WHERE social_status != 'None' 
GROUP BY social_status;


SELECT room_number, capacity, occupied_beds, 
       (capacity - occupied_beds) AS free_beds 
FROM rooms 
WHERE (capacity - occupied_beds) > 0 
ORDER BY free_beds DESC;

SELECT u.full_name, a.status, q.room_number 
FROM students s 
JOIN users u ON s.user_id = u.id
JOIN applications a ON s.user_id = a.student_id 
LEFT JOIN qr_orders q ON a.id = q.application_id;


SELECT u.full_name, s.gpa, s.faculty 
FROM students s 
JOIN users u ON s.user_id = u.id
WHERE s.gpa >= (SELECT AVG(gpa) FROM students);


SELECT full_name, email 
FROM users 
WHERE id IN (SELECT student_id FROM applications WHERE status = 'Approved');


SELECT u.full_name, s.gpa, 
       CASE 
           WHEN s.gpa >= 3.7 THEN 'Үздік студент'
           WHEN s.gpa >= 3.0 THEN 'Жақсы студент'
           ELSE 'Қанағаттанарлық'
       END AS academic_status 
FROM students s
JOIN users u ON s.user_id = u.id;

SELECT s.faculty, COUNT(a.id) AS approved_count 
FROM students s 
JOIN applications a ON s.user_id = a.student_id 
WHERE a.status = 'Approved' 
GROUP BY s.faculty 
HAVING COUNT(a.id) >= 1;
