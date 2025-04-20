// Dependencies
import { Request, Response, NextFunction } from "express";

// Application
import { RegisterUserService } from "@user/application/services/RegisterUserService";
import { LoginUserService } from "@user/application/services/LoginUserService";

// DTOs
import { RegisterUserDto } from "@user/application/dtos/RegisterUserDto";
import { LoginUserDto } from "@user/application/dtos/LoginUserDto";

export class UserController {
  constructor(
    private readonly registerUserService: RegisterUserService,
    private readonly loginUserService: LoginUserService
  ) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto: RegisterUserDto = req.body;
      const result = await this.registerUserService.execute(dto);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginUserDto = req.body;
      const result = await this.loginUserService.execute(dto);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
