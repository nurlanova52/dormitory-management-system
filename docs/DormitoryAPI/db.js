const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Дерекқорға қосылу қатесі:", err.message);
    } else {
        console.log("SQLite дерекқорына сәтті қосылды.");

        // students кестесі жоқ болса, автоматты түрде құру
        db.run(`CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            faculty TEXT NOT NULL,
            gpa REAL,
            room_number INTEGER
        )`, (err) => {
            if (err) {
                console.error("Кесте құру қатесі:", err.message);
            } else {
                console.log("'students' кестесі дайын.");
            }
        });
    }
});

module.exports = db;