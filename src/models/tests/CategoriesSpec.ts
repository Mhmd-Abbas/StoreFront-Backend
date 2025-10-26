import { Category, Categories } from "../Categories";

const store = new Categories();
let testcat: Category;

describe("Categories Model", () => {

  beforeAll( async() => {
    testcat = await store.create({
      name: "TESTCategory",
    } as Category)
  })

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("create method should add a Category", async () => {
    const result = await store.create({
      name: "newCategory",
    } as Category);

    expect(result).toEqual({
      id: jasmine.any(Number),
      name: "newCategory",
    });

    await store.delete(result.id as number)

  });

  it("show method should return the correct Category", async () => {
    const result = await store.show(testcat.id as number);

    expect(result).toEqual({
      id: testcat.id as number,
      name: "TESTCategory",
    });
  });

  it("delete method should remove the Category", async () => {
    store.delete(testcat.id as number);
    const result = await store.show(testcat.id as number);

    expect(result).toBeUndefined();
  });

});
