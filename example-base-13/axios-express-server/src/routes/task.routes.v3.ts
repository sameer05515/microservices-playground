import express from "express";
import { addTask } from "../controllers/task.controller.v3";

const router = express.Router();

// Route to save a new task
router.post("/tasks", addTask);

// Additional routes can be added for fetching, updating tasks, etc.

export default router;
