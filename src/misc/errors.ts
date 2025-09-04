import { Request, Response, NextFunction } from "express";

export function asyncHandler(fn: any) {
  return function wrapped(req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: "Not Found" });
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err?.status || 500;
  const code = err?.code || undefined;
  const message = err?.message || "Internal Server Error";
  console.error(`[error] ${req.method} ${req.url} → ${status} ${code || ''} ${message}`);
  if (err?.stack) console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(status).json({ message, code });
}


