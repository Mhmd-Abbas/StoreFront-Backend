import express, { Request, Response } from "express";
import { Category, Categories } from "../models/Categories";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { TOKEN_SECRET } = process.env;

const store = new Categories();

const index = async (_req: Request, res: Response) => {
  try {
    const categories = await store.index();
    res.json(categories);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const category = await store.show(req.params.id as unknown as number);
    res.json(category);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const category = {
      name: req.body.name as string,
  };
  
  try {
    jwt.verify(req.body.token,TOKEN_SECRET as string)
  } catch (err) {
    res.status(401)
    res.json(`invalid token ${err}`)
    return
  }

  try {
    const newCategory = await store.create(category);
    res.json(newCategory);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const category = await store.delete(req.params.id as unknown as number);
    res.json(category);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const CategoriesRoutes = (app: express.Application) => {
  app.get("/Categories", index);
  app.get("/Categories/:id", show);
  app.post("/Categories", create);
  app.delete("/Categories/:id", destroy);
};

export default CategoriesRoutes;
