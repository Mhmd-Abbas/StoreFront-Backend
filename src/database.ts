import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_NAME,
  POSTGRES_PASS,
  POSTGRES_PORT,
  ENV,
  POSTGRES_TEST_DB,
} = process.env;

let client;

if (ENV === "test") {
  client = new Pool({
    host: POSTGRES_HOST as string,
    database: POSTGRES_TEST_DB as string,
    user: POSTGRES_NAME as string,
    password: POSTGRES_PASS as string,
    port: POSTGRES_PORT ? parseInt(POSTGRES_PORT) : 5432,
  });
}

if (ENV === "dev") {
  client = new Pool({
    host: POSTGRES_HOST as string,
    database: POSTGRES_DB as string,
    user: POSTGRES_NAME as string,
    password: POSTGRES_PASS as string,
    port: POSTGRES_PORT ? parseInt(POSTGRES_PORT) : 5432,
  });
}

export default client;
