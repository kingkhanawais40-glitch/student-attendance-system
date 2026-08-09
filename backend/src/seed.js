import bcrypt from "bcryptjs";
import db from "./config/database.js";

const password = await bcrypt.hash("Admin@12345", 10);

const existingUser = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get("admin@attendance.com");

if (!existingUser) {
    db.prepare(`
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `).run(
        "System Admin",
        "admin@attendance.com",
        password,
        "admin"
    );

    console.log("Admin user created successfully");
} else {
    console.log("Admin user already exists");
}