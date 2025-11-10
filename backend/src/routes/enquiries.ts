import { Router } from "express";
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} from "../controllers/enquiryController";
import auth from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";

const router = Router();

router.post("/", auth, createEnquiry);
router.get("/", auth, getEnquiries);
router.get("/:id", auth, getEnquiryById);
router.put("/:id", auth, requireRole("admin"), updateEnquiry);
router.delete("/:id", auth, requireRole("admin"), deleteEnquiry);

export default router;
