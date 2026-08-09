import React, { useState } from "react";
import api from "../api/axios.js";

export default function Settings() {
    const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    // =========================
    // PROFILE
    // =========================

    const [editing, setEditing] = useState(false);

    const [name, setName] = useState(
        storedUser?.name || ""
    );

    const [email, setEmail] = useState(
        storedUser?.email || ""
    );

    // =========================
    // PASSWORD
    // =========================

    const [currentPassword, setCurrentPassword] =
        useState("");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    // =========================
    // COMMON STATES
    // =========================

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [profileLoading, setProfileLoading] =
        useState(false);

    const [passwordLoading, setPasswordLoading] =
        useState(false);

    // =========================
    // UPDATE PROFILE
    // =========================

    async function handleUpdateProfile(e) {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!name.trim() || !email.trim()) {
            setError(
                "Name and email are required."
            );
            return;
        }

        try {
            setProfileLoading(true);

            const { data } = await api.put(
                "/auth/profile",
                {
                    name: name.trim(),
                    email: email.trim(),
                }
            );

            // Update localStorage
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            setMessage(
                data.message ||
                    "Profile updated successfully."
            );

            setEditing(false);

        } catch (err) {
            console.error(
                "UPDATE PROFILE ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to update profile."
            );
        } finally {
            setProfileLoading(false);
        }
    }

    // =========================
    // CANCEL PROFILE EDIT
    // =========================

    function handleCancelEdit() {
        setName(storedUser?.name || "");
        setEmail(storedUser?.email || "");

        setEditing(false);
        setError("");
        setMessage("");
    }

    // =========================
    // CHANGE PASSWORD
    // =========================

    async function handleChangePassword(e) {
        e.preventDefault();

        setMessage("");
        setError("");

        if (newPassword !== confirmPassword) {
            setError(
                "New password and confirm password do not match."
            );
            return;
        }

        if (newPassword.length < 6) {
            setError(
                "New password must be at least 6 characters."
            );
            return;
        }

        try {
            setPasswordLoading(true);

            const { data } = await api.put(
                "/auth/change-password",
                {
                    currentPassword,
                    newPassword,
                }
            );

            setMessage(
                data.message ||
                    "Password changed successfully."
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {
            console.error(
                "CHANGE PASSWORD ERROR:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to change password."
            );
        } finally {
            setPasswordLoading(false);
        }
    }

    return (
        <div style={{ padding: "30px" }}>

            <h1>Settings</h1>

            <p>
                Manage your account and system settings.
            </p>

            {/* =========================
                ACCOUNT INFORMATION
            ========================= */}

            <div
                style={{
                    marginTop: "25px",
                    padding: "25px",
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow:
                        "0 4px 15px rgba(0,0,0,0.08)",
                    maxWidth: "600px",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        gap: "15px",
                    }}
                >
                    <h2>
                        Account Information
                    </h2>

                    {!editing && (
                        <button
                            type="button"
                            onClick={() =>
                                setEditing(true)
                            }
                            style={{
                                padding:
                                    "9px 16px",
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
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* PROFILE VIEW */}

                {!editing ? (
                    <div
                        style={{
                            marginTop: "20px",
                        }}
                    >

                        <p>
                            <strong>
                                Name:
                            </strong>{" "}
                            {storedUser?.name ||
                                "-"}
                        </p>

                        <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {storedUser?.email ||
                                "-"}
                        </p>

                        <p>
                            <strong>
                                Role:
                            </strong>{" "}
                            {storedUser?.role ||
                                "-"}
                        </p>

                    </div>
                ) : (

                    /* PROFILE EDIT FORM */

                    <form
                        onSubmit={
                            handleUpdateProfile
                        }
                        style={{
                            marginTop: "20px",
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
                                    e.target.value
                                )
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
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
                                    e.target.value
                                )
                            }
                            required
                            style={{
                                width: "100%",
                                padding: "12px",
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
                        />

                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                            }}
                        >

                            <button
                                type="submit"
                                disabled={
                                    profileLoading
                                }
                                style={{
                                    padding:
                                        "11px 18px",
                                    border: "none",
                                    borderRadius:
                                        "8px",
                                    background:
                                        "#2563eb",
                                    color:
                                        "white",
                                    cursor:
                                        profileLoading
                                            ? "not-allowed"
                                            : "pointer",
                                    fontWeight:
                                        "600",
                                }}
                            >
                                {profileLoading
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                onClick={
                                    handleCancelEdit
                                }
                                disabled={
                                    profileLoading
                                }
                                style={{
                                    padding:
                                        "11px 18px",
                                    border:
                                        "1px solid #cbd5e1",
                                    borderRadius:
                                        "8px",
                                    background:
                                        "white",
                                    cursor:
                                        "pointer",
                                    fontWeight:
                                        "600",
                                }}
                            >
                                Cancel
                            </button>

                        </div>

                    </form>
                )}

                {/* MESSAGE */}

                {message && (
                    <div
                        style={{
                            marginTop: "15px",
                            padding: "10px",
                            background:
                                "#dcfce7",
                            color:
                                "#166534",
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
                            marginTop: "15px",
                            padding: "10px",
                            background:
                                "#fee2e2",
                            color:
                                "#b91c1c",
                            borderRadius:
                                "8px",
                        }}
                    >
                        {error}
                    </div>
                )}

                <hr
                    style={{
                        margin: "25px 0",
                        border: "none",
                        borderTop:
                            "1px solid #e2e8f0",
                    }}
                />

                {/* =========================
                    CHANGE PASSWORD
                ========================= */}

                <h2>
                    Change Password
                </h2>

                <form
                    onSubmit={
                        handleChangePassword
                    }
                    style={{
                        marginTop: "20px",
                    }}
                >

                    <label>
                        Current Password
                    </label>

                    <input
                        type="password"
                        value={
                            currentPassword
                        }
                        onChange={(e) =>
                            setCurrentPassword(
                                e.target.value
                            )
                        }
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "6px",
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
                        New Password
                    </label>

                    <input
                        type="password"
                        value={
                            newPassword
                        }
                        onChange={(e) =>
                            setNewPassword(
                                e.target.value
                            )
                        }
                        required
                        minLength={6}
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "6px",
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
                        Confirm New Password
                    </label>

                    <input
                        type="password"
                        value={
                            confirmPassword
                        }
                        onChange={(e) =>
                            setConfirmPassword(
                                e.target.value
                            )
                        }
                        required
                        minLength={6}
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginTop: "6px",
                            marginBottom:
                                "20px",
                            boxSizing:
                                "border-box",
                            border:
                                "1px solid #cbd5e1",
                            borderRadius:
                                "8px",
                        }}
                    />

                    <button
                        type="submit"
                        disabled={
                            passwordLoading
                        }
                        style={{
                            padding:
                                "12px 20px",
                            border: "none",
                            borderRadius:
                                "8px",
                            background:
                                "#2563eb",
                            color: "white",
                            cursor:
                                passwordLoading
                                    ? "not-allowed"
                                    : "pointer",
                            fontWeight:
                                "600",
                        }}
                    >
                        {passwordLoading
                            ? "Changing..."
                            : "Change Password"}
                    </button>

                </form>

            </div>
        </div>
    );
}
