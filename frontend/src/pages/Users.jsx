import React, { useEffect, useState } from "react";
import api from "../api/axios.js";
import "./Users.css";

export default function Users() {
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("teacher");

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoading(true);
            setError("");

            const { data } = await api.get("/users");

            setUsers(data.users || []);
        } catch (err) {
            console.error("LOAD USERS ERROR:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to load users."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateUser(e) {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            setSaving(true);

            const { data } = await api.post("/users", {
                name,
                email,
                password,
                role,
            });

            setMessage(
                data.message || "User created successfully."
            );

            setName("");
            setEmail("");
            setPassword("");
            setRole("teacher");

            setShowForm(false);

            await loadUsers();
        } catch (err) {
            console.error("CREATE USER ERROR:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to create user."
            );
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteUser(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setMessage("");

            const { data } = await api.delete(`/users/${id}`);

            setMessage(
                data.message || "User deleted successfully."
            );

            await loadUsers();
        } catch (err) {
            console.error("DELETE USER ERROR:", err);

            setError(
                err.response?.data?.message ||
                    "Failed to delete user."
            );
        }
    }

    return (
        <div className="users-page">

            {/* Background decoration */}
            <div className="users-bg-orb users-bg-orb-one"></div>
            <div className="users-bg-orb users-bg-orb-two"></div>

            {/* HEADER */}
            <div className="users-header">

                <div>
                    <h1>Users / Staff</h1>

                    <p>
                        Manage system users and staff accounts
                    </p>
                </div>

                <button
                    type="button"
                    className="users-add-button"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? "Close Form" : "+ Add User"}
                </button>

            </div>

            {/* MESSAGES */}

            {message && (
                <div className="users-message users-success">
                    <span className="message-icon">✓</span>
                    {message}
                </div>
            )}

            {error && (
                <div className="users-message users-error">
                    <span className="message-icon">!</span>
                    {error}
                </div>
            )}

            {/* ADD USER FORM */}

            {showForm && (
                <div className="users-form-card">

                    <div className="users-form-header">

                        <div className="users-form-icon">
                            +
                        </div>

                        <div>
                            <h2>Add New User</h2>

                            <p>
                                Create a new system or staff account.
                            </p>
                        </div>

                    </div>

                    <form onSubmit={handleCreateUser}>

                        <div className="users-form-grid">

                            {/* NAME */}

                            <div className="users-form-group">
                                <label htmlFor="user-name">
                                    Full Name
                                </label>

                                <input
                                    id="user-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>

                            {/* EMAIL */}

                            <div className="users-form-group">
                                <label htmlFor="user-email">
                                    Email
                                </label>

                                <input
                                    id="user-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="user@example.com"
                                    required
                                />
                            </div>

                            {/* PASSWORD */}

                            <div className="users-form-group">
                                <label htmlFor="user-password">
                                    Password
                                </label>

                                <input
                                    id="user-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Minimum 6 characters"
                                    minLength={6}
                                    required
                                />
                            </div>

                            {/* ROLE */}

                            <div className="users-form-group">
                                <label htmlFor="user-role">
                                    Role
                                </label>

                                <select
                                    id="user-role"
                                    value={role}
                                    onChange={(e) =>
                                        setRole(e.target.value)
                                    }
                                >
                                    <option value="teacher">
                                        Teacher
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>

                                    <option value="student">
                                        Student
                                    </option>
                                </select>
                            </div>

                        </div>

                        <div className="users-form-actions">

                            <button
                                type="submit"
                                className="users-create-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Creating..."
                                    : "Create User"}
                            </button>

                            <button
                                type="button"
                                className="users-cancel-button"
                                onClick={() => setShowForm(false)}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* USERS CARD */}

            <div className="users-card">

                <div className="users-card-header">

                    <div className="users-card-title">

                        <div className="users-title-icon">
                            👥
                        </div>

                        <div>
                            <h2>System Users</h2>

                            <p>
                                {users.length} registered user
                                {users.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                    </div>

                    <div className="users-count-badge">
                        {users.length} Users
                    </div>

                </div>

                {/* LOADING */}

                {loading ? (
                    <div className="users-empty">
                        <div className="users-loading-icon">
                            ⟳
                        </div>

                        <h3>Loading users...</h3>

                        <p>
                            Please wait while user records are loaded.
                        </p>
                    </div>

                ) : users.length === 0 ? (

                    /* EMPTY */

                    <div className="users-empty">

                        <div className="users-empty-icon">
                            👤
                        </div>

                        <h3>No users found</h3>

                        <p>
                            Create your first system user to get started.
                        </p>

                        <button
                            type="button"
                            className="users-empty-button"
                            onClick={() => setShowForm(true)}
                        >
                            + Add User
                        </button>

                    </div>

                ) : (

                    /* TABLE */

                    <div className="users-table-wrapper">

                        <table className="users-table">

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {users.map((user) => {

                                    const initials = (
                                        user.name || "User"
                                    )
                                        .split(" ")
                                        .map((word) =>
                                            word.charAt(0)
                                        )
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase();

                                    return (
                                        <tr key={user.id}>

                                            <td>
                                                <span className="user-id-badge">
                                                    #{user.id}
                                                </span>
                                            </td>

                                            <td>

                                                <div className="user-profile">

                                                    <div className="user-avatar">
                                                        {initials}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {user.name}
                                                        </strong>

                                                        <small>
                                                            System Account
                                                        </small>
                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                <div className="user-email">
                                                    {user.email}
                                                </div>

                                            </td>

                                            <td>

                                                <span
                                                    className={`user-role-badge role-${user.role}`}
                                                >
                                                    <span className="role-dot"></span>

                                                    {user.role}
                                                </span>

                                            </td>

                                            <td>

                                                <button
                                                    type="button"
                                                    className="users-delete-button"
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
}