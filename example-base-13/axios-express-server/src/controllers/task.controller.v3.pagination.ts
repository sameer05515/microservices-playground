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

// Fetch tasks with filters, sorting, and pagination
export const getPaginatedFilteredTasks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 5;
    const { status, date } = req.query;

    let sort = req.query.sort;
    const filter: any = {};
    let sortOrder: any = {};

    // Apply status filter
    if (status) {
      filter.status = status;
    }

    // Apply date filter
    if (date) {
      const dateString = Array.isArray(date) ? date[0] : date;
      if (typeof dateString === "string") {
        const parsedDate = new Date(dateString);
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

    // Apply sorting
    if (typeof sort === "string") {
      const sortFields = sort.split(",").map((s) => {
        const [field, order] = s.split(":");
        return { [field]: order === "desc" ? -1 : 1 };
      });

      sortOrder = Object.assign({}, ...sortFields);
    }

    // Fetch total count before applying pagination
    const totalCount = await TaskModel.countDocuments(filter);

    // Fetch paginated tasks
    const tasks = await TaskModel.find(filter)
      .select("_id name status")
      .sort(sortOrder)
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      data: tasks,
      totalCount,
      currentPageNo: page,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching paginated filtered tasks", error });
  }
};
