import { Pool } from "pg";
import { IUserRepository } from "@user/domain/repositories/IUserRepository";
import { User } from "@user/domain/entities/User";
import { PostgresConfig } from "@config/databases/postgres/PostgresConfig";

export class PostgresUserRepository implements IUserRepository {
  private readonly pool: Pool;

  constructor() {
    const postgresConfig = new PostgresConfig();
    this.pool = postgresConfig.getPool();
  }

  async save(user: User): Promise<void> {
    const query = `
      INSERT INTO users (email, password, role, phone, first_name, last_name, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    console.log(user.getEmail().getValue());
    console.log(user.getPassword().getValue());
    await this.pool.query(query, [
      user.getEmail().getValue(),
      user.getPassword().getValue(),
      user.getRole(),
      user.getPhone(),
      user.getFirstName(),
      user.getLastName(),
      user.getCreatedAt(),
    ]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const result = await this.pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const userData = result.rows[0];
    const user = await User.fromPrimitives(
      userData.id,
      userData.email,
      userData.password,
      userData.role,
      userData.phone,
      userData.first_name,
      userData.last_name,
      userData.created_at
    );

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    const userData = result.rows[0];
    const user = User.create(
      userData.email,
      userData.password,
      userData.role,
      userData.phone,
      userData.first_name,
      userData.last_name
    );
    return user;
  }
}
