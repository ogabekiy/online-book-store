import { pool } from "../../common/database/database.service.js";
import CustomError from "../../common/exceptionFilter/custom.error.js";
import { addCategoryVal } from "./validators/add.validator.js";
export async function addCategory(req, res, next) {
  try {
    const newCategory = req.body;

    const { error } = addCategoryVal.validate(newCategory);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }

    const result = await pool.query(
      `
        INSERT INTO categories(name) VALUES ($1)
        `,
      [newCategory.name]
    );
    res.status(200).send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #d4edda;
              color: #155724;
              text-align: center;
              padding: 50px;
            }
            .success-message {
              background-color: #c3e6cb;
              border: 1px solid #b1dfbb;
              border-radius: 5px;
              padding: 20px;
              display: inline-block;
            }
            .success-message h1 {
              color: #155724;
            }
          </style>
        </head>
        <body>
          <div class="success-message">
            <h1>Muvaffaqiyatli qo'shildi!</h1>
            <p>Categoriya muvaffaqiyatli qo'shildi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    console.log(err.message);
    next(err);
  }
}
export async function getAll(req, res, next) {
  try {
    const result = await pool.query(`
        SELECT * FROM categories
        `);
      const categories = result.rows
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kategoriyalar</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 800px;
          }
          h1 {
            text-align: center;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Kategoriyalar</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
              </tr>
            </thead>
            <tbody>
              ${categories.map(category => `
                <tr>
                  <td>${category.id}</td>
                  <td>${category.name}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>`);
  } catch (err) {
    next(err);
    console.log(err.message);
  }
}
export async function getById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
        SELECT * FROM categories WHERE id=$1
        `,
      [id]
    );
    if (!result) {
      throw new CustomError("Bunday Id li categoriya yoq", 403);
    }
    const category = result.rows[0]
    res.status(200).send(`<!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kategoriya Ma'lumotlari</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
          }
          .container {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 500px;
          }
          h1 {
            text-align: center;
            color: #333;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Kategoriya Ma'lumotlari</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${category.id}</td>
                <td>${category.name}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </body>
      </html>`);
  } catch (err) {
    next(err);
    console.log(err.message);
  }
}
export async function updateCategory(req, res, next) {
  try {
    const { id } = req.body;
    const updateCategory = req.body;
    const dbCtgry = await pool.query(
      `
        SELECT * FROM categories WHERE id=$1
        `,
      [id]
    );
    if (!dbCtgry) {
      throw new CustomError("Bunday Id li Categoriya yoq", 403);
    }
    const newUpdatedCategory = { ...dbCtgry.rows[0], ...updateCategory };

    const result = await pool.query(
      `
        UPDATE categories SET name=$1 WHERE id=$2
        `,
      [newUpdatedCategory.name, id]
    );

    res.status(200).send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #d1ecf1;
              color: #0c5460;
              text-align: center;
              padding: 50px;
            }
            .success-message {
              background-color: #bee5eb;
              border: 1px solid #b6d4fe;
              border-radius: 5px;
              padding: 20px;
              display: inline-block;
            }
            .success-message h1 {
              color: #0c5460;
            }
          </style>
        </head>
        <body>
          <div class="success-message">
            <h1>Muvaffaqiyatli yangilandi!</h1>
            <p>Categoriya muvaffaqiyatli yangilandi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    next(err);
    console.log("Categoriya yangilashda xatolik boldi");
  }
}
export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const dbctg = await pool.query(
      `
          SELECT * FROM categories WHERE id=$1
          `,
      [id]
    );
    if (!dbctg) {
      throw new CustomError("Bunday id li Categoriya yoq", 403);
    }

    const result = await pool.query(
      `
        DELETE FROM categories WHERE id=$1
        `,
      [id]
    );

    res.status(200).send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f8d7da;
              color: #721c24;
              text-align: center;
              padding: 50px;
            }
            .success-message {
              background-color: #f5c6cb;
              border: 1px solid #f1b0b7;
              border-radius: 5px;
              padding: 20px;
              display: inline-block;
            }
            .success-message h1 {
              color: #721c24;
            }
          </style>
        </head>
        <body>
          <div class="success-message">
            <h1>O'chirish Muvaffaqiyatli!</h1>
            <p>Categoriya muvaffaqiyatli o'chirildi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    next(err);
    console.log(err.message);
  }
}
