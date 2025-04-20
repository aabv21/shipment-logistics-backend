// Dependencies
import { Router } from "express";

// Presentation
import { UserController } from "@user/presentation/controllers/UserController";

// Utils
import { validateRequest } from "@shared/utils/validation.util";

// DTOs
import { RegisterUserDto } from "@user/application/dtos/RegisterUserDto";
import { LoginUserDto } from "@modules/user/application/dtos/LoginUserDto";

export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();

  router.post(
    "/register",
    validateRequest(RegisterUserDto),
    userController.register.bind(userController)
  );

  router.post(
    "/login",
    validateRequest(LoginUserDto),
    userController.login.bind(userController)
  );

  return router;
};
