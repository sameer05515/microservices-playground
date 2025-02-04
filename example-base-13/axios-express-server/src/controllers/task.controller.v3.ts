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
