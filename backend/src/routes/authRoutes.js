import express from "express";

import {
    login,
    changePassword,
    updateProfile,
} from "../controllers/authController.js";

import {
    authenticateToken,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/login",
    login
);

router.put(
    "/change-password",
    authenticateToken,
    changePassword
);

router.put(
    "/profile",
    authenticateToken,
    updateProfile
);

export default router;