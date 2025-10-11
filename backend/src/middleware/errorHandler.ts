import { Request, Response, NextFunction } from "express";

/**
 * Error-handling middleware for Express
 * Must be the last middleware added to the app
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);

  // Check if error has a status code (custom error)
  const status = err.status || 500;

  res.status(status).json({
    error: err.message || "Internal server error"
  });
}