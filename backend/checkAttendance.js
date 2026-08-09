import db from "./src/config/database.js";

const records = db.prepare(`
    SELECT
        a.id,
        a.student_id,
        a.date,
        a.status,
        a.marked_by,
        u.name AS marked_by_name,
        u.email AS marked_by_email
    FROM attendance a
    LEFT JOIN users u
        ON u.id = a.marked_by
    ORDER BY a.date DESC, a.id DESC
`).all();

console.table(records);