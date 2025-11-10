import { Request, Response } from "express";
import Enquiry from "../models/Enquiry";
import mongoose from "mongoose";

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
    const role = (req as any).role;
    const userId = (req as any).userId;
    const { status, search } = req.query;
    const filter: any = { deleted: false };

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Staff can only see their assigned enquiries
    if (role === "staff") {
      filter.assignedTo = userId;
    }

    const data = await Enquiry.find(filter)
      .populate("assignedTo", "name email role")
      .sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch enquiries" });
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
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) return res.status(404).json({ error: "Not found" });

    // Staff can only update if assigned to them
    if (role === "staff" && String(enquiry.assignedTo) !== userId) {
      return res.status(403).json({ error: "Not allowed" });
    }

    const allowed = [
      "customerName",
      "email",
      "phone",
      "message",
      "status",
      "assignedTo",
    ];
    const updates: any = {};
    for (const key of allowed)
      if (key in req.body) updates[key] = (req.body as any)[key];

    const updated = await Enquiry.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
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
