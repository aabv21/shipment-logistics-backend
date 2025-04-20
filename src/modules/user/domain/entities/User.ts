import { Email } from "@user/domain/valueObjects/Email";
import { Password } from "@user/domain/valueObjects/Password";

export class User {
  private constructor(
    private readonly id: string | undefined,
    private readonly email: Email,
    private readonly password: Password,
    private readonly role: string = "USER",
    private readonly phone: string,
    private readonly first_name: string,
    private readonly last_name: string,
    private readonly createdAt: Date = new Date()
  ) {}

  public static async create(
    email: string,
    password: string,
    role: string = "USER",
    phone: string,
    first_name: string,
    last_name: string,
    id?: string
  ): Promise<User> {
    const emailObj = Email.create(email);
    const passwordObj = await Password.create(password);

    return new User(
      id,
      emailObj,
      passwordObj,
      role,
      phone,
      first_name,
      last_name
    );
  }

  public static async fromPrimitives(
    id: string,
    email: string,
    hashedPassword: string,
    role: string,
    phone: string,
    first_name: string,
    last_name: string,
    createdAt?: Date
  ): Promise<User> {
    const emailObj = Email.create(email);
    const passwordObj = Password.fromHash(hashedPassword);

    return new User(
      id,
      emailObj,
      passwordObj,
      role,
      phone,
      first_name,
      last_name,
      createdAt || new Date()
    );
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getEmail(): Email {
    return this.email;
  }

  public getPassword(): Password {
    return this.password;
  }

  public getRole(): string {
    return this.role;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getFirstName(): string {
    return this.first_name;
  }

  public getLastName(): string {
    return this.last_name;
  }

  public async validatePassword(plainPassword: string): Promise<boolean> {
    return await this.password.compare(plainPassword);
  }
}
