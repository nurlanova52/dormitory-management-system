const express = require("express");
const db = require("./db");
const app = express();

app.use(express.json());

// 1. Барлық студенттерді алу (GET)
app.get("/api/students", (req, res) => {
    db.all("SELECT * FROM students", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Сервер қатесі", error: err.message });
        }
        res.json(rows);
    });
});

// 2. ID бойынша студентті алу (GET)
app.get("/api/students/:id", (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM students WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Сервер қатесі", error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Студент табылмады" });
        }
        res.json(row);
    });
});

// 3. Жаңа студент қосу (POST)
app.post("/api/students", (req, res) => {
    const { full_name, faculty, gpa, room_number } = req.body;
    if (!full_name || !faculty) {
        return res.status(400).json({ message: "Міндетті өрістерді толтырыңыз" });
    }

    const query = `INSERT INTO students (full_name, faculty, gpa, room_number) VALUES (?, ?, ?, ?)`;
    db.run(query, [full_name, faculty, gpa || 0.0, room_number || null], function(err) {
        if (err) {
            return res.status(500).json({ message: "Студентті қосу кезінде қате", error: err.message });
        }
        res.status(201).json({
            id: this.lastID,
            full_name,
            faculty,
            gpa,
            room_number
        });
    });
});

// 4. Студент ақпаратын жаңарту (PUT)
app.put("/api/students/:id", (req, res) => {
    const id = req.params.id;
    const { full_name, faculty, gpa, room_number } = req.body;
    
    if (!full_name || !faculty) {
        return res.status(400).json({ message: "Міндетті өрістерді толтырыңыз" });
    }

    const query = `UPDATE students SET full_name = ?, faculty = ?, gpa = ?, room_number = ? WHERE id = ?`;
    db.run(query, [full_name, faculty, gpa, room_number, id], function(err) {
        if (err) {
            return res.status(500).json({ message: "Сервер қатесі", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Студент табылмады" });
        }
        res.json({ message: "Студент деректері сәтті жаңартылды" });
    });
});

// 5. Студентті жою (DELETE)
app.delete("/api/students/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM students WHERE id = ?", [id], function(err) {
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