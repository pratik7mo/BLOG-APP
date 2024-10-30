import express from "express";
import { getAdmins, getMyProfile, login, logout, register } from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";

const router = express.Router();

// Registration and login routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/logout", isAuthenticated, logout);
router.get("/my-profile", isAuthenticated, getMyProfile);

// Fetch admins (add `isAuthenticated` if only authorized users should access this)
router.get("/admins", getAdmins);
export default router;
