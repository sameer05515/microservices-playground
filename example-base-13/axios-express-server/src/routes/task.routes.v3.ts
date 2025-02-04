import express from "express";
import {
  addTask,
  getAllTasks,
  getTaskDetails,
  getFilteredTasks,
  sortByMyltipleConditions,
} from "../controllers/task.controller.v3";

import {
  getPaginatedFilteredTasks,
  getPaginatedTasks,
  sortWithPaginatedByMultipleConditions,
} from "../controllers/task.controller.v3.pagination";
import { getFilteredTasksWithFormattedQuery } from "../controllers/task.controller.v3.filter-syntax";

const router = express.Router();

// Route to save a new task
router.post("/tasks", addTask);

// Additional routes can be added for fetching, updating tasks, etc.

// Route to fetch all tasks (_id, name, status)
router.get("/tasks", getAllTasks);

router.get("/tasks/filter-with-formatted-query", getFilteredTasksWithFormattedQuery);

// Route to fetch tasks with filters: status, date (on or after), and sort by status
router.get("/tasks/filter", getFilteredTasks);

// Fetch tasks with sorting by one or more fields
router.get("/tasks/sort", sortByMyltipleConditions);

router.get("/tasks/paginated", getPaginatedTasks);

router.get("/tasks/paginated/filter", getPaginatedFilteredTasks);

router.get("/tasks/paginated/sort", sortWithPaginatedByMultipleConditions);

// Route to fetch task details by _id
router.get("/tasks/:id", getTaskDetails);

export default router;
