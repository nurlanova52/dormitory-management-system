const express = require("express");
const db = require("./db");

const app = express();
app.use(express.json());

// rooms кестесі: room_number (PK), capacity, occupied_beds
function validate(body, needNumber) {
    const { room_number, capacity } = body;
    const occupied = body.occupied_beds ?? 0;
    if ((needNumber && !room_number) || !capacity) {
        return "Міндетті өрістерді толтырыңыз (room_number, capacity)";
    }
    if (capacity <= 0) return "capacity 0-ден үлкен болуы керек";
    if (occupied < 0 || occupied > capacity) {
        return "occupied_beds 0 мен capacity аралығында болуы керек";
    }
    return null;
}

// 1. Барлық бөлмелерді алу
app.get("/api/rooms", (req, res) => {
    try {
        res.json(db.prepare("SELECT * FROM rooms").all());
    } catch (error) {
        res.status(500).json({ message: "Сервер қатесі" });
    }
});

// 2. Нөмірі бойынша бөлмені алу
app.get("/api/rooms/:id", (req, res) => {
    try {
        const room = db.prepare(
            "SELECT * FROM rooms WHERE room_number = ?"
        ).get(req.params.id);

        if (!room) {
            return res.status(404).json({ message: "Бөлме табылмады" });
        }
        res.json(room);
    } catch (error) {
        res.status(500).json({ message: "Сервер қатесі" });
    }
});

// 3. Жаңа бөлме қосу
app.post("/api/rooms", (req, res) => {
    try {
        const err = validate(req.body, true);
        if (err) return res.status(400).json({ message: err });

        const { room_number, capacity } = req.body;
        const occupied_beds = req.body.occupied_beds ?? 0;

        db.prepare(
            `INSERT INTO rooms (room_number, capacity, occupied_beds)
             VALUES (?, ?, ?)`
        ).run(room_number, capacity, occupied_beds);

        res.status(201).json({ room_number, capacity, occupied_beds });
    } catch (error) {
        if (String(error.message).includes("UNIQUE")) {
            return res.status(409).json({ message: "Мұндай бөлме нөмірі бар" });
        }
        res.status(500).json({ message: "Бөлмені қосу кезінде қате" });
    }
});

// 4. Бөлме ақпаратын жаңарту
app.put("/api/rooms/:id", (req, res) => {
    try {
        const err = validate(req.body, false);
        if (err) return res.status(400).json({ message: err });

        const { capacity } = req.body;
        const occupied_beds = req.body.occupied_beds ?? 0;

        const result = db.prepare(
            `UPDATE rooms
             SET capacity = ?, occupied_beds = ?
             WHERE room_number = ?`
        ).run(capacity, occupied_beds, req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ message: "Бөлме табылмады" });
        }
        res.json({ message: "Бөлме жаңартылды" });
    } catch (error) {
        res.status(500).json({ message: "Сервер қатесі" });
    }
});

// 5. Бөлмені жою
app.delete("/api/rooms/:id", (req, res) => {
    try {
        const result = db.prepare(
            "DELETE FROM rooms WHERE room_number = ?"
        ).run(req.params.id);

        if (result.changes === 0) {
            return res.status(404).json({ message: "Бөлме табылмады" });
        }
        res.json({ message: "Бөлме сәтті жойылды" });
    } catch (error) {
        if (String(error.message).includes("FOREIGN KEY")) {
            return res.status(409).json({ message: "Бөлмеге QR-бұйрық байланған, жоюға болмайды" });
        }
        res.status(500).json({ message: "Сервер қатесі" });
    }
});

module.exports = app;

if (require.main === module) {
    app.listen(3000, () => {
        console.log("API сервері http://localhost:3000");
    });
}
