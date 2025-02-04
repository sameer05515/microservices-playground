import { Request, Response } from "express";
import TaskModel from "../models/task.model.v3";

// Fetch tasks with pagination
export const getPaginatedTasks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 5;

    const totalCount = await TaskModel.countDocuments();
    const tasks = await TaskModel.find()
      .select("_id name status")
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      data: tasks,
      totalCount,
      currentPageNo: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching paginated tasks", error });
  }
};
