import express, { Request, Response } from "express";
import { User, Users } from "../models/Users";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const { TOKEN_SECRET } = process.env;

const store = new Users();

const index = async (req: Request, res: Response) => {

  try {
    jwt.verify(req.body.token, TOKEN_SECRET as string);
  } catch (err) {
    res.status(401);
    res.json(`invalid token ${err}`);
    return;
  }

  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const show = async (req: Request, res: Response) => {
  try {
      jwt.verify(req.body.token, TOKEN_SECRET as string);
    } catch (err) {
      res.status(401);
      res.json(`invalid token ${err}`);
      return;
    }

  try {
    const user = await store.show(req.params.id as unknown as number);
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  
  const user = {
      firstname: req.body.firstName as string,
      lastname: req.body.lastName as string,
      password: req.body.pass as string,
  };

  try {
      jwt.verify(req.body.token, TOKEN_SECRET as string);
    } catch (err) {
      res.status(401);
      res.json(`invalid token ${err}`);
      return;
    }

  try{
    const newUser = await store.create(user);
    var token = jwt.sign({ firstName:newUser.firstname, lastName:newUser.lastname}, TOKEN_SECRET as string);
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const user = await store.delete(req.params.id as unknown as number);
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const password = await store.authenticate(req.body.firstName as string, req.body.lastName as string, req.body.password as string);
    res.json(password);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const UsersRoutes = (app: express.Application) => {
  app.get("/Users", index);
  app.get("/Users/:id", show);
  app.post("/Users", create);
  app.delete("/Users/:id", destroy);
  app.post("/Users/Authenticate", authenticate);
};

export default UsersRoutes;
