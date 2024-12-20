import { pool } from "../../common/database/database.service.js";
import CustomError from "../../common/exceptionFilter/custom.error.js";
import { addPublisherVal } from "./validators/add.validator.js";
export async function addPublisher(req, res, next) {
  try {
    const newPublisher = req.body;
    console.log(newPublisher);
    const { error } = addPublisherVal.validate(newPublisher);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }

    const result = await pool.query(
      `
        INSERT INTO publishers(name,address) VALUES ($1,$2)
        `,
      [newPublisher.name, newPublisher.address]
    );
    res.status(200).send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #e2e3e5;
              color: #383d41;
              text-align: center;
              padding: 50px;
            }
            .success-message {
              background-color: #d4edda;
              border: 1px solid #c3e6cb;
              border-radius: 5px;
              padding: 20px;
              display: inline-block;
            }
            .success-message h1 {
              color: #155724;
            }
            .success-message p {
              font-size: 1.2em;
            }
          </style>
        </head>
        <body>
          <div class="success-message">
            <h1>Publisher Muvaffaqiyatli Qo'shildi!</h1>
            <p>Publisher tizimga muvaffaqiyatli qo'shildi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    console.log(err.message);
    next(err);
  }
}
export async function getAllPublishers(req, res, next) {
  try {
    const result = await pool.query(`
        SELECT id,name,address FROM publishers
        `);
      const publishers = result.rows
    res.status(200).send(`<!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Publisherlar Ro'yxati</title>
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
            max-width: 800px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
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
          <h1>Publisherlar Ro'yxati</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Manzil</th>
              </tr>
            </thead>
            <tbody>
              ${publishers.map(publisher => `
                <tr>
                  <td>${publisher.id}</td>
                  <td>${publisher.name}</td>
                  <td>${publisher.address}</td>
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
export async function getPublisherById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
        SELECT id,name,address FROM publishers WHERE id=$1
        `,
      [id]
    );
    if (!result) {
      throw new CustomError("Bunday Id li Publisher yoq", 403);
    }
    const publisher = result.rows[0]
    res.status(200).send(`<!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Publisher Ma'lumotlari</title>
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
          .error {
            color: red;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Publisher Ma'lumotlari</h1>
          <table>
            <tbody>
              <tr>
                <th>ID</th>
                <td>${publisher.id}</td>
              </tr>
              <tr>
                <th>Nom</th>
                <td>${publisher.name}</td>
              </tr>
              <tr>
                <th>Manzil</th>
                <td>${publisher.address}</td>
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
export async function updatePublisher(req, res, next) {
  try {
    const { id } = req.body;
    const updatePublisher = req.body;
    const dbPblshr = await pool.query(
      `
        SELECT * FROM publishers WHERE id=$1
        `,
      [id]
    );
    if (!dbPblshr) {
      throw new CustomError("Bunday Id li Publisher yoq", 403);
    }
    const newUpdatedPublisher = { ...dbPblshr.rows[0], ...updatePublisher };

    const result = await pool.query(
      `
        UPDATE publishers SET name=$1,address=$2 WHERE id=$3
        `,
      [newUpdatedPublisher.name, newUpdatedPublisher.address, id]
    );

    res.status(200).send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f8f9fa;
              color: #495057;
              text-align: center;
              padding: 50px;
            }
            .success-message {
              background-color: #d1e7dd;
              border: 1px solid #badbcc;
              border-radius: 5px;
              padding: 20px;
              display: inline-block;
            }
            .success-message h1 {
              color: #0f5132;
            }
            .success-message p {
              font-size: 1.2em;
            }
          </style>
        </head>
        <body>
          <div class="success-message">
            <h1>Publisher Muvaffaqiyatli Yangilandi!</h1>
            <p>Publisher ma'lumotlari muvaffaqiyatli yangilandi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    next(err);
    console.log("Publisher yangilashda xatolik boldi");
  }
}
export async function deletePublisher(req, res, next) {
  try {
    const { id } = req.params;
    const dbPb = await pool.query(
      `
          SELECT * FROM publishers WHERE id=$1
          `,
      [id]
    );
    if (!dbPb) {
      throw new CustomError("Bunday id li Publisher yoq", 403);
    }

    const result = await pool.query(
      `
        DELETE FROM publishers WHERE id=$1
        `,
      [id]
    );

    res.status(200).send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f8f9fa;
              color: #495057;
              text-align: center;
              padding: 50px;
            }
            .success-message {
              background-color: #d1e7dd;
              border: 1px solid #badbcc;
              border-radius: 5px;
              padding: 20px;
              display: inline-block;
            }
            .success-message h1 {
              color: #0f5132;
            }
            .success-message p {
              font-size: 1.2em;
            }
          </style>
        </head>
        <body>
          <div class="success-message">
            <h1>Publisher muvaffaqiyatli o'chirildi!</h1>
            <p>Publisher ma'lumotlari muvaffaqiyatli o'chirildi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    next(err);
    console.log(err.message);
  }
}
