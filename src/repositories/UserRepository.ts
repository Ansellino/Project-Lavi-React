import db from "../database/db";
import { User } from "../models";

export class UserRepository {
  findAll(): User[] {
    return db.prepare("SELECT * FROM user ORDER BY username").all() as User[];
  }

  findById(id: number): User | undefined {
    return db.prepare("SELECT * FROM user WHERE id = ?").get(id) as
      | User
      | undefined;
  }

  findByEmail(email: string): User | undefined {
    return db.prepare("SELECT * FROM user WHERE email = ?").get(email) as
      | User
      | undefined;
  }

  create(user: Omit<User, "id" | "created_at" | "updated_at">): User {
    const { lastInsertRowid } = db
      .prepare(
        "INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, ?)"
      )
      .run(user.username, user.email, user.password, user.role);

    return this.findById(Number(lastInsertRowid))!;
  }

  update(
    id: number,
    user: Partial<Omit<User, "id" | "created_at" | "updated_at">>
  ): User | undefined {
    const current = this.findById(id);
    if (!current) return undefined;

    const {
      username = current.username,
      email = current.email,
      password = current.password,
      role = current.role,
    } = user;

    db.prepare(
      "UPDATE user SET username = ?, email = ?, password = ?, role = ? WHERE id = ?"
    ).run(username, email, password, role, id);

    return this.findById(id);
  }

  delete(id: number): boolean {
    const { changes } = db.prepare("DELETE FROM user WHERE id = ?").run(id);
    return changes > 0;
  }
}
