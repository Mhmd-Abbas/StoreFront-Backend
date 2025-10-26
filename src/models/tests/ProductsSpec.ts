import { Categories, Category } from "../Categories";
import { Product, Products } from "../Products";

const store = new Products();
const CatStore = new Categories();
let testcat: Category
let testproduct: Product

describe("Products Model", () => {

  beforeAll(async() => {

    testcat = await CatStore.create({
      name: "insideProductTest"
    } as Category)

    testproduct = await store.create({
      name: "insideProductTest",
      price: 1,
      category_id: testcat.id as number
    } as Product);
  })

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("create method should add a Product", async () => {
    const result = await store.create({
      name: "newProduct",
      price: 20,
      category_id: testcat.id as number
    } as Product);

    expect(result).toEqual({
      id: jasmine.any(Number),
      name: "newProduct",
      price: 20,
      category_id: testcat.id as number
    });

    await store.delete(result.id as number)

  });

  it("show method should return the correct Product", async () => {
    const result = await store.show(testproduct.id as number);

    expect(result).toEqual({
      id: testproduct.id as number,
      name: testproduct.name as string,
      price: testproduct.price as number,
      category_id: testproduct.category_id as number
    });
  });

  it("delete method should remove the Product", async () => {
    await store.delete(testproduct.id as number);
    const result = await store.show(testproduct.id as number);

    expect(result).toBeUndefined();
  });

  afterAll(async() => {
    await CatStore.delete(testcat.id as number)
  })
  
});
