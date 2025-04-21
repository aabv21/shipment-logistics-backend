import { Request, Response, NextFunction } from "express";

const numericFields = ["weight", "length", "width", "height"];

export const parseNumericFields = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body) {
    numericFields.forEach((field) => {
      if (req.body[field] && typeof req.body[field] === "string") {
        req.body[field] = parseFloat(req.body[field]);
      }
    });
  }
  next();
};
