import db from "../config/database.js";

// Get all students
export function getStudents(req, res) {
    try {
        const students = db
            .prepare(`
SELECT *
    FROM students
ORDER BY id DESC
    `)
            .all();

        res.json({
            students,
        });
    } catch (error) {
        console.error("GET STUDENTS ERROR:", error);

        res.status(500).json({
            message: "Failed to get students",
        });
    }
}

// Add student
export function createStudent(req, res) {
    try {
        const {
            studentId,
            name,
            email,
            phone,
            className,
            section,
        } = req.body;

        if (!studentId || !name) {
            return res.status(400).json({
                message: "Student ID and name are required",
            });
        }

        const result = db
            .prepare(`
INSERT INTO students
    (
        student_id,
        name,
        email,
        phone,
        class_name,
        section
    )
VALUES( ? , ? , ? , ? , ? , ? )
`)
            .run(
                studentId,
                name,
                email || null,
                phone || null,
                className || null,
                section || null
            );

        const student = db
            .prepare(
                "SELECT * FROM students WHERE id = ?"
            )
            .get(result.lastInsertRowid);

        res.status(201).json({
            message: "Student added successfully",
            student,
        });
    } catch (error) {
        console.error(
            "CREATE STUDENT ERROR:",
            error
        );

        if (
            error.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {
            return res.status(400).json({
                message: "Student ID already exists",
            });
        }

        res.status(500).json({
            message: error.message ||
                "Failed to add student",
        });
    }
}

// Update student
export function updateStudent(req, res) {
    try {
        const { id } = req.params;

        const {
            studentId,
            name,
            email,
            phone,
            className,
            section,
        } = req.body;

        if (!studentId || !name) {
            return res.status(400).json({
                message: "Student ID and name are required",
            });
        }

        // Check whether student exists
        const existingStudent = db
            .prepare(
                "SELECT * FROM students WHERE id = ?"
            )
            .get(id);

        if (!existingStudent) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        // Update student
        db.prepare(`
UPDATE students
SET
student_id = ? ,
    name = ? ,
    email = ? ,
    phone = ? ,
    class_name = ? ,
    section = ?
    WHERE id = ?
    `).run(
            studentId,
            name,
            email || null,
            phone || null,
            className || null,
            section || null,
            id
        );

        // Get updated student
        const student = db
            .prepare(
                "SELECT * FROM students WHERE id = ?"
            )
            .get(id);

        res.json({
            message: "Student updated successfully",
            student,
        });
    } catch (error) {
        console.error(
            "UPDATE STUDENT ERROR:",
            error
        );

        if (
            error.code ===
            "SQLITE_CONSTRAINT_UNIQUE"
        ) {
            return res.status(400).json({
                message: "Student ID already exists",
            });
        }

        res.status(500).json({
            message: error.message ||
                "Failed to update student",
        });
    }
}

// Delete student
export function deleteStudent(req, res) {
    try {
        const { id } = req.params;

        const result = db
            .prepare(
                "DELETE FROM students WHERE id = ?"
            )
            .run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Student not found",
            });
        }

        res.json({
            message: "Student deleted successfully",
        });
    } catch (error) {
        console.error(
            "DELETE STUDENT ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to delete student",
        });
    }
}