import { Request, Response, NextFunction } from "express";

/**
 * Wraps async route handlers to automatically catch errors
 */
export const asyncHandler = 
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };