import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.json({
        message: "Student Attendance System Backend is Running",
    });
});

app.get("/api/test-db", (req, res) => {
    const result = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table'")
        .all();

    res.json({
        message: "Database working",
        tables: result,
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});