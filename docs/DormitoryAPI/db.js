const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.resolve(__dirname, "database.sqlite");
// docs папкасындағы түпнұсқа database.sql файлына жол
const sqlScriptPath = path.resolve(__dirname, "../database.sql");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Дерекқорға қосылу қатесі:", err.message);
    } else {
        console.log("SQLite дерекқорына сәтті қосылды.");

        // PRAGMA foreign_keys қосу
        db.run("PRAGMA foreign_keys = ON;");

        // database.sql файлын оқып, дерекқорға толық жүктеу
        if (fs.existsSync(sqlScriptPath)) {
            const sqlScript = fs.readFileSync(sqlScriptPath, "utf8");
            db.exec(sqlScript, (err) => {
                if (err) {
                    console.error("SQL скриптін орындау қатесі:", err.message);
                } else {
                    console.log("database.sql файлындағы барлық кестелер мен деректер сәтті жүктелді!");
                }
            });
        } else {
            console.log("Ескерту: database.sql файлы табылмады.");
        }
    }
});

module.exports = db;