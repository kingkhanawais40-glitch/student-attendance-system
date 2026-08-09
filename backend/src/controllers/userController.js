import bcrypt from "bcryptjs";
import db from "../config/database.js";

// ==========================================
// GET ALL USERS
// ==========================================

export function getUsers(req, res) {
    try {
        const users = db
            .prepare(`
                SELECT
                    id,
                    name,
                    email,
                    role
                FROM users
                ORDER BY id DESC
            `)
            .all();

        return res.json({
            users,
        });

    } catch (error) {
        console.error(
            "GET USERS ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to get users",
        });
    }
}

// ==========================================
// GET SINGLE USER
// ==========================================

export function getUserById(req, res) {
    try {
        const { id } = req.params;

        const user = db
            .prepare(`
                SELECT
                    id,
                    name,
                    email,
                    role
                FROM users
                WHERE id = ?
            `)
            .get(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.json({
            user,
        });

    } catch (error) {
        console.error(
            "GET USER ERROR:",
            error
        );

        return res.status(500).json({
            message: "Failed to get user",
        });
    }
}

// ==========================================
// CREATE USER
// ==========================================

export async function createUser(req, res) {
    try {
        const {
            name,
            email,
            password,
            role,
        } = req.body;

        // Required fields
        if (!name ||
            !email ||
            !password ||
            !role
        ) {
            return res.status(400).json({
                message: "Name, email, password and role are required",
            });
        }

        // Validate role
        if (![
                "admin",
                "teacher",
                "student",
            ].includes(role)) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        // Check duplicate email
        const existingUser = db
            .prepare(`
                SELECT id
                FROM users
                WHERE email = ?
            `)
            .get(email);

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered",
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
            });
        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(
                password,
                10
            );

        // Insert user
        const result = db
            .prepare(`
                INSERT INTO users
                (
                    name,
                    email,
                    password,
                    role
                )
                VALUES (?, ?, ?, ?)
            `)
            .run(
                name.trim(),
                email.trim().toLowerCase(),
                hashedPassword,
                role
            );

        // Get created user
        const user = db
            .prepare(`
                SELECT
                    id,
                    name,
                    email,
                    role
                FROM users
                WHERE id = ?
            `)
            .get(
                result.lastInsertRowid
            );

        return res.status(201).json({
            message: "User created successfully",
            user,
        });

    } catch (error) {
        console.error(
            "CREATE USER ERROR:",
            error.message
        );

        return res.status(500).json({
            message: "Failed to create user",
            error: error.message,
        });
    }
}

// ==========================================
// UPDATE USER
// ==========================================

export async function updateUser(req, res) {
    try {
        const { id } = req.params;

        const {
            name,
            email,
            role,
            password,
        } = req.body;

        // Check user
        const existingUser = db
            .prepare(`
                SELECT id
                FROM users
                WHERE id = ?
            `)
            .get(id);

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Validate role if provided
        if (
            role &&
            ![
                "admin",
                "teacher",
                "student",
            ].includes(role)
        ) {
            return res.status(400).json({
                message: "Invalid role",
            });
        }

        // Check duplicate email
        if (email) {
            const duplicateEmail =
                db
                .prepare(`
                        SELECT id
                        FROM users
                        WHERE email = ?
                        AND id != ?
                    `)
                .get(
                    email,
                    id
                );

            if (duplicateEmail) {
                return res.status(409).json({
                    message: "Email is already registered",
                });
            }
        }

        // Update basic information
        if (
            name ||
            email ||
            role
        ) {
            db.prepare(`
                UPDATE users
                SET
                    name = COALESCE(?, name),
                    email = COALESCE(?, email),
                    role = COALESCE(?, role)
                WHERE id = ?
            `).run(
                name ?
                name.trim() :
                null,

                email ?
                email
                .trim()
                .toLowerCase() :
                null,

                role || null,

                id
            );
        }

        // Update password separately
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters",
                });
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            db.prepare(`
                UPDATE users
                SET password = ?
                WHERE id = ?
            `).run(
                hashedPassword,
                id
            );
        }

        const updatedUser =
            db
            .prepare(`
                    SELECT
                        id,
                        name,
                        email,
                        role
                    FROM users
                    WHERE id = ?
                `)
            .get(id);

        return res.json({
            message: "User updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error(
            "UPDATE USER ERROR:",
            error.message
        );

        return res.status(500).json({
            message: "Failed to update user",
            error: error.message,
        });
    }
}

// ==========================================
// DELETE USER
// ==========================================

export function deleteUser(req, res) {
    try {
        const { id } = req.params;

        // Prevent admin from deleting himself
        if (
            req.user &&
            String(req.user.id) ===
            String(id)
        ) {
            return res.status(400).json({
                message: "You cannot delete your own account",
            });
        }

        const existingUser = db
            .prepare(`
                SELECT id
                FROM users
                WHERE id = ?
            `)
            .get(id);

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        db.prepare(`
            DELETE FROM users
            WHERE id = ?
        `).run(id);

        return res.json({
            message: "User deleted successfully",
        });

    } catch (error) {
        console.error(
            "DELETE USER ERROR:",
            error.message
        );

        return res.status(500).json({
            message: "Failed to delete user",
            error: error.message,
        });
    }
}