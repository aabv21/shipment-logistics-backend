import { IUserRepository } from "@user/domain/repositories/IUserRepository";
import { UserResponseDto } from "@user/application/dtos/UserResponseDto";
import jwt from "jsonwebtoken";
import { LoginUserDto } from "../dtos/LoginUserDto";

export class LoginUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    dto: LoginUserDto
  ): Promise<{ user: UserResponseDto; token: string }> {
    try {
      const user = await this.userRepository.findByEmail(dto.email);
      if (!user) {
        throw new Error(`User not found for email: ${dto.email}`);
      }

      const isValidPassword = await user.validatePassword(dto.password);
      if (!isValidPassword) {
        throw new Error(`Invalid password for user ${dto.email}`);
      }

      // Generate Token
      const token = jwt.sign(
        { userId: user.getId(), role: user.getRole() },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      return {
        user: {
          id: user.getId() || "",
          email: user.getEmail()?.getValue(),
          createdAt: user.getCreatedAt(),
          role: user.getRole(),
          phone: user.getPhone(),
          first_name: user.getFirstName(),
          last_name: user.getLastName(),
        },
        token,
      };
    } catch (error) {
      throw new Error(`Invalid credentials: ${error}`);
    }
  }
}
