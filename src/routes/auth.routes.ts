import { Router } from "express";
import { register, verifyEmail, login } from "../controllers/auth.controllers";

const router: Router = Router();

router.post("/register", register);
router.get("/verify/:token", verifyEmail);
router.post("/login", login);

export default router;
