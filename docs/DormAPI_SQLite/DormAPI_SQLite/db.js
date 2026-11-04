// SQLite деректер қорына қосылу (Node.js ішіндегі node:sqlite, қосымша орнату керек емес)
const { DatabaseSync } = require("node:sqlite");
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "dorm.db");
const SQL_FILE = path.join(__dirname, "database.sql");

const isNew = !fs.existsSync(DB_FILE);
const db = new DatabaseSync(DB_FILE);

// dorm.db жоқ болса, database.sql скриптінен кестелерді жасап, деректерді толтырады
if (isNew) {
    db.exec(fs.readFileSync(SQL_FILE, "utf8"));
    console.log("dorm.db базасы database.sql негізінде жасалды");
}
db.exec("PRAGMA foreign_keys = ON");

module.exports = db;
