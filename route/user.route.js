import express from "express";
import { signup, login, makeAdmin } from "../controller/user.controller.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.patch("/make-admin/:userId", makeAdmin);

export default router;
