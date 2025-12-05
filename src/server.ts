import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import expenseRoutes from "./routes/expense.routes";
import { getPool } from "./config/db";
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
    exposedHeaders: ["Authorization"],
  })
);
app.use(express.json());

// connect to db
getPool();

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes); // <-- THIS IS THE RIGHT PLACE

app.use("/api/admin", adminRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
