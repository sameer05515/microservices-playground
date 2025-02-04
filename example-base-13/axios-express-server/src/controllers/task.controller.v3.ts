import { Request, Response } from "express";
import TaskModel from "../models/task.model.v3";

// Create a new task
export const addTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, dueDate, status } = req.body;

    if (!name || !description || !dueDate || !status) {
      throw new Error("Missing required fields.");
    }

    const newTask = new TaskModel({ name, description, dueDate, status });
    await newTask.save();

    res.status(201).json({
      message: "Task created successfully",
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating task",
      //   error: error?.message,
    });
  }
};

// Additional controller methods can be added for fetching, updating tasks, etc.

// Fetch all tasks with only _id, name, and status
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await TaskModel.find({}, "_id name status");
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Fetch task details for a given _id
export const getTaskDetails = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const task = await TaskModel.findById(id);
    if (!task) {
      res.status(404).json({ message: `Task with id ${id} not found` });
      return;
    }
    res.status(200).json({ task });
  } catch (error) {
    res.status(500).json({ message: "Error fetching task details", error });
  }
};

// Fetch tasks with filters and sorting
// Fetch tasks with filters and sorting
export const getFilteredTasks = async (req: Request, res: Response) => {
  const { status, date, sort } = req.query;
  const filter: any = {};
  let sortOrder: any = {};

  // Apply filters
  if (status) {
    filter.status = status;
  }

  if (date) {
    // Ensure date is a valid string (it could be an array or single string)
    const dateString = Array.isArray(date) ? date[0] : date;

    // Check if dateString is a valid string format
    if (typeof dateString === "string") {
      const parsedDate = new Date(dateString);

      // Check if the date is valid
      if (isNaN(parsedDate.getTime())) {
        res.status(400).json({ message: "Invalid date format" });
        return;
      }

      filter.dueDate = { $gte: parsedDate };
    } else {
      res.status(400).json({ message: "Invalid date format" });
      return;
    }
  }

  // Apply sorting by status if specified
  if (sort === "status") {
    sortOrder = { status: 1 };
  }

  try {
    const tasks = await TaskModel.find(filter).select("_id name status").sort(sortOrder);
    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching filtered tasks", error });
  }
};

// Utility to convert sort query to mongoose-compatible format
const convertSortQuery = (sort: string) => {
  const sortObj: { [key: string]: 1 | -1 } = {};
  const sortFields = sort.split(",");

  sortFields.forEach((field) => {
    const [key, order] = field.split(":");
    sortObj[key] = order === "desc" ? -1 : 1; // default to 'asc' if no order is specified
  });

  return sortObj;
};

export const sortByMyltipleConditions = async (req: Request, res: Response) => {
  try {
    const { sort } = req.query;

    let sortQuery = {};
    if (sort) {
      sortQuery = convertSortQuery(sort as string);
    } else {
      // If no sorting is provided, default to sorting by 'name' in ascending order
      sortQuery = { name: 1 };
    }

    const tasks = await TaskModel.find().sort(sortQuery);

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(500).json({ message: "Error fetching sorted tasks", error });
  }
};
