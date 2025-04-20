// Dependencies
import { Pool } from "pg";
import { Router } from "express";

// Infrastructure
import { PostgresUserRepository } from "@user/infrastructure/persistence/PostgresUserRepository";

// Application
import { RegisterUserService } from "@user/application/services/RegisterUserService";
import { LoginUserService } from "@user/application/services/LoginUserService";

// Presentation
import { createUserRoutes } from "@user/presentation/routes/user.routes";
import { UserController } from "@user/presentation/controllers/UserController";

export class UserModule {
  private readonly userRepository: PostgresUserRepository;
  private readonly registerUserService: RegisterUserService;
  private readonly loginUserService: LoginUserService;
  private readonly userController: UserController;

  constructor() {
    this.userRepository = new PostgresUserRepository();
    this.registerUserService = new RegisterUserService(this.userRepository);
    this.loginUserService = new LoginUserService(this.userRepository);
    this.userController = new UserController(
      this.registerUserService,
      this.loginUserService
    );
  }

  public getRoutes(): Router {
    return createUserRoutes(this.userController);
  }
}
