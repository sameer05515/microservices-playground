import { Request, Response } from "express";
import TaskModel from "../models/task.model.v3"; // Import your Task model

// Allowed filter operators
const allowedOperators: Record<string, string> = {
  eq: "$eq",
  gt: "$gt",
  gte: "$gte",
  lt: "$lt",
  lte: "$lte",
  like: "$regex",
};

// Function to parse the filter query string into a MongoDB-compatible filter object
const parseFilterQuery = (filterQuery: string) => {
  const filter: Record<string, any> = {};

  if (!filterQuery) return filter;

  const filters = filterQuery.split(";");

  filters.forEach((condition) => {
    const [field, operator, value] = condition.split(":");

    if (!field || !operator || value === undefined) {
      throw new Error(`Invalid filter syntax: "${condition}". Expected format: field:operator:value`);
    }

    if (!allowedOperators[operator]) {
      throw new Error(
        `Unsupported operator: "${operator}". Allowed operators: ${Object.keys(allowedOperators).join(", ")}`
      );
    }

    if (value.startsWith("[") && value.endsWith("]")) {
      // Convert array syntax [val1,val2] to MongoDB $in operator
      filter[field] = { $in: value.slice(1, -1).split(",") };
    } else if (operator === "like") {
      filter[field] = { $regex: new RegExp(value, "i") }; // Case-insensitive regex
    } else {
      filter[field] = { [allowedOperators[operator]]: value };
    }
  });

  return filter;
};

// Route Handler
export const getFilteredTasksWithFormattedQuery = async (req: Request, res: Response) => {
  try {
    const { filter } = req.query;

    // Parse filter query into MongoDB filter object
    const filterObject = parseFilterQuery(filter as string);

    // Fetch filtered tasks
    const tasks = await TaskModel.find(filterObject);

    res.status(200).json({ tasks });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : "Invalid request" });
  }
};
