import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import "./Reports.css";

export default function Reports() {
    const [records, setRecords] = useState([]);

    const [summary, setSummary] = useState({
        totalRecords: 0,
        present: 0,
        absent: 0,
        attendanceRate: 0,
    });

    const [students, setStudents] = useState([]);

    const [date, setDate] = useState("");
    const [studentId, setStudentId] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ==========================================
    // LOAD ATTENDANCE REPORT
    // ==========================================

    async function loadReport(
        selectedDate = "",
        selectedStudentId = ""
    ) {
        try {
            setLoading(true);
            setMessage("");

            const params = new URLSearchParams();

            if (selectedDate) {
                params.append(
                    "date",
                    selectedDate
                );
            }

            if (selectedStudentId) {
                params.append(
                    "studentId",
                    selectedStudentId
                );
            }

            const queryString =
                params.toString();

            const url = queryString
                ? `/reports/attendance?${queryString}`
                : "/reports/attendance";

            const { data } =
                await api.get(url);

            console.log(
                "REPORT RESPONSE:",
                data
            );

            setRecords(
                data.records || []
            );

            setSummary(
                data.summary || {
                    totalRecords: 0,
                    present: 0,
                    absent: 0,
                    attendanceRate: 0,
                }
            );
        } catch (error) {
            console.error(
                "REPORTS ERROR:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                    "Failed to load attendance report."
            );

            setRecords([]);

            setSummary({
                totalRecords: 0,
                present: 0,
                absent: 0,
                attendanceRate: 0,
            });
        } finally {
            setLoading(false);
        }
    }

    // ==========================================
    // LOAD STUDENTS
    // ==========================================

    async function loadStudents() {
        try {
            const { data } =
                await api.get("/students");

            setStudents(
                data.students || []
            );
        } catch (error) {
            console.error(
                "STUDENTS LOAD ERROR:",
                error
            );

            setStudents([]);
        }
    }

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        loadStudents();
        loadReport("", "");
    }, []);

    // ==========================================
    // DATE FILTER
    // ==========================================

    function handleDateChange(e) {
        const selectedDate =
            e.target.value;

        setDate(selectedDate);

        loadReport(
            selectedDate,
            studentId
        );
    }

    // ==========================================
    // STUDENT FILTER
    // ==========================================

    function handleStudentChange(e) {
        const selectedStudentId =
            e.target.value;

        setStudentId(
            selectedStudentId
        );

        loadReport(
            date,
            selectedStudentId
        );
    }

    // ==========================================
    // CLEAR ALL FILTERS
    // ==========================================

    function clearFilter() {
        setDate("");
        setStudentId("");

        loadReport("", "");
    }

    return (
        <div className="reports-page">

            {/* HEADER */}

            <div className="reports-header">

                <div>
                    <h1>
                        Attendance Reports
                    </h1>

                    <p>
                        View and analyze student
                        attendance records
                    </p>
                </div>

                {/* FILTERS */}

                <div className="reports-filter">

                    {/* Date */}

                    <input
                        type="date"
                        value={date}
                        onChange={
                            handleDateChange
                        }
                    />

                    {/* Student */}

                    <select
                        value={studentId}
                        onChange={
                            handleStudentChange
                        }
                    >
                        <option value="">
                            All Students
                        </option>

                        {students.map(
                            (student) => (
                                <option
                                    key={
                                        student.id
                                    }
                                    value={
                                        student.id
                                    }
                                >
                                    {
                                        student.student_id
                                    }{" "}
                                    -{" "}
                                    {
                                        student.name
                                    }
                                </option>
                            )
                        )}
                    </select>

                    {/* Clear */}

                    <button
                        onClick={
                            clearFilter
                        }
                    >
                        All
                    </button>

                </div>

            </div>

            {/* MESSAGE */}

            {message && (
                <div className="reports-message">
                    {message}
                </div>
            )}

            {/* STATISTICS */}

            <div className="reports-stats">

                <div className="report-card total">

                    <div>
                        <span>
                            Total Records
                        </span>

                        <strong>
                            {
                                summary.totalRecords
                            }
                        </strong>
                    </div>

                    <div className="report-icon">
                        📋
                    </div>

                </div>

                <div className="report-card present">

                    <div>
                        <span>
                            Present
                        </span>

                        <strong>
                            {
                                summary.present
                            }
                        </strong>
                    </div>

                    <div className="report-icon">
                        ✓
                    </div>

                </div>

                <div className="report-card absent">

                    <div>
                        <span>
                            Absent
                        </span>

                        <strong>
                            {
                                summary.absent
                            }
                        </strong>
                    </div>

                    <div className="report-icon">
                        !
                    </div>

                </div>

                <div className="report-card rate">

                    <div>
                        <span>
                            Attendance Rate
                        </span>

                        <strong>
                            {
                                summary.attendanceRate
                            }%
                        </strong>
                    </div>

                    <div className="report-icon">
                        %
                    </div>

                </div>

            </div>

            {/* REPORT TABLE */}

            <div className="reports-panel">

                <div className="reports-panel-header">

                    <div>

                        <h2>
                            Attendance Records
                        </h2>

                        <p>
                            {date ||
                            studentId
                                ? "Filtered attendance records"
                                : "All attendance records"}
                        </p>

                    </div>

                    <span>
                        {
                            records.length
                        }{" "}
                        Records
                    </span>

                </div>

                {/* LOADING */}

                {loading ? (

                    <div className="reports-empty">
                        Loading attendance
                        reports...
                    </div>

                ) : records.length === 0 ? (

                    <div className="reports-empty">
                        No attendance
                        records found.
                    </div>

                ) : (

                    <div className="reports-table-wrapper">

                        <table className="reports-table">

                            <thead>

                                <tr>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Student ID
                                    </th>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Email
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

                                {records.map(
                                    (record) => (

                                        <tr
                                            key={
                                                record.id
                                            }
                                        >

                                            {/* Date */}

                                            <td>
                                                {
                                                    record.date
                                                }
                                            </td>

                                            {/* Student ID */}

                                            <td>

                                                <span className="student-id">
                                                    {
                                                        record.student_id
                                                    }
                                                </span>

                                            </td>

                                            {/* Student */}

                                            <td>

                                                <strong>
                                                    {
                                                        record.name
                                                    }
                                                </strong>

                                            </td>

                                            {/* Email */}

                                            <td>
                                                {
                                                    record.email ||
                                                    "-"
                                                }
                                            </td>

                                            {/* Class */}

                                            <td>
                                                {
                                                    record.class_name ||
                                                    "-"
                                                }
                                            </td>

                                            {/* Section */}

                                            <td>

                                                <span className="section-badge">
                                                    {
                                                        record.section ||
                                                        "-"
                                                    }
                                                </span>

                                            </td>

                                            {/* Status */}

                                            <td>

                                                {record.status ===
                                                "present" ? (

                                                    <span className="status-present">
                                                        Present
                                                    </span>

                                                ) : (

                                                    <span className="status-absent">
                                                        Absent
                                                    </span>

                                                )}

                                            </td>

                                            {/* MARKED BY */}

                                            <td>

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        flexDirection:
                                                            "column",
                                                        gap: "2px",
                                                    }}
                                                >

                                                    <strong>
                                                        {
                                                            record.marked_by_name ||
                                                            "-"
                                                        }
                                                    </strong>

                                                    {record.marked_by_role && (
                                                        <small
                                                            style={{
                                                                color:
                                                                    "#64748b",
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                        >
                                                            {
                                                                record.marked_by_role
                                                            }
                                                        </small>
                                                    )}

                                                </div>

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