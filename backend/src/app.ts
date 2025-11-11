import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import enquiryRoutes from "./routes/enquiries";
import userRoutes from "./routes/userRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://cloudblitz-gray.vercel.app", // your deployed frontend
];

const app = express();
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // if you use cookies or auth tokens
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;
