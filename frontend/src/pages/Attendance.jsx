import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import "./Attendance.css";

export default function Attendance() {
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});

    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyDate, setHistoryDate] = useState("");

    // =========================
    // LOAD ATTENDANCE
    // =========================

    async function loadAttendance(selectedDate = date) {
        try {
            setLoading(true);
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                setMessage(
                    "Authentication token not found. Please login again."
                );
                return;
            }

            console.log("Attendance request token exists:", true);

            const { data } = await api.get(
                `/attendance?date=${selectedDate}`
            );

            console.log("Attendance API response:", data);

            const studentList = data.students || [];

            setStudents(studentList);

            const existing = {};

            studentList.forEach((student) => {
                if (student.status) {
                    existing[student.id] = student.status;
                }
            });

            setAttendance(existing);
        } catch (error) {
            console.error("Attendance error:", error);

            console.log(
                "Attendance status:",
                error.response?.status
            );

            console.log(
                "Attendance response:",
                error.response?.data
            );

            setMessage(
                error.response?.data?.message ||
                    "Failed to load attendance."
            );
        } finally {
            setLoading(false);
        }
    }

    // =========================
    // LOAD HISTORY
    // =========================

    async function loadHistory(selectedDate = "") {
        try {
            setHistoryLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                setMessage(
                    "Authentication token not found. Please login again."
                );
                return;
            }

            const url = selectedDate
                ? `/attendance/history?date=${selectedDate}`
                : "/attendance/history";

            const { data } = await api.get(url);

            console.log("History API response:", data);

            setHistory(data.history || []);
        } catch (error) {
            console.error("History error:", error);

            console.log(
                "History status:",
                error.response?.status
            );

            console.log(
                "History response:",
                error.response?.data
            );

            setMessage(
                error.response?.data?.message ||
                    "Failed to load attendance history."
            );
        } finally {
            setHistoryLoading(false);
        }
    }

    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {
        loadAttendance();
        loadHistory();
    }, []);

    // =========================
    // DATE CHANGE
    // =========================

    function handleDateChange(event) {
        const selectedDate = event.target.value;

        setDate(selectedDate);
        loadAttendance(selectedDate);
    }

    // =========================
    // HISTORY DATE
    // =========================

    function handleHistoryDateChange(event) {
        const selectedDate = event.target.value;

        setHistoryDate(selectedDate);
        loadHistory(selectedDate);
    }

    // =========================
    // MARK ATTENDANCE
    // =========================

    function markAttendance(studentId, status) {
        setAttendance((previous) => ({
            ...previous,
            [studentId]: status,
        }));
    }

    // =========================
    // SAVE ATTENDANCE
    // =========================

    async function saveAttendance() {
        try {
            setSaving(true);
            setMessage("");

            const token = localStorage.getItem("token");

            if (!token) {
                setMessage(
                    "Authentication token not found. Please login again."
                );
                return;
            }

            const records = students
                .filter(
                    (student) =>
                        attendance[student.id]
                )
                .map((student) => ({
                    studentId: student.id,
                    status: attendance[student.id],
                }));

            if (records.length === 0) {
                setMessage(
                    "Please mark attendance first."
                );
                return;
            }

            console.log("Saving attendance:", {
                date,
                attendance: records,
            });

            const { data } = await api.post(
                "/attendance",
                {
                    date,
                    attendance: records,
                }
            );

            console.log(
                "Save attendance response:",
                data
            );

            setMessage(
                data.message ||
                    "Attendance saved successfully."
            );

            await loadAttendance(date);
            await loadHistory(historyDate);
        } catch (error) {
            console.error(
                "Save attendance error:",
                error
            );

            console.log(
                "Save status:",
                error.response?.status
            );

            console.log(
                "Save response:",
                error.response?.data
            );

            setMessage(
                error.response?.data?.message ||
                    "Failed to save attendance."
            );
        } finally {
            setSaving(false);
        }
    }

    // =========================
    // STATISTICS
    // =========================

    const presentCount = students.filter(
        (student) =>
            attendance[student.id] === "present"
    ).length;

    const absentCount = students.filter(
        (student) =>
            attendance[student.id] === "absent"
    ).length;

    const markedCount =
        presentCount + absentCount;

    const attendanceRate =
        students.length > 0
            ? Math.round(
                  (presentCount /
                      students.length) *
                      100
              )
            : 0;

    // =========================
    // UI
    // =========================

    return (
        <div className="attendance-page">

            {/* HEADER */}

            <div className="attendance-header">

                <div>
                    <h1>Attendance</h1>

                    <p>
                        Mark and manage daily student
                        attendance
                    </p>
                </div>

                <div className="attendance-actions">

                    <input
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                    />

                    <button
                        onClick={saveAttendance}
                        disabled={
                            saving || loading
                        }
                    >
                        {saving
                            ? "Saving..."
                            : "Save Attendance"}
                    </button>

                </div>

            </div>

            {/* MESSAGE */}

            {message && (
                <div className="attendance-message">
                    {message}
                </div>
            )}

            {/* STATISTICS */}

            <div className="attendance-stats">

                <div className="stat-card">
                    <span>
                        Total Students
                    </span>

                    <strong>
                        {students.length}
                    </strong>
                </div>

                <div className="stat-card present-card">
                    <span>Present</span>

                    <strong>
                        {presentCount}
                    </strong>
                </div>

                <div className="stat-card absent-card">
                    <span>Absent</span>

                    <strong>
                        {absentCount}
                    </strong>
                </div>

                <div className="stat-card rate-card">
                    <span>
                        Attendance Rate
                    </span>

                    <strong>
                        {attendanceRate}%
                    </strong>
                </div>

            </div>

            {/* DAILY ATTENDANCE */}

            <div className="attendance-box">

                <div className="box-header">

                    <div>
                        <h2>
                            Daily Attendance
                        </h2>

                        <p>
                            Date: {date}
                        </p>
                    </div>

                    <span>
                        Marked:{" "}
                        <strong>
                            {markedCount}
                        </strong>{" "}
                        / {students.length}
                    </span>

                </div>

                {loading ? (

                    <div className="empty-message">
                        Loading students...
                    </div>

                ) : students.length === 0 ? (

                    <div className="empty-message">
                        No students found.
                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>
                                <tr>
                                    <th>
                                        Student ID
                                    </th>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Class
                                    </th>

                                    <th>
                                        Section
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Marked By
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {students.map(
                                    (student) => {

                                        const status =
                                            attendance[
                                                student.id
                                            ];

                                        return (
                                            <tr
                                                key={
                                                    student.id
                                                }
                                            >

                                                <td>
                                                    <span className="student-id">
                                                        {
                                                            student.student_id
                                                        }
                                                    </span>
                                                </td>

                                                <td>

                                                    <div className="student-info">

                                                        <div className="avatar">
                                                            {student.name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}
                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    student.name
                                                                }
                                                            </strong>

                                                            <small>
                                                                {student.email ||
                                                                    "No email"}
                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td>
                                                    {student.class_name ||
                                                        "-"}
                                                </td>

                                                <td>
                                                    {student.section ||
                                                        "-"}
                                                </td>

                                                <td>

                                                    <div className="status-buttons">

                                                        <button
                                                            className={
                                                                status ===
                                                                "present"
                                                                    ? "present active"
                                                                    : "present"
                                                            }
                                                            onClick={() =>
                                                                markAttendance(
                                                                    student.id,
                                                                    "present"
                                                                )
                                                            }
                                                        >
                                                            Present
                                                        </button>

                                                        <button
                                                            className={
                                                                status ===
                                                                "absent"
                                                                    ? "absent active"
                                                                    : "absent"
                                                            }
                                                            onClick={() =>
                                                                markAttendance(
                                                                    student.id,
                                                                    "absent"
                                                                )
                                                            }
                                                        >
                                                            Absent
                                                        </button>

                                                    </div>

                                                </td>

                                                <td>
                                                    {student.marked_by_name ||
                                                        student.marked_by ||
                                                        "-"}
                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* HISTORY */}

            <div className="attendance-box">

                <div className="box-header history-header">

                    <div>

                        <h2>
                            Attendance History
                        </h2>

                        <p>
                            View previously saved
                            attendance records
                        </p>

                    </div>

                    <div className="history-actions">

                        <input
                            type="date"
                            value={historyDate}
                            onChange={
                                handleHistoryDateChange
                            }
                        />

                        <button
                            onClick={() => {
                                setHistoryDate("");
                                loadHistory();
                            }}
                        >
                            All
                        </button>

                    </div>

                </div>

                {historyLoading ? (

                    <div className="empty-message">
                        Loading attendance history...
                    </div>

                ) : history.length === 0 ? (

                    <div className="empty-message">
                        No attendance records found.
                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>
                                    <th>Date</th>
                                    <th>Student ID</th>
                                    <th>Student</th>
                                    <th>Class</th>
                                    <th>Section</th>
                                    <th>Status</th>
                                    <th>Marked By</th>
                                </tr>

                            </thead>

                            <tbody>

                                {history.map(
                                    (record) => (
                                        <tr
                                            key={
                                                record.id
                                            }
                                        >

                                            <td>
                                                {
                                                    record.date
                                                }
                                            </td>

                                            <td>
                                                <span className="student-id">
                                                    {
                                                        record.student_id
                                                    }
                                                </span>
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        record.name
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    record.class_name ||
                                                    "-"
                                                }
                                            </td>

                                            <td>
                                                {
                                                    record.section ||
                                                    "-"
                                                }
                                            </td>

                                            <td>

                                                {record.status ===
                                                "present" ? (

                                                    <span className="history-present">
                                                        Present
                                                    </span>

                                                ) : (

                                                    <span className="history-absent">
                                                        Absent
                                                    </span>

                                                )}

                                            </td>

                                            <td>
                                                {record.marked_by_name ||
                                                    record.marked_by ||
                                                    "-"}
                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}