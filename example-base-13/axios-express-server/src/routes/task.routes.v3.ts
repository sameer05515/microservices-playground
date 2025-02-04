import express from "express";
import {
  addTask,
  getAllTasks,
  getTaskDetails,
  getFilteredTasks,
  sortByMyltipleConditions,
} from "../controllers/task.controller.v3";

const router = express.Router();

// Route to save a new task
router.post("/tasks", addTask);

// Additional routes can be added for fetching, updating tasks, etc.

// Route to fetch all tasks (_id, name, status)
router.get("/tasks", getAllTasks);

// Route to fetch tasks with filters: status, date (on or after), and sort by status
router.get("/tasks/filter", getFilteredTasks);

// Fetch tasks with sorting by one or more fields
router.get("/tasks/sort", sortByMyltipleConditions);

// Route to fetch task details by _id
router.get("/tasks/:id", getTaskDetails);

export default router;
