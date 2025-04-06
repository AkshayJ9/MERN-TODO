import express from "express";
import { login, logout, register } from "../controller/user.controller.js";

const router = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/logout", logout); // ✅ Fixed the missing '/'

export default router;
