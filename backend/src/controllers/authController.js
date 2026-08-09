import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/database.js";

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        // Find user
        const user = db
            .prepare(
                "SELECT * FROM users WHERE email = ?"
            )
            .get(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // Check password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
            });
        }

        // JWT secret must come from environment
        const secret = process.env.JWT_SECRET;

        if (!secret) {
            console.error("JWT_SECRET is not configured.");

            return res.status(500).json({
                message: "Server configuration error",
            });
        }

        // Create JWT
        const token = jwt.sign({
                id: user.id,
                email: user.email,
                role: user.role,
            },
            secret, {
                expiresIn: "1d",
            }
        );

        // Successful login
        res.json({
            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("LOGIN ERROR:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
}
export async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current password and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters",
            });
        }

        const user = db
            .prepare(
                "SELECT * FROM users WHERE id = ?"
            )
            .get(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Current password is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        db.prepare(
            "UPDATE users SET password = ? WHERE id = ?"
        ).run(
            hashedPassword,
            req.user.id
        );

        res.json({
            message: "Password changed successfully",
        });

    } catch (error) {
        console.error(
            "CHANGE PASSWORD ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to change password",
        });
    }
}
export function updateProfile(req, res) {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                message: "Name and email are required",
            });
        }

        const existingUser = db
            .prepare(
                "SELECT id FROM users WHERE email = ? AND id != ?"
            )
            .get(email, req.user.id);

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already in use",
            });
        }

        db.prepare(`
            UPDATE users
            SET name = ?, email = ?
            WHERE id = ?
        `).run(
            name,
            email,
            req.user.id
        );

        const updatedUser = db
            .prepare(`
                SELECT
                    id,
                    name,
                    email,
                    role
                FROM users
                WHERE id = ?
            `)
            .get(req.user.id);

        return res.json({
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error(
            "UPDATE PROFILE ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to update profile",
        });
    }
}