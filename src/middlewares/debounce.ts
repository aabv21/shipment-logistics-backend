import { Request, Response, NextFunction } from "express";

// Constants
const debounceTime = 500; // 0.5 second debounce
const lastRequestTime: Record<string, number> = {};

const debounceMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const ip = req.ip || req.socket.remoteAddress;
  if (!ip) return next();

  const currentTime = Date.now();

  if (lastRequestTime[ip] && currentTime - lastRequestTime[ip] < debounceTime) {
    res
      .status(429)
      .json({ message: "Please wait before making another request" });
    return;
  }

  lastRequestTime[ip] = currentTime;
  next();
};

export default debounceMiddleware;
