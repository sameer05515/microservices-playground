import { Request, Response, NextFunction } from "express";

export const jsonErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError && "status" in err && (err as any).status === 400 && "body" in err) {
     res.status(400).json({
      message: "Invalid JSON payload!",
      statusCode: 400,
    });
    return;
  }
  next(err);
};
