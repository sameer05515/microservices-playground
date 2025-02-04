import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    message: `Route '${req.originalUrl}' not found!`,
    statusCode: 404,
  });
};
