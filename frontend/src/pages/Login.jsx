import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const { data } = await api.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );

            // Make sure backend returned token
            if (!data.token) {
                throw new Error(
                    "Login token was not received."
                );
            }

            // Save JWT token
            localStorage.setItem(
                "token",
                data.token
            );

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Go to dashboard
            navigate("/dashboard");
        } catch (err) {
            console.error(
                "LOGIN ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#f1f5f9",
                padding: "20px",
                boxSizing: "border-box",
            }}
        >
            <div
                style={{
                    width: "400px",
                    maxWidth: "100%",
                    background: "white",
                    padding: "35px",
                    borderRadius: "15px",
                    boxShadow:
                        "0 10px 30px rgba(0,0,0,0.1)",
                    boxSizing: "border-box",
                }}
            >
                <h1
                    style={{
                        marginBottom: "8px",
                        color: "#0f172a",
                    }}
                >
                    Student Attendance System
                </h1>

                <p
                    style={{
                        color: "#64748b",
                        marginBottom: "25px",
                    }}
                >
                    Login to your account
                </p>

                {/* Error Message */}
                {error && (
                    <div
                        style={{
                            background: "#fee2e2",
                            color: "#b91c1c",
                            padding: "10px",
                            borderRadius: "8px",
                            marginBottom: "15px",
                            fontSize: "14px",
                        }}
                    >
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Email */}
                    <label
                        style={{
                            display: "block",
                            color: "#334155",
                            fontWeight: "600",
                        }}
                    >
                        Email
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="admin@attendance.com"
                        autoComplete="email"
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "6px",
                            marginBottom: "18px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                            boxSizing: "border-box",
                            outline: "none",
                        }}
                    />

                    {/* Password */}
                    <label
                        style={{
                            display: "block",
                            color: "#334155",
                            fontWeight: "600",
                        }}
                    >
                        Password
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter password"
                        autoComplete="current-password"
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "6px",
                            marginBottom: "20px",
                            border: "1px solid #cbd5e1",
                            borderRadius: "8px",
                            boxSizing: "border-box",
                            outline: "none",
                        }}
                    />

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            background: loading
                                ? "#93c5fd"
                                : "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: loading
                                ? "not-allowed"
                                : "pointer",
                            fontSize: "16px",
                            fontWeight: "600",
                        }}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>
                </form>

                <p
                    style={{
                        marginTop: "20px",
                        fontSize: "13px",
                        color: "#64748b",
                    }}
                >
                    Demo Admin:
                    <br />
                    admin@attendance.com
                </p>
            </div>
        </div>
    );
}
