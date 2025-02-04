// src/middlewares/errorHandler.middleware.ts
import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/BaseError";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR]: ${err.message}`);

  if (err instanceof BaseError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Internal Server Error" });
};
