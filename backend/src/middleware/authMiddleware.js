import jwt from "jsonwebtoken";

const JWT_SECRET =
    process.env.JWT_SECRET ||
    "attendance-system-secret-key";

export function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        const parts = authHeader.split(" ");

        if (
            parts.length !== 2 ||
            parts[0] !== "Bearer"
        ) {
            return res.status(401).json({
                message: "Invalid authorization format",
            });
        }

        const token = parts[1];

        const decoded = jwt.verify(
            token,
            JWT_SECRET
        );

        req.user = decoded;

        next();
    } catch (error) {
        console.error(
            "AUTH MIDDLEWARE ERROR:",
            error.message
        );

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
}

export function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                message: "Authentication required",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        next();
    };
}