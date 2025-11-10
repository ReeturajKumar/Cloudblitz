import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db";
import User from "../models/User";
import bcrypt from "bcryptjs";

const run = async () => {
  try {
    const uri = process.env.MONGO_URI || "";
    await connectDB(uri);

    const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || "";
    const adminPass = process.env.DEFAULT_ADMIN_PASSWORD || "";

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log(`Admin already exists: ${adminEmail}`);
      process.exit(0);
    }

    const hash = await bcrypt.hash(adminPass, 10);
    const admin = await User.create({
      name: "System Admin",
      email: adminEmail,
      passwordHash: hash,
      role: "admin",
    });

    console.log(`Admin created: ${admin.email}`);
    console.log(`Password: ${adminPass}`);
    process.exit(0);
  } catch (err) {
    console.error("Seeder failed:", err);
    process.exit(1);
  }
};

run();
