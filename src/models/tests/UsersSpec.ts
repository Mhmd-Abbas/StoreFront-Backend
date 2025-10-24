import { User, Users } from "../Users";

const store = new Users();
let testuser: User

describe("Users Model", () => {

  beforeAll( async() => {
  
      testuser = await store.create({
        firstname: "test",
        lastname: "test",
        password: "test"
      } as User);
  })

  it("should have an index method", () => {
    expect(store.index).toBeDefined();
  });

  it("create method should add a User", async () => {
    const result = await store.create({
      firstname: "new firstName",
      lastname: "new lastName",
      password: "newPassword"
    } as User);

    expect(result).toEqual({
      id: jasmine.any(Number),
      firstname: result.firstname as string,
      lastname: result.lastname as string,
      password: jasmine.any(String)
    });

    await store.delete(result.id as number)

  });

  it("show method should return the correct User", async () => {
    const result = await store.show(testuser.id as number);

    expect(result).toEqual({
      id: testuser.id as number,
      firstname: testuser.firstname as string,
      lastname: testuser.lastname as string,
      password: testuser.password as string
    })
  });

  it("delete method should remove the User", async () => {
    store.delete(testuser.id as number);
    const result = await store.show(testuser.id as number);

    expect(result).toBeUndefined();
  });
});
