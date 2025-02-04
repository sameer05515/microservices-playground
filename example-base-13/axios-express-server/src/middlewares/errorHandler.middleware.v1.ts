// middlewares/error.middleware.ts

import { Request, Response, NextFunction } from "express";

// Sample Error handling middleware
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[ERROR]: ${err.message}`);
  res.status(500).json({
    message: err.message || "Something went wrong!",
    stack: err.stack,
  });
};
