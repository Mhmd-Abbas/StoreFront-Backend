import supertest from "supertest";
import app from "../../server";
import dotenv from "dotenv"
import { Categories, Category } from "../Categories";
import { Product, Products } from "../Products";

dotenv.config();

const { TEST_TOKEN } = process.env;

const CatStore = new Categories();
let testcat: Category;

const request = supertest(app);

describe("Endpoint Tests", () => {

  beforeAll(async () => {
    testcat = await CatStore.create({
      name:"test"
    } as Category)
  })

  describe("Products Endpoints", () => {

    it("GET /Products - should return a list of products", async () => {
      const response = await request.get("/Products");
      expect(response.status).toBe(200);
    });

    it("GET /Products/:id - should return a single specific product", async () => {
      const response = await request.get(`/Products/1`);
      expect(response.status).toBe(200);
    });

    it("POST /Products - should create a product (token required)", async () => {

      const response = await request
        .post("/Products")
        .send({
          name: "Test Product",
          price: 99,
          category_id: testcat.id as number,
          token: TEST_TOKEN
        });

      expect(response.status).toBe(200);
    });
  });


  describe("Users Endpoints", () => {
    it("POST /Users - should create a new user (token required)", async () => {
      const response = await request.post("/Users")
      .send({
        firstname: "new",
        lastname: "user",
        password: "123456",
        token: TEST_TOKEN
      });

      expect(response.status).toBe(200);
    });

    it("GET /Users - should return all users (token required)", async () => {
      const response = await request
        .get("/Users")
        .send({
          token: TEST_TOKEN
        })

      expect(response.status).toBe(200);
    });

    it("GET /Users/:id - should return a single user (token required)", async () => {
      const response = await request
        .get("/users/1")
        .send({
          token: TEST_TOKEN
        })

      expect(response.status).toBe(200);
    });
  });


  describe("Orders Endpoints", () => {
    it("GET /Orders/Active/:user_id - should return current active order for a user", async () => {

      const response = await request
        .get("/Orders/Active/1")
        .send({
          token: TEST_TOKEN
        })

      expect(response.status).toBe(200);
    });

    it("GET /Orders/Completed/:user_id - should return completed orders for a user", async () => {
      const response = await request
        .get("/orders/completed/1")
        .send({
          token: TEST_TOKEN
        })

      expect(response.status).toBe(200);
    });
  });
});
