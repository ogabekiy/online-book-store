import { pool } from "../../common/database/database.service.js";
import CustomError from "../../common/exceptionFilter/custom.error.js";
import { addBookVal } from "./validators/addBook.validator.js";

export async function addBook(req, res, next) {
  try {
    const newBook = req.body;

    const { error } = addBookVal.validate(newBook);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }

    const result = await pool.query(
      `
        INSERT INTO books(title,author,publisher_id,category_id,price) VALUES ($1,$2,$3,$4,$5)
        `,
      [
        newBook.title,
        newBook.author,
        newBook.publisher_id,
        newBook.category_id,
        newBook.price,
      ]
    );
    res.status(200).send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f9;
              color: #333;
              text-align: center;
              padding: 50px;
            }
            .message {
              background-color: #e0f7e9;
              border: 1px solid #b2d9b1;
              border-radius: 5px;
              padding: 20px;
              display: inline-block;
            }
            .message h1 {
              color: #4caf50;
            }
          </style>
        </head>
        <body>
          <div class="message">
            <h1>Kitob muvaffaqiyatli qo'shildi!</h1>
            <p>Yangi kitobingiz bazaga muvaffaqiyatli qo'shildi.</p>
          </div>
        </body>
      </html>
    `);
  } catch (err) {
    console.log(err.message);
    next(err);
  }
}
export async function getAllBooks(req, res, next) {
  try {
    const result = await pool.query(`
        SELECT * FROM books
        `);
      const books = result.rows
    res.status(200).send(`<!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kitoblar Ro'yxati</title>
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
            max-width: 900px;
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
          <h1>Kitoblar Ro'yxati</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Muallif</th>
                <th>Publisher ID</th>
                <th>Kategoriya ID</th>
                <th>Narx</th>
              </tr>
            </thead>
            <tbody>
              ${books.map(book => `
                <tr>
                  <td>${book.id}</td>
                  <td>${book.title}</td>
                  <td>${book.author}</td>
                  <td>${book.publisher_id}</td>
                  <td>${book.category_id}</td>
                  <td>${book.price}</td>
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
export async function getBookById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
        SELECT * FROM books WHERE id=$1
        `,
      [id]
    );
    if (!result) {
      throw new CustomError("Bunday Id li book yoq", 403);
    }
    const book = result.rows[0]
    res.status(200).send(` <!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kitob Ma'lumotlari</title>
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
            width: 80%;
            max-width: 600px;
          }
          h1 {
            text-align: center;
            color: #333;
          }
          .book-info {
            margin-top: 20px;
          }
          .book-info p {
            font-size: 18px;
            margin: 10px 0;
          }
          .book-info span {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Kitob Ma'lumotlari</h1>
          <div class="book-info">
            <p><span>ID:</span> ${book.id}</p>
            <p><span>Nom:</span> ${book.title}</p>
            <p><span>Muallif:</span> ${book.author}</p>
            <p><span>Publisher ID:</span> ${book.publisher_id}</p>
            <p><span>Kategoriya ID:</span> ${book.category_id}</p>
            <p><span>Narx:</span> ${book.price}</p>
          </div>
        </div>
      </body>
      </html>`);
  } catch (err) {
    next(err);
    console.log(err.message);
  }
}
export async function updateBook(req, res, next) {
  try {
    const { id } = req.body;
    const updateBook = req.body;
    const dbBook = await pool.query(
      `
        SELECT * FROM books WHERE id=$1
        `,
      [id]
    );
    if (!dbBook) {
      throw new CustomError("Bunday Id li Book yoq", 403);
    }
    const newUpdatedBook = { ...dbBook.rows[0], ...updateBook };

    const result = await pool.query(
      `
        UPDATE books SET title=$1,author=$2,publisher_id=$3,category_id=$4,price=$5 WHERE id=$6
        `,
      [
        newUpdatedBook.title,
        newUpdatedBook.author,
        newUpdatedBook.publisher_id,
        newUpdatedBook.category_id,
        newUpdatedBook.price,
        id,
      ]
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
            <h1>Muvaffaqiyatli yangilandi!</h1>
            <p>Kitob muvaffaqiyatli yangilandi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    next(err);
    console.log("Book yangilashda xatolik boldi");
  }
}
export async function deleteBook(req, res, next) {
  try {
    // const { id } = req.body;
    const { id } = req.params;
    // console.log(req.query);
    // console.log(id);
    const dbBook = await pool.query(
      `
          SELECT * FROM books WHERE id=$1
          `,
      [id]
    );
    if (!dbBook) {
      throw new CustomError("Bunday id li Book yoq", 403);
    }

    const result = await pool.query(
      `
        DELETE FROM books WHERE id=$1
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
            <h1>Muvaffaqiyatli o'chirildi!</h1>
            <p>Kitob muvaffaqiyatli o'chirildi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    next(err);
    console.log(err.message);
  }
}
