import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "";

(async () => {
  await connectDB(MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
