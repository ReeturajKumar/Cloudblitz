import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import enquiryRoutes from "./routes/enquiries";
import userRoutes from "./routes/userRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;
