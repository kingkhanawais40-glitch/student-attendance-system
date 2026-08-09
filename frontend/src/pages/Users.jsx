import React, { useEffect, useState } from "react";
import api from "../api/axios.js";

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

            const { data } =
                await api.get("/users");

            setUsers(data.users || []);
        } catch (err) {
            console.error(
                "LOAD USERS ERROR:",
                err
            );

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

            const { data } =
                await api.post("/users", {
                    name,
                    email,
                    password,
                    role,
                });

            setMessage(
                data.message ||
                    "User created successfully."
            );

            setName("");
            setEmail("");
            setPassword("");
            setRole("teacher");

            setShowForm(false);

            await loadUsers();
        } catch (err) {
            console.error(
                "CREATE USER ERROR:",
                err
            );

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

            const { data } =
                await api.delete(
                    `/users/${id}`
                );

            setMessage(
                data.message ||
                    "User deleted successfully."
            );

            await loadUsers();
        } catch (err) {
            console.error(
                "DELETE USER ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to delete user."
            );
        }
    }

    return (
        <div
            style={{
                padding: "30px",
            }}
        >
            {/* Header */}

            <div
                style={{
                    display: "flex",
                    justifyContent:
                        "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                    gap: "20px",
                }}
            >
                <div>
                    <h1>
                        Users / Staff
                    </h1>

                    <p
                        style={{
                            color: "#64748b",
                        }}
                    >
                        Manage system users and
                        staff accounts
                    </p>
                </div>

                <button
                    onClick={() =>
                        setShowForm(
                            !showForm
                        )
                    }
                    style={{
                        padding:
                            "12px 18px",
                        border: "none",
                        borderRadius:
                            "8px",
                        background:
                            "#2563eb",
                        color: "white",
                        cursor: "pointer",
                        fontWeight:
                            "600",
                    }}
                >
                    {showForm
                        ? "Cancel"
                        : "+ Add User"}
                </button>
            </div>

            {/* Messages */}

            {message && (
                <div
                    style={{
                        marginBottom: "15px",
                        padding: "12px",
                        background:
                            "#dcfce7",
                        color: "#166534",
                        borderRadius:
                            "8px",
                    }}
                >
                    {message}
                </div>
            )}

            {error && (
                <div
                    style={{
                        marginBottom: "15px",
                        padding: "12px",
                        background:
                            "#fee2e2",
                        color: "#b91c1c",
                        borderRadius:
                            "8px",
                    }}
                >
                    {error}
                </div>
            )}

            {/* Add User Form */}

            {showForm && (
                <div
                    style={{
                        background: "white",
                        padding: "25px",
                        borderRadius:
                            "12px",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.08)",
                        marginBottom:
                            "25px",
                        maxWidth: "650px",
                    }}
                >
                    <h2>
                        Add New User
                    </h2>

                    <form
                        onSubmit={
                            handleCreateUser
                        }
                        style={{
                            marginTop:
                                "20px",
                        }}
                    >
                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(
                                    e.target
                                        .value
                                )
                            }
                            required
                            style={{
                                width: "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "15px",
                                boxSizing:
                                    "border-box",
                                border:
                                    "1px solid #cbd5e1",
                                borderRadius:
                                    "8px",
                            }}
                        />

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(
                                    e.target
                                        .value
                                )
                            }
                            required
                            style={{
                                width: "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "15px",
                                boxSizing:
                                    "border-box",
                                border:
                                    "1px solid #cbd5e1",
                                borderRadius:
                                    "8px",
                            }}
                        />

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) =>
                                setPassword(
                                    e.target
                                        .value
                                )
                            }
                            required
                            minLength={6}
                            style={{
                                width: "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "15px",
                                boxSizing:
                                    "border-box",
                                border:
                                    "1px solid #cbd5e1",
                                borderRadius:
                                    "8px",
                            }}
                        />

                        <label>
                            Role
                        </label>

                        <select
                            value={role}
                            onChange={(e) =>
                                setRole(
                                    e.target
                                        .value
                                )
                            }
                            style={{
                                width: "100%",
                                padding:
                                    "12px",
                                marginTop:
                                    "6px",
                                marginBottom:
                                    "20px",
                                boxSizing:
                                    "border-box",
                                border:
                                    "1px solid #cbd5e1",
                                borderRadius:
                                    "8px",
                            }}
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

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding:
                                    "12px 20px",
                                border: "none",
                                borderRadius:
                                    "8px",
                                background:
                                    "#2563eb",
                                color:
                                    "white",
                                cursor:
                                    saving
                                        ? "not-allowed"
                                        : "pointer",
                                fontWeight:
                                    "600",
                            }}
                        >
                            {saving
                                ? "Creating..."
                                : "Create User"}
                        </button>
                    </form>
                </div>
            )}

            {/* Users Table */}

            <div
                style={{
                    background: "white",
                    borderRadius:
                        "12px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        padding: "20px",
                        borderBottom:
                            "1px solid #e2e8f0",
                    }}
                >
                    <h2>
                        System Users
                    </h2>

                    <p
                        style={{
                            color: "#64748b",
                            marginTop:
                                "5px",
                        }}
                    >
                        {users.length} users
                    </p>
                </div>

                {loading ? (
                    <div
                        style={{
                            padding: "40px",
                            textAlign:
                                "center",
                        }}
                    >
                        Loading users...
                    </div>
                ) : users.length ===
                  0 ? (
                    <div
                        style={{
                            padding: "40px",
                            textAlign:
                                "center",
                        }}
                    >
                        No users found.
                    </div>
                ) : (
                    <div
                        style={{
                            overflowX:
                                "auto",
                        }}
                    >
                        <table
                            style={{
                                width:
                                    "100%",
                                borderCollapse:
                                    "collapse",
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        background:
                                            "#f8fafc",
                                    }}
                                >
                                    <th
                                        style={{
                                            padding:
                                                "14px",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        ID
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "14px",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        Name
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "14px",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        Email
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "14px",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        Role
                                    </th>

                                    <th
                                        style={{
                                            padding:
                                                "14px",
                                            textAlign:
                                                "left",
                                        }}
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map(
                                    (user) => (
                                        <tr
                                            key={
                                                user.id
                                            }
                                            style={{
                                                borderTop:
                                                    "1px solid #e2e8f0",
                                            }}
                                        >
                                            <td
                                                style={{
                                                    padding:
                                                        "14px",
                                                }}
                                            >
                                                {
                                                    user.id
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "14px",
                                                }}
                                            >
                                                <strong>
                                                    {
                                                        user.name
                                                    }
                                                </strong>
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "14px",
                                                }}
                                            >
                                                {
                                                    user.email
                                                }
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "14px",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        padding:
                                                            "5px 10px",
                                                        borderRadius:
                                                            "20px",
                                                        background:
                                                            "#eff6ff",
                                                        color:
                                                            "#1d4ed8",
                                                        fontSize:
                                                            "13px",
                                                        fontWeight:
                                                            "600",
                                                    }}
                                                >
                                                    {
                                                        user.role
                                                    }
                                                </span>
                                            </td>

                                            <td
                                                style={{
                                                    padding:
                                                        "14px",
                                                }}
                                            >
                                                <button
                                                    onClick={() =>
                                                        handleDeleteUser(
                                                            user.id
                                                        )
                                                    }
                                                    style={{
                                                        padding:
                                                            "7px 12px",
                                                        border:
                                                            "none",
                                                        borderRadius:
                                                            "6px",
                                                        background:
                                                            "#fee2e2",
                                                        color:
                                                            "#b91c1c",
                                                        cursor:
                                                            "pointer",
                                                        fontWeight:
                                                            "600",
                                                    }}
                                                >
                                                    Delete
                                                </button>
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