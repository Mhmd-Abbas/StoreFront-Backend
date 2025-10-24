//@ts-ignore
import client from "../database";

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export class Orders {
  async index(): Promise<Order[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql =
      `SELECT orders.id,
       orders.user_id,
       order_products.product_id,
       order_products.quantity,
       orders.status
       FROM orders JOIN order_products ON orders.id = order_products.order_id
      `;

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const sql =
      `SELECT * FROM orders WHERE id = $1`;
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`cannot get Order ${err}`);
    }
  }


  async create(o: Order): Promise<Order> {
    try {
      const sql =
        "INSERT INTO orders (user_id, status) VALUES($1,$2) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [o.user_id, o.status]);

      const order = result.rows[0];

      conn.release();

      return order;
    } catch (err) {
      throw new Error(`Could not add new Order ${o.id}. Error: ${err}`);
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const sql = `DELETE FROM orders where id = $1 RETURNING *`;
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();
      const order = result.rows[0];

      return order;
    } catch (err) {
      throw new Error(`could not delete Order ${id}. \n ${err}`);
    }
  }

  async addProduct(order_id: number, product_id:number, quantity:number): Promise<any> {
    try {
      const sql =
        "INSERT INTO order_products (order_id, product_id, quantity) VALUES($1,$2,$3) RETURNING *";
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [order_id, product_id, quantity]);

      const order_Product = result.rows[0];

      conn.release();

      return order_Product;
    } catch (err) {
      throw new Error(`Could not add new Product to Order ${order_id} ${product_id}. Error: ${err}`);
    }
  }

 async deleteProduct(id: number): Promise<any> {
    try {
      const sql = `DELETE FROM order_products where id = $1 RETURNING *`;
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();
      const order = result.rows[0];

      return order;
    } catch (err) {
      throw new Error(`could not delete Order ${id}. \n ${err}`);
    }
  }

  async showProducts(id: number): Promise<any> {
    try {
      const sql =
      `SELECT orders.id,
       orders.user_id,
       order_products.product_id,
       order_products.quantity,
       orders.status
       FROM orders JOIN order_products ON orders.id = order_products.order_id
       WHERE order_id = $1 
      `;
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      const order_Products = result.rows[0];

      conn.release();

      return order_Products;
    } catch (err) {
      throw new Error(`Could not get Order Products ${id}. Error: ${err}`);
    }
  }

  async showCurrentOrder(user_id: number): Promise<Order> {
    try {
      const sql = `SELECT * FROM orders where user_id = $1 and status = 'active'`;
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [user_id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`cannot get Order ${err}`);
    }
  }

  async showCompletedOrders(user_id: number): Promise<Order> {
    try {
      const sql = `SELECT * FROM orders where user_id = $1 and status = 'complete'`;
      //@ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [user_id]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`cannot get Order ${err}`);
    }
  }

}
