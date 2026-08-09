import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

// =========================
// SVG ICONS
// =========================

function DashboardIcon() {
    return (
        <svg viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7" rx="1" />
            <rect x="14" y="3" width="7" height="7" rx="1" />
            <rect x="3" y="14" width="7" height="7" rx="1" />
            <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
    );
}

function StudentsIcon() {
    return (
        <svg viewBox="0 0 24 24">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg viewBox="0 0 24 24">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21a8 8 0 0 1 16 0" />
        </svg>
    );
}

function AttendanceIcon() {
    return (
        <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <path d="m8 12 2.5 2.5L16 9" />
        </svg>
    );
}

function ReportsIcon() {
    return (
        <svg viewBox="0 0 24 24">
            <path d="M4 19V5" />
            <path d="M4 19h17" />
            <path d="m7 15 4-4 3 2 5-6" />
        </svg>
    );
}

function SettingsIcon() {
    return (
        <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.8 1.8-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V22h-2.54v-.1a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.8-1.8.06-.06A1.7 1.7 0 0 0 8.6 15a1.7 1.7 0 0 0-1.56-1.03H7v-2.54h.04A1.7 1.7 0 0 0 8.6 10.4a1.7 1.7 0 0 0-.34-1.88L8.2 8.46l1.8-1.8.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.97 5.5V5h2.54v.5a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.8 1.8-.06.06a1.7 1.7 0 0 0-.34 1.88A1.7 1.7 0 0 0 21.44 11H22v2.54h-.56A1.7 1.7 0 0 0 19.4 15Z" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="m16 17 5-5-5-5" />
            <path d="M21 12H9" />
        </svg>
    );
}

// =========================
// MENU ITEMS
// =========================

const menuItems = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: DashboardIcon,
        roles: ["admin", "teacher", "student"],
    },
    {
        name: "Students",
        path: "/students",
        icon: StudentsIcon,
        roles: ["admin", "teacher"],
    },
    {
        name: "Attendance",
        path: "/attendance",
        icon: AttendanceIcon,
        roles: ["admin", "teacher"],
    },
    {
        name: "Users / Staff",
        path: "/users",
        icon: UsersIcon,
        roles: ["admin"],
    },
    {
        name: "Reports",
        path: "/reports",
        icon: ReportsIcon,
        roles: ["admin", "teacher"],
    },
];

// =========================
// SIDEBAR
// =========================

export default function Sidebar() {
    const navigate = useNavigate();

    let user = null;

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "null"
        );
    } catch (error) {
        console.error("USER DATA ERROR:", error);
        user = null;
    }

    const userRole = user?.role || "student";

    const visibleMenuItems = menuItems.filter((item) =>
        item.roles.includes(userRole)
    );

    // =========================
    // LOGOUT
    // =========================

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        navigate("/login", {
            replace: true,
        });
    }

    // =========================
    // UI
    // =========================

    return (
        <aside className="sidebar">

            {/* BRAND */}
            <div className="sidebar-logo">

                <div className="logo-box">
                    <span>A</span>
                </div>

                <div className="brand-content">
                    <h1>Attendance</h1>
                    <p>Student Management</p>
                </div>

            </div>

            {/* MENU */}
            <div className="sidebar-content">

                <p className="menu-title">
                    MAIN MENU
                </p>

                <nav className="sidebar-nav">

                    {visibleMenuItems.map((item) => {

                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-link ${
                                        isActive ? "active" : ""
                                    }`
                                }
                            >

                                <span className="sidebar-icon">
                                    <Icon />
                                </span>

                                <span className="sidebar-label">
                                    {item.name}
                                </span>

                            </NavLink>
                        );
                    })}

                </nav>

                {/* SYSTEM */}
                {userRole === "admin" && (
                    <>
                        <p className="menu-title system-title">
                            SYSTEM
                        </p>

                        <button
                            type="button"
                            className="sidebar-link settings-button"
                            onClick={() =>
                                navigate("/settings")
                            }
                        >
                            <span className="sidebar-icon">
                                <SettingsIcon />
                            </span>

                            <span className="sidebar-label">
                                Settings
                            </span>
                        </button>
                    </>
                )}

            </div>

            {/* BOTTOM */}
            <div className="sidebar-bottom">

                {/* USER CARD */}
                <div className="user-card">

                    <div className="user-avatar">
                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "A"}
                    </div>

                    <div className="user-info">

                        <strong>
                            {user?.name || "System Admin"}
                        </strong>

                        <span>
                            {user?.role || "Administrator"}
                        </span>

                    </div>

                </div>

                {/* LOGOUT */}
                <button
                    type="button"
                    className="sidebar-link logout-button"
                    onClick={handleLogout}
                >

                    <span className="sidebar-icon">
                        <LogoutIcon />
                    </span>

                    <span className="sidebar-label">
                        Logout
                    </span>

                </button>

            </div>

        </aside>
    );
}
