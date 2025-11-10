import { Request, Response } from "express";
import User from "../models/User";

// Get all users (Admin only)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.default.hash(password, 10);

    const newUser = await User.create({ name, email, passwordHash, role });
    res.status(201).json({
      message: "User created successfully",
      user: { id: newUser._id, name, email, role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update user (Admin only)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
