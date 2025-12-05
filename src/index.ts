import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import expenseRoutes from "./routes/expense.routes";
import adminRoutes from "./routes/admin.routes";





dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://swkxpensetrackerreactapp.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/admin", adminRoutes);

// 🔥 Load real routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
