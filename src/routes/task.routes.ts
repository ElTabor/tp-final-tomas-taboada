import express from "express";
import authMiddleware from "../middlewares/auth.middleware";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";

const router = express.Router();

router.get("/", getTasks as any);
router.get("/:id", getTask as any);
router.post("/", createTask as any);
router.patch("/:id", updateTask as any);
router.put("/:id", updateTask as any);
router.delete("/:id", deleteTask as any);

export default router;
