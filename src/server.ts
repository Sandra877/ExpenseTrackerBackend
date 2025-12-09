import app from "./index";
import { getPool } from "./config/db";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await getPool(); // Connect DB ONLY ONCE here
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
