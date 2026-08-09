import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import "./Students.css";

export default function Students() {
    const [students, setStudents] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);

    const initialForm = {
        studentId: "",
        name: "",
        email: "",
        phone: "",
        className: "",
        section: "",
    };

    const [form, setForm] = useState(initialForm);

    // Load students
    const loadStudents = async () => {
        try {
            const response = await api.get("/students");

            setStudents(response.data.students || []);
        } catch (error) {
            console.error("Load students error:", error);

            setMessage(
                error.response?.data?.message ||
                    "Failed to load students."
            );
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    // Form input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Open add form
    const handleAddClick = () => {
        setEditingId(null);
        setForm(initialForm);
        setMessage("");
        setShowForm(true);
    };

    // Open edit form
    const handleEdit = (student) => {
        setEditingId(student.id);

        setForm({
            studentId: student.student_id || "",
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
            className: student.class_name || "",
            section: student.section || "",
        });

        setMessage("");
        setShowForm(true);
    };

    // Close form
    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(initialForm);
    };

    // Add / Update student
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            if (editingId) {
                await api.put(
                    `/students/${editingId}`,
                    form
                );

                setMessage(
                    "Student updated successfully."
                );
            } else {
                await api.post("/students", form);

                setMessage(
                    "Student added successfully."
                );
            }

            setForm(initialForm);
            setEditingId(null);
            setShowForm(false);

            await loadStudents();
        } catch (error) {
            console.error("Student save error:", error);

            setMessage(
                error.response?.data?.message ||
                    "Failed to save student."
            );
        } finally {
            setLoading(false);
        }
    };

    // Delete student
    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            await api.delete(`/students/${id}`);

            await loadStudents();

            setMessage(
                "Student deleted successfully."
            );
        } catch (error) {
            console.error(
                "Delete student error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                    "Failed to delete student."
            );
        } finally {
            setLoading(false);
        }
    };

    // Search
    const filteredStudents = students.filter(
        (student) => {
            const text = search
                .toLowerCase()
                .trim();

            return (
                student.name
                    ?.toLowerCase()
                    .includes(text) ||
                student.student_id
                    ?.toLowerCase()
                    .includes(text) ||
                student.email
                    ?.toLowerCase()
                    .includes(text) ||
                student.class_name
                    ?.toLowerCase()
                    .includes(text) ||
                student.section
                    ?.toLowerCase()
                    .includes(text)
            );
        }
    );

    return (
        <div className="students-page">

            {/* Header */}
            <div className="students-header">

                <div>
                    <h1>Students</h1>

                    <p>
                        Manage students and their academic
                        information
                    </p>
                </div>

                <button
                    type="button"
                    className="add-student-button"
                    onClick={
                        showForm
                            ? handleCancel
                            : handleAddClick
                    }
                >
                    {showForm
                        ? "Close Form"
                        : "+ Add Student"}
                </button>

            </div>

            {/* Message */}
            {message && (
                <div className="students-message">
                    {message}
                </div>
            )}

            {/* Add / Edit Form */}
            {showForm && (
                <div className="student-form-card">

                    <div className="form-header">
                        <h2>
                            {editingId
                                ? "Edit Student"
                                : "Add New Student"}
                        </h2>

                        <p>
                            {editingId
                                ? "Update student information."
                                : "Enter the student's information below."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>
                                    Student ID
                                </label>

                                <input
                                    type="text"
                                    name="studentId"
                                    value={form.studentId}
                                    onChange={handleChange}
                                    placeholder="e.g. STU003"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Ahmed Khan"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="student@example.com"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Phone
                                </label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="03001234567"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Class / Program
                                </label>

                                <input
                                    type="text"
                                    name="className"
                                    value={form.className}
                                    onChange={handleChange}
                                    placeholder="BS Software Engineering"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Section
                                </label>

                                <input
                                    type="text"
                                    name="section"
                                    value={form.section}
                                    onChange={handleChange}
                                    placeholder="A"
                                />
                            </div>

                        </div>

                        <div className="form-actions">

                            <button
                                type="submit"
                                className="save-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Saving..."
                                    : editingId
                                    ? "Update Student"
                                    : "Add Student"}
                            </button>

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* Students Card */}
            <div className="students-card">

                <div className="students-card-header">

                    <div>
                        <h2>Student List</h2>

                        <p>
                            {students.length} registered
                            student
                            {students.length !== 1
                                ? "s"
                                : ""}
                        </p>
                    </div>

                    <div className="student-search">

                        <span>⌕</span>

                        <input
                            type="text"
                            placeholder="Search students..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>

                {/* Empty */}
                {filteredStudents.length === 0 ? (

                    <div className="empty-students">

                        <div className="empty-student-icon">
                            👨‍🎓
                        </div>

                        <h3>
                            {students.length === 0
                                ? "No students yet"
                                : "No students found"}
                        </h3>

                        <p>
                            {students.length === 0
                                ? "Add your first student to get started."
                                : "Try a different search."}
                        </p>

                        {students.length === 0 && (
                            <button
                                type="button"
                                onClick={handleAddClick}
                                className="empty-add-button"
                            >
                                + Add Student
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="students-table-container">

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
                                        Contact
                                    </th>

                                    <th>
                                        Class
                                    </th>

                                    <th>
                                        Section
                                    </th>

                                    <th>
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredStudents.map(
                                    (student) => (
                                        <tr
                                            key={student.id}
                                        >

                                            <td>
                                                <span className="student-id-badge">
                                                    {student.student_id}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="student-profile">

                                                    <div className="student-avatar">
                                                        {student.name
                                                            ?.charAt(
                                                                0
                                                            )
                                                            ?.toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {student.name}
                                                        </strong>

                                                        <small>
                                                            ID #
                                                            {student.id}
                                                        </small>
                                                    </div>

                                                </div>
                                            </td>

                                            <td>
                                                <div className="contact-info">

                                                    <span>
                                                        {student.email ||
                                                            "-"}
                                                    </span>

                                                    <small>
                                                        {student.phone ||
                                                            "No phone"}
                                                    </small>

                                                </div>
                                            </td>

                                            <td>
                                                {student.class_name ||
                                                    "-"}
                                            </td>

                                            <td>
                                                <span className="section-badge">
                                                    {student.section ||
                                                        "-"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="student-actions">

                                                    <button
                                                        type="button"
                                                        className="edit-button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                student
                                                            )
                                                        }
                                                        disabled={loading}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                student.id
                                                            )
                                                        }
                                                        disabled={loading}
                                                    >
                                                        Delete
                                                    </button>

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
