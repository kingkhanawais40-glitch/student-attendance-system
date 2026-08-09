import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import "./Dashboard.css";

export default function Dashboard() {
    const [students, setStudents] = useState([]);

    const [attendance, setAttendance] = useState({
        present: 0,
        absent: 0,
        attendanceRate: 0,
        marked: 0,
    });

    const [loading, setLoading] = useState(true);
    const [attendanceLoading, setAttendanceLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    useEffect(() => {
        loadDashboardData();
    }, []);

    async function loadDashboardData() {
        try {
            setLoading(true);
            setAttendanceLoading(true);

            const [studentsResponse, attendanceResponse] =
                await Promise.all([
                    api.get("/students"),
                    api.get("/attendance/summary"),
                ]);

            const studentList =
                studentsResponse.data?.students || [];

            const attendanceData =
                attendanceResponse.data || {};

            setStudents(studentList);

            setAttendance({
                present: Number(
                    attendanceData.present || 0
                ),

                absent: Number(
                    attendanceData.absent || 0
                ),

                attendanceRate: Number(
                    attendanceData.attendanceRate || 0
                ),

                marked: Number(
                    attendanceData.marked || 0
                ),
            });
        } catch (error) {
            console.error(
                "Failed to load dashboard:",
                error.response?.data || error.message
            );

            setStudents([]);

            setAttendance({
                present: 0,
                absent: 0,
                attendanceRate: 0,
                marked: 0,
            });
        } finally {
            setLoading(false);
            setAttendanceLoading(false);
        }
    }

    const totalStudents = students.length;

    const today = new Date().toLocaleDateString(
        "en-CA"
    );

    return (
        <div className="dashboard">

            {/* Header */}
            <div className="dashboard-header">

                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Welcome back,{" "}
                        {user?.name || "System Admin"}
                    </p>
                </div>

                <div className="header-date">
                    <span>Today</span>

                    <strong>
                        {new Date().toLocaleDateString(
                            "en-US",
                            {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                            }
                        )}
                    </strong>
                </div>

            </div>

            {/* Statistics */}
            <div className="stats-grid">

                {/* Total Students */}
                <div className="stat-card">

                    <div className="stat-content">

                        <span>Total Students</span>

                        <strong>
                            {loading
                                ? "..."
                                : totalStudents}
                        </strong>

                        <small>
                            Registered students
                        </small>

                    </div>

                    <div className="stat-icon students-stat">
                        👨‍🎓
                    </div>

                </div>

                {/* Present */}
                <div className="stat-card">

                    <div className="stat-content">

                        <span>Present Today</span>

                        <strong>
                            {attendanceLoading
                                ? "..."
                                : attendance.present}
                        </strong>

                        <small>
                            Attendance recorded
                        </small>

                    </div>

                    <div className="stat-icon present-stat">
                        ✓
                    </div>

                </div>

                {/* Absent */}
                <div className="stat-card">

                    <div className="stat-content">

                        <span>Absent Today</span>

                        <strong>
                            {attendanceLoading
                                ? "..."
                                : attendance.absent}
                        </strong>

                        <small>
                            Attendance recorded
                        </small>

                    </div>

                    <div className="stat-icon absent-stat">
                        !
                    </div>

                </div>

                {/* Attendance Rate */}
                <div className="stat-card">

                    <div className="stat-content">

                        <span>
                            Attendance Rate
                        </span>

                        <strong>
                            {attendanceLoading
                                ? "..."
                                : `${attendance.attendanceRate}%`}
                        </strong>

                        <small>
                            Today's attendance
                        </small>

                    </div>

                    <div className="stat-icon rate-stat">
                        %
                    </div>

                </div>

            </div>

            {/* Daily Attendance */}
            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Daily Attendance
                        </h2>

                        <p>
                            Today's attendance overview
                        </p>
                    </div>

                    <span>
                        Date: {today}
                    </span>

                </div>

                <div
                    style={{
                        padding: "20px",
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap",
                    }}
                >

                    <div>
                        <strong>
                            Marked:{" "}
                            {attendance.marked} /{" "}
                            {totalStudents}
                        </strong>
                    </div>

                    <div>
                        <strong>
                            {attendance.attendanceRate}%
                            {" "}Attendance
                        </strong>
                    </div>

                </div>

            </section>

            {/* Recent Students */}
            <section className="dashboard-section">

                <div className="section-header">

                    <div>
                        <h2>
                            Recent Students
                        </h2>

                        <p>
                            Recently registered students
                        </p>
                    </div>

                    <a
                        href="/students"
                        className="view-all"
                    >
                        View all
                    </a>

                </div>

                <div className="students-table-wrapper">

                    {loading ? (

                        <div className="empty-state">
                            <h3>
                                Loading students...
                            </h3>
                        </div>

                    ) : students.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                👨‍🎓
                            </div>

                            <h3>
                                No students yet
                            </h3>

                            <p>
                                Add your first student
                                to get started.
                            </p>

                        </div>

                    ) : (

                        <table className="students-table">

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
                                </tr>

                            </thead>

                            <tbody>

                                {students
                                    .slice(0, 5)
                                    .map(
                                        (student) => (

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

                                                    <div className="student-name">

                                                        <div className="student-avatar">
                                                            {student.name
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                ?.toUpperCase()}
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
                                                    <span className="status-badge">
                                                        Active
                                                    </span>
                                                </td>

                                            </tr>

                                        )
                                    )}

                            </tbody>

                        </table>

                    )}

                </div>

            </section>

            {/* Quick Actions */}
            <section className="quick-section">

                <h2>
                    Quick Actions
                </h2>

                <div className="quick-grid">

                    <a
                        href="/students"
                        className="quick-card"
                    >

                        <div className="quick-icon blue">
                            +
                        </div>

                        <div>
                            <strong>
                                Add Student
                            </strong>

                            <span>
                                Register a new student
                            </span>
                        </div>

                    </a>

                    <a
                        href="/attendance"
                        className="quick-card"
                    >

                        <div className="quick-icon green">
                            ✓
                        </div>

                        <div>
                            <strong>
                                Take Attendance
                            </strong>

                            <span>
                                Record today's attendance
                            </span>
                        </div>

                    </a>

                    <a
                        href="/reports"
                        className="quick-card"
                    >

                        <div className="quick-icon purple">
                            ↗
                        </div>

                        <div>
                            <strong>
                                View Reports
                            </strong>

                            <span>
                                Check attendance reports
                            </span>
                        </div>

                    </a>

                </div>

            </section>

        </div>
    );
}