import express from "express";
import Enquiry from "../models/Enquiry";
import auth from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";

const router = express.Router();

router.get("/top-performers", auth, requireRole("admin"), async (req, res) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const topPerformers = await Enquiry.aggregate([
      {
        $match: {
          status: "closed",
          updatedAt: { $gte: startOfWeek },
          assignedTo: { $ne: null },
        },
      },
      {
        $group: {
          _id: "$assignedTo",
          closedCount: { $sum: 1 },
        },
      },
      {
        $sort: { closedCount: -1 },
      },
      { $limit: 3 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "staff",
        },
      },
      { $unwind: "$staff" },
      {
        $project: {
          _id: 0,
          name: "$staff.name",
          email: "$staff.email",
          role: "$staff.role",
          closedCount: 1,
        },
      },
    ]);

    res.json({ success: true, data: topPerformers });
  } catch (err: any) {
    console.error("Error fetching top performers:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to load top performers" });
  }
});

export default router;
