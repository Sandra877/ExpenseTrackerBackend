import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import expenseRoutes from "./routes/expense.routes";
import adminRoutes from "./routes/admin.routes";
import messageRoutes from "./routes/message.routes"

dotenv.config();

const app: Application = express();  // <-- Fixes the TS error

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://swkxpensetrackerreactapp.vercel.app",
    ],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);


// Health check for render
app.get("/health", (_req, res) => res.json({ status: "ok" }));

export default app; 
