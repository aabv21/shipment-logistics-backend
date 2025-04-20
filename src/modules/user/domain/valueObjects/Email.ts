export class Email {
  private constructor(private readonly value: string) {}

  public static create(email: string): Email {
    if (!this.isValidEmail(email)) {
      throw new Error("Invalid email format");
    }
    return new Email(email);
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public getValue(): string {
    return this.value;
  }
}
