import express, { Request, Response } from "express";
import { Product, Products } from "../models/Products";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { TOKEN_SECRET } = process.env;

const store = new Products();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id as unknown as number);
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const product = {
    name: req.body.name as string,
    price: req.body.price as number,
    category_id: req.body.category_id as number,
  };

  try {
    jwt.verify(req.body.token, TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`invalid token ${err}`);
    return;
  }

  try {
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const product = await store.delete(req.params.id as unknown as number);
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const ProductsRoutes = (app: express.Application) => {
  app.get("/Products", index);
  app.get("/Products/:id", show);
  app.post("/Products", create);
  app.delete("/Products/:id", destroy);
};

export default ProductsRoutes;
