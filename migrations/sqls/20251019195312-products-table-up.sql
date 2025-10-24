CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    price INT,
    category_id INT REFERENCES categories(id)
);