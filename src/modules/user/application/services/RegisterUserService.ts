import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserAlreadyExistsError } from "../../domain/errors/UserAlreadyExistsError";

export class RegisterUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: {
    email: string;
    password: string;
    confirm_password: string;
    role: string;
    phone: string;
    first_name: string;
    last_name: string;
  }): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const user = await User.create(
      dto.email,
      dto.password,
      dto.role,
      dto.phone,
      dto.first_name,
      dto.last_name
    );

    await this.userRepository.save(user);
    return user;
  }
}
