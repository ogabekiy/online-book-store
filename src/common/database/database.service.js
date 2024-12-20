import pkg from "pg";
import { getConfig } from "../config/config.service.js";
const { Pool } = pkg;

export const pool = new Pool({
  database: getConfig("DATABASE_NAME"),
  user: getConfig("DATABASE_USER"),
  password: getConfig("DATABASE_PASSWORD"),
  host: getConfig("DATABASE_HOST"),
  port: parseInt(getConfig("DATABASE_PORT")),
});
export async function ConnectToDb() {
  try {
    await pool.connect();
    console.log("Bazaga ulandi");
  } catch (err) {
    console.log("Databasega ulanishda xatolik boldi", err.message);
  }
}
export async function setUpModels() {
  try {
    await pool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_roles') THEN
          CREATE TYPE user_roles AS ENUM ('Admin', 'User', 'Seller');
        END IF;
      END$$;
    
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        role user_roles,
        status VARCHAR DEFAULT 'false'
      );
    `);

    await pool.query(
      `CREATE TABLE IF NOT EXISTS categories(
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL
          )`
    );
    await pool.query(
      `
      CREATE TABLE IF NOT EXISTS publishers(
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL,
      address VARCHAR NOT NULL
      )
      `
    );
    await pool.query(
      `
      CREATE TABLE IF NOT EXISTS books(
      id SERIAL PRIMARY KEY,
      title VARCHAR NOT NULL,
      author VARCHAR NOT NULL,
      publisher_id INTEGER NOT NULL,
      category_id INTEGER NOT NULL,
      price FLOAT NOT NULL,
      FOREIGN KEY (publisher_id) REFERENCES publishers(id),
      FOREIGN KEY(category_id) REFERENCES categories(id)
      )
      `
    );
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders(
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL,
      book_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      total_price FLOAT NOT NULL
      )
      `);
  } catch (err) {
    console.log("Jadvallar yaratishda xatolik bo'ldi", err.message);
  }
}
export async function initDatabase() {
  await ConnectToDb();
  await setUpModels();
}
