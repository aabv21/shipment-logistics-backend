import { Request, Response, NextFunction } from "express";
import { ValidationError, validate } from "class-validator";
import { plainToInstance } from "class-transformer";

export const validateRequest = <T extends object>(schema: new () => T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log(req.body);
      const dto = plainToInstance(schema, req.body);

      const errors = await validate(dto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const message = errors
          .map((error: ValidationError) =>
            Object.values(error.constraints || {})
          )
          .join(", ");

        throw new Error(message);
      }

      req.body = dto;
      next();
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error ? error.message : error || "Error desconocido";
      res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
  };
};
