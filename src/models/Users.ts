//@ts-ignore
import client from "../database";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const { BCRYPT_PASSWORD, SALT_ROUNDS, PEPPER } = process.env;

export type User = {
  id?: number;
  firstname: string;
  lastname: string;
  password: string;
};

export class Users {
  async index(): Promise<User[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = "SELECT * FROM users";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = `SELECT * FROM users where id = $1`;
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`cannot get user ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const sql =
        "INSERT INTO users (firstname, lastname, password) VALUES($1, $2, $3) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();

      //@ts-ignore
      const hash = (bcrypt.hashSync(u.password + PEPPER, parseInt(SALT_ROUNDS))) as string;

      const result = await conn.query(sql, [u.firstname, u.lastname, hash]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not add new user ${u.firstname + " " + u.lastname}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const sql = `DELETE FROM users where id = $1 RETURNING *`;
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();
      const user = result.rows[0];

      return user;
    } catch (err) {
      throw new Error(`could not delete user ${id}. \n ${err}`);
    }
  }

  async authenticate(firstname: string, lastname: string, password: string): Promise<User | null> {
    //@ts-ignore
    const conn = await client.connect();
    const sql = "SELECT * FROM users WHERE firstname = $1 AND lastname = $2";

    const result = await conn.query(sql, [firstname, lastname]);

    if (result.rows.length) {
      const user = result.rows[0];

      if (bcrypt.compareSync(password + PEPPER, user.password)) {
        return user;
      }
    }

    return null;
  }
}
