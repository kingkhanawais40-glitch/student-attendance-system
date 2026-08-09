import React from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Students from "./pages/Students.jsx";
import Dashboard from "./page/Dashboard.jsx";
import Attendance from "./pages/Attendance.jsx";
import Reports from "./pages/Reports.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Settings from "./pages/Settings.jsx";
import Users from "./pages/Users.jsx";

// ==========================================
// GET CURRENT USER
// ==========================================

function getCurrentUser() {
    try {
        return JSON.parse(
            localStorage.getItem("user") || "null"
        );
    } catch (error) {
        console.error("USER DATA ERROR:", error);
        return null;
    }
}

// ==========================================
// PROTECTED LAYOUT
// Login required
// ==========================================

function ProtectedLayout({ children }) {
    const token = localStorage.getItem("token");
    const user = getCurrentUser();

    // Login ke baghair protected pages access nahi hongi
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

// ==========================================
// ADMIN ONLY LAYOUT
// Login + Admin role required
// ==========================================

function AdminOnlyRoute({ children }) {
    const token = localStorage.getItem("token");
    const user = getCurrentUser();

    // Login required
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Sirf admin Settings / Users access kar sakta hai
    if (user.role !== "admin") {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return (
        <div className="app-layout">
            <Sidebar />

            <main className="main-content">
                {children}
            </main>
        </div>
    );
}

// ==========================================
// PUBLIC ROUTE
// ==========================================

function PublicRoute({ children }) {
    const token = localStorage.getItem("token");
    const user = getCurrentUser();

    // Already logged in
    if (token && user) {
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return children;
}

// ==========================================
// APP
// ==========================================

export default function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* ==========================================
                    LOGIN
                ========================================== */}

                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />

                {/* ==========================================
                    DASHBOARD
                ========================================== */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedLayout>
                            <Dashboard />
                        </ProtectedLayout>
                    }
                />

                {/* ==========================================
                    STUDENTS
                ========================================== */}

                <Route
                    path="/students"
                    element={
                        <ProtectedLayout>
                            <Students />
                        </ProtectedLayout>
                    }
                />

                {/* ==========================================
                    ATTENDANCE
                ========================================== */}

                <Route
                    path="/attendance"
                    element={
                        <ProtectedLayout>
                            <Attendance />
                        </ProtectedLayout>
                    }
                />

                {/* ==========================================
                    REPORTS
                ========================================== */}

                <Route
                    path="/reports"
                    element={
                        <ProtectedLayout>
                            <Reports />
                        </ProtectedLayout>
                    }
                />

                {/* ==========================================
                    USERS / STAFF
                    ADMIN ONLY
                ========================================== */}

                <Route
                    path="/users"
                    element={
                        <AdminOnlyRoute>
                            <Users />
                        </AdminOnlyRoute>
                    }
                />

                {/* ==========================================
                    SETTINGS
                    ADMIN ONLY
                ========================================== */}

                <Route
                    path="/settings"
                    element={
                        <AdminOnlyRoute>
                            <Settings />
                        </AdminOnlyRoute>
                    }
                />

                {/* ==========================================
                    ROOT
                ========================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

                {/* ==========================================
                    INVALID URL
                ========================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

