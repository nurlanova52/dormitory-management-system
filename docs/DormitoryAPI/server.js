const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json());

// 1. Барлық студенттерді алу (users және students кестелерін біріктіріп) (GET)
app.get("/api/students", (req, res) => {
    const query = `
        SELECT s.user_id, u.full_name, u.email, s.faculty, s.gpa, s.course, s.social_status 
        FROM students s 
        JOIN users u ON s.user_id = u.id
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Сервер қатесі", error: err.message });
        }
        res.json(rows);
    });
});

// 2. ID бойынша студентті алу (GET)
app.get("/api/students/:id", (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT s.user_id, u.full_name, u.email, s.faculty, s.gpa, s.course, s.social_status 
        FROM students s 
        JOIN users u ON s.user_id = u.id
        WHERE s.user_id = ?
    `;
    db.get(query, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Сервер қатесі", error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Студент табылмады" });
        }
        res.json(row);
    });
});

// 3. Жаңа студент қосу (POST - users және students кестелеріне қатар қосу)
app.post("/api/students", (req, res) => {
    const { iin, full_name, email, faculty, gpa, course, social_status } = req.body;
    
    if (!full_name || !email || !faculty || !iin) {
        return res.status(400).json({ message: "Міндетті өрістерді толтырыңыз" });
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION;");

        const userQuery = `INSERT INTO users (iin, full_name, email, role) VALUES (?, ?, ?, 'Student')`;
        db.run(userQuery, [iin, full_name, email], function(err) {
            if (err) {
                db.run("ROLLBACK;");
                return res.status(500).json({ message: "Қолданушыны қосу қатесі", error: err.message });
            }

            const userId = this.lastID;
            const studentQuery = `INSERT INTO students (user_id, gpa, course, faculty, social_status) VALUES (?, ?, ?, ?, ?)`;
            
            db.run(studentQuery, [userId, gpa || 0.0, course || 1, faculty, social_status || 'None'], (err) => {
                if (err) {
                    db.run("ROLLBACK;");
                    return res.status(500).json({ message: "Студентті қосу қатесі", error: err.message });
                }

                db.run("COMMIT;");
                res.status(201).json({
                    user_id: userId,
                    full_name,
                    email,
                    faculty,
                    gpa: gpa || 0.0,
                    course: course || 1,
                    social_status: social_status || 'None'
                });
            });
        });
    });
});

// 4. Студент ақпаратын жаңарту (PUT)
app.put("/api/students/:id", (req, res) => {
    const id = req.params.id;
    const { full_name, faculty, gpa, course, social_status } = req.body;
    
    if (!full_name || !faculty) {
        return res.status(400).json({ message: "Міндетті өрістерді толтырыңыз" });
    }

    db.serialize(() => {
        db.run("BEGIN TRANSACTION;");

        const userQuery = `UPDATE users SET full_name = ? WHERE id = ?`;
        db.run(userQuery, [full_name, id], (err) => {
            if (err) {
                db.run("ROLLBACK;");
                return res.status(500).json({ message: "Сервер қатесі", error: err.message });
            }

            const studentQuery = `UPDATE students SET faculty = ?, gpa = ?, course = ?, social_status = ? WHERE user_id = ?`;
            db.run(studentQuery, [faculty, gpa, course, social_status, id], function(err) {
                if (err) {
                    db.run("ROLLBACK;");
                    return res.status(500).json({ message: "Сервер қатесі", error: err.message });
                }
                if (this.changes === 0) {
                    db.run("ROLLBACK;");
                    return res.status(404).json({ message: "Студент табылмады" });
                }

                db.run("COMMIT;");
                res.json({ message: "Студент деректері сәтті жаңартылды" });
            });
        });
    });
});

// 5. Студентті жою (DELETE)
app.delete("/api/students/:id", (req, res) => {
    const id = req.params.id;
    // CASCADE арқылы users кестесінен өшірсек, students кестесінен де автоматты түрде өшеді
    db.run("DELETE FROM users WHERE id = ? AND role = 'Student'", [id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Сервер қатесі", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Студент табылмады" });
        }
        res.json({ message: "Студент сәтті жойылды" });
    });
});

// Серверді іске қосу
app.listen(3000, () => {
    console.log("API сервері http://localhost:3000 мекенжайында жұмыс істеп тұр");
});