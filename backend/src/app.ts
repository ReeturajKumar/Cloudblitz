import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import enquiryRoutes from "./routes/enquiries";
import userRoutes from "./routes/userRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/users", userRoutes);

export default app;
