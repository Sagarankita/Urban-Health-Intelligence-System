import express from "express";
import { login, register, resetPassword, updateProfile } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/reset-password", resetPassword);
router.patch("/profile", updateProfile);

export default router;
