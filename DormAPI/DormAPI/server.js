const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

// Кіріс деректерін тексеру
function validate(body) {
    const { room_number, capacity } = body;
    const occupied = body.occupied_beds ?? 0;
    if (!room_number || !capacity) {
        return "Міндетті өрістерді толтырыңыз (room_number, capacity)";
    }
    if (capacity <= 0) return "capacity 0-ден үлкен болуы керек";
    if (occupied < 0 || occupied > capacity) {
        return "occupied_beds 0 мен capacity аралығында болуы керек";
    }
    return null;
}

// 1. Барлық бөлмелерді алу
app.get("/api/rooms", async (req, res) => {
    try {
        const [rooms] = await db.query("SELECT * FROM rooms");
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Сервер қатесі" });
    }
});

// 2. ID бойынша бөлмені алу
app.get("/api/rooms/:id", async (req, res) => {
    try {
        const [rooms] = await db.query(
            "SELECT * FROM rooms WHERE id = ?",
            [req.params.id]
        );
        if (rooms.length === 0) {
            return res.status(404).json({ message: "Бөлме табылмады" });
        }
        res.json(rooms[0]);
    } catch (error) {
        res.status(500).json({ message: "Сервер қатесі" });
    }
});

// 3. Жаңа бөлме қосу
app.post("/api/rooms", async (req, res) => {
    try {
        const err = validate(req.body);
        if (err) return res.status(400).json({ message: err });

        const { room_number, capacity } = req.body;
        const occupied_beds = req.body.occupied_beds ?? 0;

        const [result] = await db.query(
            `INSERT INTO rooms (room_number, capacity, occupied_beds)
             VALUES (?, ?, ?)`,
            [room_number, capacity, occupied_beds]
        );

        res.status(201).json({
            id: result.insertId,
            room_number,
            capacity,
            occupied_beds
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Мұндай бөлме нөмірі бар" });
        }
        res.status(500).json({ message: "Бөлмені қосу кезінде қате" });
    }
});

// 4. Бөлме ақпаратын жаңарту
app.put("/api/rooms/:id", async (req, res) => {
    try {
        const err = validate(req.body);
        if (err) return res.status(400).json({ message: err });

        const { room_number, capacity } = req.body;
        const occupied_beds = req.body.occupied_beds ?? 0;

        const [result] = await db.query(
            `UPDATE rooms
             SET room_number = ?, capacity = ?, occupied_beds = ?
             WHERE id = ?`,
            [room_number, capacity, occupied_beds, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Бөлме табылмады" });
        }
        res.json({ message: "Бөлме жаңартылды" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Мұндай бөлме нөмірі бар" });
        }
        res.status(500).json({ message: "Сервер қатесі" });
    }
});

// 5. Бөлмені жою
app.delete("/api/rooms/:id", async (req, res) => {
    try {
        const [result] = await db.query(
            "DELETE FROM rooms WHERE id = ?",
            [req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Бөлме табылмады" });
        }
        res.json({ message: "Бөлме сәтті жойылды" });
    } catch (error) {
        res.status(500).json({ message: "Сервер қатесі" });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(3000, () => {
        console.log("API сервері http://localhost:3000");
    });
}
