import bcrypt from "bcryptjs";

export class Password {
  private constructor(private readonly value: string) {}

  public static async create(password: string): Promise<Password> {
    if (!this.isValidPassword(password)) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return new Password(hashedPassword);
  }

  public static fromHash(hash: string): Password {
    return new Password(hash);
  }

  private static isValidPassword(password: string): boolean {
    return password.length >= 8;
  }

  public getValue(): string {
    return this.value;
  }

  public async compare(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.value);
  }
}
