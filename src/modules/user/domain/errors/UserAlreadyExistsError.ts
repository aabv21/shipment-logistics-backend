export class UserAlreadyExistsError extends Error {
  constructor() {
    super("Email already registered");
    this.name = "UserAlreadyExistsError";
  }
}
