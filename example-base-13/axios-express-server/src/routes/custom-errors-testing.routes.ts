// src/routes/items.routes.ts
import express, { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";
import { UnauthorizedError } from "../errors/UnauthorizedError";

const router = express.Router();

router.get("/items/:id", (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return next(new ValidationError("Item ID must be a number"));
  }

  const item = null; // Simulating item not found
  if (!item) {
    return next(new NotFoundError(`Item with ID ${id} not found`));
  }

  res.json({ item });
});

router.post("/items", (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return next(new UnauthorizedError());
  }

  res.status(201).json({ message: "Item Created" });
});

export default router;
