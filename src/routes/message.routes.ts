import { Router } from "express";
import { sendMessage } from "../controllers/message.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.post("/contact", authMiddleware, sendMessage);

export default router;
