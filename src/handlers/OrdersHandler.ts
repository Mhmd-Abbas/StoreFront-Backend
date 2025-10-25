import express, { Request, Response } from "express";
import { Order, Orders } from "../models/Orders";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { TOKEN_SECRET } = process.env;

const store = new Orders();

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.params.id as unknown as number);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const order = {
    user_id: req.body.user_id as number,
    status: req.body.status as string,
  };

  try {
    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const order = await store.delete(req.params.id as unknown as number);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const addProduct = async (req: Request, res: Response) => {

  try {
    const orderProduct = await store.addProduct(
      req.body.order_id as number,
      req.body.product_id as number,
      req.body.quantity as number
    );
    res.json(orderProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const showProducts = async (req: Request, res: Response) => {
  try {
    const products = await store.showProducts(req.params.id as unknown as number);
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const showCurrentOrder = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token as string, TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`invalid token ${err}`);
    return;
  }

  try {
    const order = await store.showCurrentOrder(
      req.params.user_id as unknown as number
    );
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const showCompletedOrders = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(token as string, TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`invalid token ${err}`);
    return;
  }

  try {
    const order = await store.showCurrentOrder(
      req.params.user_id as unknown as number
    );
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const OrdersRoutes = (app: express.Application) => {
  app.get("/Orders", index);
  app.get("/Orders/:id", show);
  app.post("/Orders", create);
  app.delete("/Orders/:id", destroy);
  app.post("/Order_Products", addProduct);
  app.get("/Order_Products/:id", showProducts);
  app.get("/Orders/Active/:user_id", showCurrentOrder);
  app.get("/Orders/Completed/:user_id", showCompletedOrders);
};

export default OrdersRoutes;
