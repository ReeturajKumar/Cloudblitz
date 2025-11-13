import { Router } from "express";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import auth from "../middlewares/auth";
import { requireRole } from "../middlewares/roles";

const router = Router();

router.get("/", auth, requireRole("admin"), getUsers);
router.post("/", auth, requireRole("admin"), createUser);
router.put("/:id", auth, requireRole("admin"), updateUser);
router.delete("/:id", auth, requireRole("admin"), deleteUser);

export default router;
