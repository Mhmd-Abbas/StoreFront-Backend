//@ts-ignore
import client from "../database";

export type Category = {
  id?: number;
  name: string;
};

export class Categories {
  async index(): Promise<Category[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = "SELECT * FROM categories";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get categories. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Category> {
    try {
      const sql = `SELECT * FROM categories where id = $1`;
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`cannot get Category ${err}`);
    }
  }

  async create(c: Category): Promise<Category> {
    try {
      const sql = "INSERT INTO categories (name) VALUES($1) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [c.name]);

      const category = result.rows[0];

      conn.release();

      return category;
    } catch (err) {
      throw new Error(`Could not add new category ${c.name}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Category> {
    try {
      const sql = `DELETE FROM categories where id = $1 RETURNING *`;
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();
      const category = result.rows[0];

      return category;
    } catch (err) {
      throw new Error(`could not delete Category ${id}. \n ${err}`);
    }
  }
}
