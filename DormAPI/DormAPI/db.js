const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "YOUR_PASSWORD",   // өз MySQL пароліңізді енгізіңіз (бос болса: "")
    database: "dorm_db",
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;
