import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import "./Login.css";

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

            if (!data.token) {
                throw new Error(
                    "Login token was not received."
                );
            }

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

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
        <div className="login-page">

            {/* Background decoration */}
            <div className="login-orb login-orb-one"></div>
            <div className="login-orb login-orb-two"></div>
            <div className="login-orb login-orb-three"></div>

            {/* Floating grid */}
            <div className="login-grid"></div>

            {/* Login Card */}
            <div className="login-card">

                {/* Brand */}
                <div className="login-brand">

                    <div className="login-logo">
                        A
                    </div>

                    <div>
                        <h1>
                            Attendance
                        </h1>

                        <p>
                            Student Management
                        </p>
                    </div>

                </div>

                {/* Heading */}
                <div className="login-heading">
                    <h2>
                        Welcome Back
                    </h2>

                    <p>
                        Login to your account
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="login-error">
                        <span className="error-icon">
                            !
                        </span>

                        <span>
                            {error}
                        </span>
                    </div>
                )}

                {/* Form */}
                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >

                    {/* Email */}
                    <div className="login-field">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                @
                            </span>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                placeholder="admin@attendance.com"
                                autoComplete="email"
                                required
                            />

                        </div>

                    </div>

                    {/* Password */}
                    <div className="login-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                •••
                            </span>

                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />

                        </div>

                    </div>

                    {/* Login */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        <span>
                            {loading
                                ? "Logging in..."
                                : "Login to Dashboard"}
                        </span>

                        {!loading && (
                            <span className="login-arrow">
                                →
                            </span>
                        )}
                    </button>

                </form>

                {/* Demo information */}
                <div className="demo-box">

                    <div className="demo-icon">
                        i
                    </div>

                    <div className="demo-content">

                        <strong>
                            Demo Admin Account
                        </strong>

                        <span>
                            admin@attendance.com
                        </span>

                    </div>

                </div>

                <div className="login-footer">
                    Student Attendance Management System
                </div>

            </div>
        </div>
    );
}

