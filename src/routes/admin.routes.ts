import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";
import * as adminController from "../controllers/admin.controllers";

const router: Router = Router();

router.get("/users", authMiddleware, adminOnly, adminController.getUsers);
router.get("/user/:id/expenses", authMiddleware, adminOnly, adminController.getUserExpenses);
router.delete("/user/:id", authMiddleware, adminOnly, adminController.deleteUser);
router.delete("/expense/:id", authMiddleware, adminOnly, adminController.deleteExpense);


export default router;
