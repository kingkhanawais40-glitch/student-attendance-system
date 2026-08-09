import db from "../config/database.js";

// Get attendance for a specific date
export function getAttendance(req, res) {
    try {
        const date =
            req.query.date ||
            new Date().toISOString().split("T")[0];

        const students = db
            .prepare(`
                SELECT
                    s.id,
                    s.student_id,
                    s.name,
                    s.email,
                    s.class_name,
                    s.section,
                    a.status
                FROM students s
                LEFT JOIN attendance a
                    ON a.student_id = s.id
                    AND a.date = ?
                ORDER BY s.name ASC
            `)
            .all(date);

        res.json({
            date,
            students,
        });
    } catch (error) {
        console.error("GET ATTENDANCE ERROR:", error);

        res.status(500).json({
            message: "Failed to get attendance",
        });
    }
}

// Save attendance
export function saveAttendance(req, res) {
    try {
        const { date, attendance } = req.body;

        if (!date) {
            return res.status(400).json({
                message: "Date is required",
            });
        }

        if (!Array.isArray(attendance)) {
            return res.status(400).json({
                message: "Attendance must be an array",
            });
        }

        const save = db.transaction(() => {
            for (const record of attendance) {
                const studentId = record.studentId;
                const status = record.status;

                if (!studentId || !status) {
                    continue;
                }

                if (
                    status !== "present" &&
                    status !== "absent"
                ) {
                    continue;
                }

                db.prepare(`
                    INSERT INTO attendance
                    (
                        student_id,
                        date,
                        status,
                        marked_by
                    )
                    VALUES (?, ?, ?, ?)
                    ON CONFLICT(student_id, date)
                    DO UPDATE SET
                        status = excluded.status,
                        marked_by = excluded.marked_by
                `).run(
                    studentId,
                    date,
                    status,
                    req.user.id
                );
            }
        });

        save();

        res.json({
            message: "Attendance saved successfully",
        });
    } catch (error) {
        console.error("SAVE ATTENDANCE ERROR:", error);

        res.status(500).json({
            message: error.message ||
                "Failed to save attendance",
        });
    }
}
export function getAttendanceHistory(req, res) {
    try {
        const { date } = req.query;

        let history;

        if (date) {
            history = db
                .prepare(`
                    SELECT
                        a.id,
                        a.date,
                        a.status,
                        a.marked_by,
                        u.name AS marked_by_name,
                        s.student_id,
                        s.name,
                        s.class_name,
                        s.section
                    FROM attendance a
                    INNER JOIN students s
                        ON s.id = a.student_id
                    LEFT JOIN users u
                        ON u.id = a.marked_by
                    WHERE a.date = ?
                    ORDER BY s.name ASC
                `)
                .all(date);
        } else {
            history = db
                .prepare(`
                    SELECT
                        a.id,
                        a.date,
                        a.status,
                        a.marked_by,
                        u.name AS marked_by_name,
                        s.student_id,
                        s.name,
                        s.class_name,
                        s.section
                    FROM attendance a
                    INNER JOIN students s
                        ON s.id = a.student_id
                    LEFT JOIN users u
                        ON u.id = a.marked_by
                    ORDER BY a.date DESC, s.name ASC
                `)
                .all();
        }

        res.json({
            history,
        });

    } catch (error) {
        console.error(
            "GET ATTENDANCE HISTORY ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to get attendance history",
        });
    }
}
export function getTodayAttendanceSummary(req, res) {
    try {
        const date =
            req.query.date ||
            new Date().toISOString().split("T")[0];

        const totalStudents = db
            .prepare(
                "SELECT COUNT(*) AS total FROM students"
            )
            .get().total;

        const present = db
            .prepare(`
                SELECT COUNT(*) AS total
                FROM attendance
                WHERE date = ?
                AND status = 'present'
            `)
            .get(date).total;

        const absent = db
            .prepare(`
                SELECT COUNT(*) AS total
                FROM attendance
                WHERE date = ?
                AND status = 'absent'
            `)
            .get(date).total;

        const marked = present + absent;

        const attendanceRate =
            totalStudents > 0 ?
            Number(
                (
                    (present / totalStudents) *
                    100
                ).toFixed(2)
            ) :
            0;

        res.json({
            date,
            totalStudents,
            present,
            absent,
            marked,
            attendanceRate,
        });
    } catch (error) {
        console.error(
            "TODAY ATTENDANCE SUMMARY ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to get attendance summary",
        });
    }
}