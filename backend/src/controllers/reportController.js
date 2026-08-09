import db from "../config/database.js";

// Get attendance report
export function getAttendanceReport(req, res) {
    try {
        const {
            date,
            studentId,
        } = req.query;

        let query = `
            SELECT
                a.id,
                a.date,
                a.status,

                s.id AS student_db_id,
                s.student_id,
                s.name,
                s.email,
                s.class_name,
                s.section,

                a.marked_by,
                u.name AS marked_by_name,
                u.email AS marked_by_email,
                u.role AS marked_by_role

            FROM attendance a

            INNER JOIN students s
                ON s.id = a.student_id

            LEFT JOIN users u
                ON u.id = a.marked_by
        `;

        const conditions = [];
        const params = [];

        // =========================
        // DATE FILTER
        // =========================

        if (date) {
            conditions.push("a.date = ?");
            params.push(date);
        }

        // =========================
        // STUDENT FILTER
        // =========================

        if (studentId) {
            conditions.push("s.id = ?");
            params.push(studentId);
        }

        if (conditions.length > 0) {
            query += `
                WHERE ${conditions.join(" AND ")}
            `;
        }

        // =========================
        // ORDER
        // =========================

        query += `
            ORDER BY
                a.date DESC,
                s.name ASC
        `;

        const records = db
            .prepare(query)
            .all(...params);

        // =========================
        // OVERALL SUMMARY
        // =========================

        const totalRecords =
            records.length;

        const present = records.filter(
            (record) =>
            record.status === "present"
        ).length;

        const absent = records.filter(
            (record) =>
            record.status === "absent"
        ).length;

        const attendanceRate =
            totalRecords > 0 ?
            Math.round(
                (present /
                    totalRecords) *
                100
            ) :
            0;

        // =========================
        // STUDENT-WISE SUMMARY
        // =========================

        const studentMap = new Map();

        for (const record of records) {
            const id =
                record.student_db_id;

            if (!studentMap.has(id)) {
                studentMap.set(id, {
                    studentId: record.student_id,

                    name: record.name,

                    email: record.email,

                    className: record.class_name,

                    section: record.section,

                    totalRecords: 0,

                    present: 0,

                    absent: 0,

                    attendanceRate: 0,
                });
            }

            const student =
                studentMap.get(id);

            student.totalRecords++;

            if (
                record.status ===
                "present"
            ) {
                student.present++;
            }

            if (
                record.status ===
                "absent"
            ) {
                student.absent++;
            }
        }

        // =========================
        // STUDENT PERCENTAGE
        // =========================

        const studentSummary =
            Array.from(
                studentMap.values()
            ).map((student) => ({
                ...student,

                attendanceRate: student.totalRecords > 0 ?
                    Math.round(
                        (student.present /
                            student.totalRecords) *
                        100
                    ) : 0,
            }));

        // =========================
        // RESPONSE
        // =========================

        res.json({
            summary: {
                totalRecords,
                present,
                absent,
                attendanceRate,
            },

            studentSummary,

            records,
        });
    } catch (error) {
        console.error(
            "GET ATTENDANCE REPORT ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to get attendance report",
        });
    }
}