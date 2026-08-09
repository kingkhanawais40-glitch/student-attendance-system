import express from "express";

import {
    getUsers,
    createUser,
    deleteUser,
} from "../controllers/userController.js";

import {
    authenticateToken,
    authorizeRoles,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// View users
router.get(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    getUsers
);

// Create user
router.post(
    "/",
    authenticateToken,
    authorizeRoles("admin"),
    createUser
);

// Delete user
router.delete(
    "/:id",
    authenticateToken,
    authorizeRoles("admin"),
    deleteUser
);

export default router;