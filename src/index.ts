import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS setup
const allowedOrigins = (process.env.CORS_ORIGIN || "").split(",");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://swkxpensetrackerreactapp.vercel.app"
  ],
  credentials: true,
}));



// Middleware
app.use(express.json());

app.options("*", cors());

// Routes
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));

// Example route
app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from Express!' });
});
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
