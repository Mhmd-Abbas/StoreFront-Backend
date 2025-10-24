//@ts-ignore
import client from "../database";

export type Product = {
  id?: number;
  name: string;
  price: number;
  category_id: number;
};

export class Products {
  async index(): Promise<Product[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = "SELECT * FROM products";

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Products. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = `SELECT * FROM products where id = $1`;
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`cannot get Product ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const sql =
        "INSERT INTO Products (name, price, category_id) VALUES($1,$2,$3) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [p.name, p.price, p.category_id]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not add new Product ${p.name}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Product> {
    try {
      const sql = `DELETE FROM products where id = $1 RETURNING *`;
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();
      const product = result.rows[0];

      return product;
    } catch (err) {
      throw new Error(`could not delete Product ${id}. \n ${err}`);
    }
  }

}
