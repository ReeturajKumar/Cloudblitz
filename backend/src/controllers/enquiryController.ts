import { Request, Response } from "express";
import Enquiry from "../models/Enquiry";
import mongoose from "mongoose";
import User from "../models/User";

export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const { customerName, email, phone, message, assignedTo } = req.body;
    if (!customerName)
      return res.status(400).json({ error: "customerName required" });

    const enquiry = await Enquiry.create({
      customerName,
      email,
      phone,
      message,
      assignedTo,
    });
    res.status(201).json(enquiry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create enquiry" });
  }
};

export const getEnquiries = async (req: Request, res: Response) => {
  try {
    const { status, search, assignedTo, page = 1, limit = 10 } = req.query;

    const query: any = {};

    // 🔹 Filter by status
    if (status && status !== "All") {
      query.status = status;
    }

    // 🔹 Filter by assignedTo (for admin to see by staff)
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }

    // 🔹 Search by name, email, or phone
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // 🔹 Pagination
    const skip = (Number(page) - 1) * Number(limit);

    // 🔹 If user is staff, only show assigned enquiries
    const { role, userId } = req as any;

    if (role === "staff") {
      query.assignedTo = userId;
    }

    // 🔹 Fetch enquiries
    const enquiries = await Enquiry.find(query)
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Enquiry.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      data: enquiries,
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    res.status(500).json({ error: "Server error while fetching enquiries" });
  }
};

export const getEnquiryById = async (req: Request, res: Response) => {
  try {
    const e = await Enquiry.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );
    if (!e || e.deleted) return res.status(404).json({ error: "Not found" });
    res.json(e);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch enquiry" });
  }
};

export const updateEnquiry = async (req: Request, res: Response) => {
  try {
    const { role, userId } = req as any;
    console.log("🟢 Incoming Update Request");
    console.log("➡️ User Role:", role);
    console.log("➡️ User ID:", userId);
    console.log("➡️ Enquiry ID:", req.params.id);
    console.log("➡️ Request Body:", req.body);

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      console.log("❌ Enquiry not found in DB");
      return res.status(404).json({ error: "Not found" });
    }

    const assignedId =
      typeof enquiry.assignedTo === "object"
        ? enquiry.assignedTo?._id?.toString()
        : enquiry.assignedTo?.toString();

    const requesterId = userId.toString();
    console.log("🟠 Enquiry Found -> Assigned To:", assignedId);
    console.log("🟡 Requester (userId):", requesterId);

    // 🔹 Staff restriction (compare as strings)
    if (role === "staff" && assignedId !== requesterId) {
      console.log(
        "🚫 Forbidden: Staff trying to update enquiry not assigned to them"
      );
      return res.status(403).json({ error: "Not allowed" });
    }

    // 🔹 Allowed fields
    const allowed =
      role === "admin"
        ? ["customerName", "email", "phone", "message", "status", "assignedTo"]
        : ["status"]; // staff can only update status

    const updates: any = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = (req.body as any)[key];
    }

    console.log("🟢 Final Updates To Apply:", updates);

    if (Object.keys(updates).length === 0) {
      console.log("⚠️ No allowed fields provided for update");
      return res
        .status(400)
        .json({ error: "No valid fields provided for update" });
    }

    const updated = await Enquiry.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    console.log("✅ Update Successful:", updated);
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating enquiry:", err);
    res.status(500).json({ error: "Failed to update enquiry" });
  }
};

export const deleteEnquiry = async (req: Request, res: Response) => {
  try {
    const { role } = req as any;
    if (role !== "admin")
      return res.status(403).json({ error: "Only admin can delete" });

    const e = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );
    if (!e) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete enquiry" });
  }
};
