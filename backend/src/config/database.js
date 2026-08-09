import Database from "better-sqlite3";

const db = new Database("attendance.sqlite");

// Foreign keys ON
db.pragma("foreign_keys = ON");

// Users table
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (
      role IN ('admin', 'teacher', 'student')
    ),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Students table
db.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    class_name TEXT,
    section TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Attendance table
db.exec(`
  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    student_id INTEGER NOT NULL,

    date TEXT NOT NULL,

    status TEXT NOT NULL CHECK (
      status IN ('present', 'absent')
    ),

    marked_by INTEGER,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (student_id)
      REFERENCES students(id)
      ON DELETE CASCADE,

    FOREIGN KEY (marked_by)
      REFERENCES users(id)
      ON DELETE SET NULL,

    UNIQUE(student_id, date)
  );
`);

console.log("Database connected successfully");

export default db;