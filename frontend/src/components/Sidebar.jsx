import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";

// =========================
// ICONS
// =========================

function DashboardIcon() {
    return (
        <span style={{ fontSize: "20px" }}>
            ▦
        </span>
    );
}

function StudentsIcon() {
    return (
        <span style={{ fontSize: "20px" }}>
            👥
        </span>
    );
}

function UsersIcon() {
    return (
        <span style={{ fontSize: "20px" }}>
            👤
        </span>
    );
}

function AttendanceIcon() {
    return (
        <span style={{ fontSize: "20px" }}>
            ✓
        </span>
    );
}

function ReportsIcon() {
    return (
        <span style={{ fontSize: "20px" }}>
            ▤
        </span>
    );
}

function SettingsIcon() {
    return (
        <span style={{ fontSize: "20px" }}>
            ⚙
        </span>
    );
}

function LogoutIcon() {
    return (
        <span style={{ fontSize: "20px" }}>
            ↪
        </span>
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

    // Get logged-in user
    let user = null;

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "null"
        );
    } catch (error) {
        console.error(
            "USER DATA ERROR:",
            error
        );
        user = null;
    }

    const userRole =
        user?.role || "student";

    // Only show menu items allowed
    // for current user's role
    const visibleMenuItems =
        menuItems.filter((item) =>
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

            {/* =========================
                LOGO
            ========================= */}

            <div className="sidebar-logo">

                <div className="logo-box">
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

            {/* =========================
                MENU
            ========================= */}

            <div className="sidebar-content">

                <p className="menu-title">
                    MAIN MENU
                </p>

                <nav className="sidebar-nav">

                    {visibleMenuItems.map(
                        (item) => {

                            const Icon =
                                item.icon;

                            return (
                                <NavLink
                                    key={
                                        item.path
                                    }
                                    to={
                                        item.path
                                    }
                                    className={({
                                        isActive,
                                    }) =>
                                        `sidebar-link ${
                                            isActive
                                                ? "active"
                                                : ""
                                        }`
                                    }
                                >

                                    <span className="sidebar-icon">
                                        <Icon />
                                    </span>

                                    <span>
                                        {
                                            item.name
                                        }
                                    </span>

                                </NavLink>
                            );
                        }
                    )}

                </nav>

                {/* =========================
                    SYSTEM
                ========================= */}

                <p className="menu-title system-title">
                    SYSTEM
                </p>

                {/* Settings - Admin Only */}

                {userRole === "admin" && (
                    <button
                        type="button"
                        className="sidebar-link settings-button"
                        onClick={() =>
                            navigate(
                                "/settings"
                            )
                        }
                    >

                        <span className="sidebar-icon">
                            <SettingsIcon />
                        </span>

                        <span>
                            Settings
                        </span>

                    </button>
                )}

            </div>

            {/* =========================
                BOTTOM
            ========================= */}

            <div className="sidebar-bottom">

                {/* User Card */}

                <div className="user-card">

                    <div className="user-avatar">

                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "A"}

                    </div>

                    <div className="user-info">

                        <strong>
                            {user?.name ||
                                "System Admin"}
                        </strong>

                        <span>
                            {user?.role ||
                                "Administrator"}
                        </span>

                    </div>

                </div>

                {/* Logout */}

                <button
                    type="button"
                    className="logout-button"
                    onClick={
                        handleLogout
                    }
                >

                    <span className="sidebar-icon">
                        <LogoutIcon />
                    </span>

                    <span>
                        Logout
                    </span>

                </button>

            </div>

        </aside>
    );
}