import { before } from "node:test";
import { Categories, Category } from "../Categories";
import { Order, Orders } from "../Orders";
import { Product, Products } from "../Products";
import { User, Users } from "../Users";

const store = new Orders();
const UsersStore = new Users();

let testuser: User
let testorder: Order


describe("Orders Model", () => {

  beforeAll( async() => {

    testuser = await UsersStore.create({
      firstname: "test",
      lastname: "test",
      password: "test"
    } as User);

    testorder = await store.create({
      user_id: testuser.id as number,
      status: "active"
    } as Order)
  })

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("create method should add a Order", async () => {
    const result = await store.create({
      user_id: testuser.id as number,
      status: "active"
    } as Order);

    expect(result).toEqual({
      id: jasmine.any(Number),
      user_id: testuser.id as number,
      status: "active"
    });

    await store.delete(result.id as number)
  });

  it("show method should return the correct Order", async () => {
    const result = await store.show(testorder.id as number);

    expect(result).toEqual({
      id: testorder.id as number,
      user_id: testorder.user_id as number,
      status: testorder.status as string
    });

    await store.delete(result.id as number)
  });

  it("delete method should remove the Order", async () => {
    await store.delete(testorder.id as number);
    const result = await store.show(testorder.id as number);

    expect(result).toBeUndefined();
  });

  afterAll( async() => {
    await UsersStore.delete(testuser.id as number)
  })

});
