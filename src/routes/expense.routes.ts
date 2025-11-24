import { Router } from "express";
import { addExpense, updateExpense, deleteExpense, getExpenses } from "../controllers/expense.controllers";
import { authMiddleware } from "../middleware/auth.middleware";

const router: Router = Router();

router.post("/", authMiddleware, addExpense);
router.get("/", authMiddleware, getExpenses);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

export default router;
