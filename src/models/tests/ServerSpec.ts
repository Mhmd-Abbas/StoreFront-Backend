import supertest from "supertest";
import app from "../../server";
import { Categories, Category } from "../Categories";
import { Products } from "../Products";
import { Users } from "../Users";


const CatStore = new Categories();
const ProductStore = new Products();
const UsersStore = new Users();
let testcat: Category;
let TEST_TOKEN: string;

const request = supertest(app);

describe("Endpoint Tests", () => {

  beforeAll(async () => {
    testcat = await CatStore.create({
      name:"test"
    } as Category)

  })

  describe("Users Endpoints", () => {
    it("POST /Users - should create a new user (token required)", async () => {
      const response = await request.post("/Users")
      .send({
        firstname: "inside ServerSpec",
        lastname: "new user",
        password: "123456",
      });

      TEST_TOKEN = response.body.token
      expect(response.status).toBe(200);
      await UsersStore.delete(response.body.id)
    });

    it("GET /Users - should return all users (token required)", async () => {
      const response = await request
        .get("/Users")
        .set("Authorization", `Bearer ${TEST_TOKEN}`)
      expect(response.status).toBe(200);
    });

    it("GET /Users/:id - should return a single user (token required)", async () => {
      const response = await request
        .get("/users/1")
        .set("Authorization", `Bearer ${TEST_TOKEN}`)

      expect(response.status).toBe(200);
    });
  });


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
         .set("Authorization", `Bearer ${TEST_TOKEN}`)
        .send({
          name: "Test Product",
          price: 99,
          category_id: testcat.id as number,
        });

      expect(response.status).toBe(200);
      await ProductStore.delete(response.body.id);
    });
  });


  describe("Orders Endpoints", () => {
    it("GET /Orders/Active/:user_id - should return current active order for a user", async () => {

      const response = await request
        .get("/Orders/Active/1")
        .set("Authorization", `Bearer ${TEST_TOKEN}`)

      expect(response.status).toBe(200);
    });

    it("GET /Orders/Completed/:user_id - should return completed orders for a user", async () => {
      const response = await request
        .get("/orders/completed/1")
        .set("Authorization", `Bearer ${TEST_TOKEN}`)

      expect(response.status).toBe(200);
    });
  });

  afterAll( async () => {
    await CatStore.delete(testcat.id as number)
  })
  
});
