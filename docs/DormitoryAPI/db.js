const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Дерекқор файлын көрсету (жобаңыздағы SQLite файлының жолы)
const dbPath = path.resolve(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Дерекқорға қосылу қатесі:", err.message);
    } else {
        console.log("SQLite дерекқорына сәтті қосылды.");
    }
});

module.exports = db;