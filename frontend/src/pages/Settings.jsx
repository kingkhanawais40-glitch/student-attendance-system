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
            setError("Name and email are required.");
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

    // =========================
    // GET USER INITIALS
    // =========================

    const initials = (storedUser?.name || "User")
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <div className="settings-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="settings-header">
                <h1>Settings</h1>

                <p>
                    Manage your account and system settings.
                </p>
            </div>

            <div className="settings-container">

                {/* =========================
                    ACCOUNT INFORMATION
                ========================= */}

                <div className="settings-card">

                    <div className="settings-card-header">
                        <div>
                            <h2>
                                Account Information
                            </h2>

                            <p>
                                Update your personal account details.
                            </p>
                        </div>

                        {!editing && (
                            <button
                                type="button"
                                className="settings-edit-button"
                                onClick={() => {
                                    setEditing(true);
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* =========================
                        PROFILE SUMMARY
                    ========================= */}

                    <div className="settings-profile">

                        <div className="settings-avatar">
                            {initials}
                        </div>

                        <div className="settings-user-info">

                            <strong>
                                {storedUser?.name || "User"}
                            </strong>

                            <span>
                                {storedUser?.email || "-"}
                            </span>

                        </div>

                    </div>

                    {/* =========================
                        PROFILE VIEW
                    ========================= */}

                    {!editing ? (
                        <div className="settings-form">

                            <div className="settings-form-group">
                                <label>Name</label>

                                <input
                                    type="text"
                                    value={
                                        storedUser?.name || "-"
                                    }
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="settings-form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    value={
                                        storedUser?.email || "-"
                                    }
                                    disabled
                                    readOnly
                                />
                            </div>

                            <div className="settings-form-group">
                                <label>Role</label>

                                <input
                                    type="text"
                                    value={
                                        storedUser?.role || "-"
                                    }
                                    disabled
                                    readOnly
                                />
                            </div>

                        </div>
                    ) : (

                        /* =========================
                           PROFILE EDIT FORM
                        ========================= */

                        <form
                            className="settings-form"
                            onSubmit={handleUpdateProfile}
                        >

                            <div className="settings-form-group">

                                <label htmlFor="name">
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your name"
                                    required
                                />

                            </div>

                            <div className="settings-form-group">

                                <label htmlFor="email">
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter your email"
                                    required
                                />

                            </div>

                            <div className="settings-actions">

                                <button
                                    type="submit"
                                    className="settings-save-button"
                                    disabled={
                                        profileLoading
                                    }
                                >
                                    {profileLoading
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    className="settings-cancel-button"
                                    onClick={
                                        handleCancelEdit
                                    }
                                    disabled={
                                        profileLoading
                                    }
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>
                    )}

                    {/* =========================
                        MESSAGES
                    ========================= */}

                    {message && (
                        <div className="settings-message">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="settings-error">
                            {error}
                        </div>
                    )}

                    {/* =========================
                        DIVIDER
                    ========================= */}

                    <hr className="settings-divider" />

                    {/* =========================
                        CHANGE PASSWORD
                    ========================= */}

                    <div className="settings-card-header">

                        <div>
                            <h2>
                                Change Password
                            </h2>

                            <p>
                                Keep your account secure with a strong password.
                            </p>
                        </div>

                    </div>

                    <form
                        className="settings-form"
                        onSubmit={handleChangePassword}
                    >

                        {/* CURRENT PASSWORD */}

                        <div className="settings-form-group">

                            <label htmlFor="currentPassword">
                                Current Password
                            </label>

                            <input
                                id="currentPassword"
                                type="password"
                                value={
                                    currentPassword
                                }
                                onChange={(e) =>
                                    setCurrentPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter current password"
                                required
                            />

                        </div>

                        {/* NEW PASSWORD */}

                        <div className="settings-form-group">

                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Enter new password"
                                minLength={6}
                                required
                            />

                        </div>

                        {/* CONFIRM PASSWORD */}

                        <div className="settings-form-group">

                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={
                                    confirmPassword
                                }
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm new password"
                                minLength={6}
                                required
                            />

                        </div>

                        {/* PASSWORD BUTTON */}

                        <div className="settings-actions">

                            <button
                                type="submit"
                                className="settings-save-button"
                                disabled={
                                    passwordLoading
                                }
                            >
                                {passwordLoading
                                    ? "Changing..."
                                    : "Change Password"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}