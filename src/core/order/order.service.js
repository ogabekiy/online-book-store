import { pool } from "../../common/database/database.service.js";
import CustomError from "../../common/exceptionFilter/custom.error.js";
import { addOrderVal } from "./validators/addOrder.validator.js";

export async function addOrder(req, res, next) {
  try {
    const newOrder = req.body;
    console.log("new", newOrder);
    const user_id = req.user.id;
    const { error } = addOrderVal.validate(newOrder);
    if (error) {
      throw new CustomError(error.details[0].message, 400);
    }
    console.log(newOrder.book_id);
    const book_price = await pool.query(
      `
        SELECT * FROM books WHERE id=$1
        `,
      [parseInt(newOrder.book_id)]
    );
    // console.log("book", book_price.rows[0]);
    const total_price = newOrder.quantity * book_price.rows[0].price;
    // console.log(total_price);

    const result = await pool.query(
      `
        INSERT INTO orders(user_id,book_id,quantity,total_price) VALUES ($1,$2,$3,$4)
        `,
      [user_id, newOrder.book_id, newOrder.quantity, total_price]
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
            .success-message p {
              font-size: 1.2em;
            }
          </style>
        </head>
        <body>
          <div class="success-message">
            <h1>Buyurtma Muvaffaqiyatli Berildi!</h1>
            <p>Narxi: ${total_price} boldi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    console.log(err.message);
    next(err);
  }
}
export async function getAllOrders(req, res, next) {
  try {
    const userRole = req.user.role;
    if (userRole === "Admin") {
      const result = await pool.query(`
        SELECT * FROM orders
        `);
      const orders = result.rows
      res.status(200).send(`<!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Buyurtmalar</title>
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
            max-width: 1200px;
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
          <h1>Buyurtmalar Ro'yxati</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Kitob ID</th>
                <th>Miqdor</th>
                <th>Umumiy Narx</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(order => `
                <tr>
                  <td>${order.id}</td>
                  <td>${order.user_id}</td>
                  <td>${order.book_id}</td>
                  <td>${order.quantity}</td>
                  <td>${order.total_price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>`);
    }
    else{
    const userId = req.user.id;
    const result = await pool.query(
      `
        SELECT * FROM orders WHERE user_id=$1
        `,
      [userId]
    );
    const orders = result.rows
    res.status(200).send(`<!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Buyurtmalar</title>
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
            max-width: 1200px;
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
          <h1>Buyurtmalar Ro'yxati</h1>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Kitob ID</th>
                <th>Miqdor</th>
                <th>Umumiy Narx</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(order => `
                <tr>
                  <td>${order.id}</td>
                  <td>${order.user_id}</td>
                  <td>${order.book_id}</td>
                  <td>${order.quantity}</td>
                  <td>${order.total_price}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>`);}
  } catch (err) {
    next(err);
    console.log(err.message);
  }
}
export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
        SELECT * FROM orders WHERE id=$1
        `,
      [id]
    );
    if (!result) {
      throw new CustomError("Bunday Id li order yoq", 403);
    }
    const order = result.rows[0]
    res.status(200).send(`<!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Buyurtma</title>
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
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Buyurtma Ma'lumotlari</h1>
          <table>
            <tbody>
              <tr>
                <th>ID</th>
                <td>${order.id}</td>
              </tr>
              <tr>
                <th>User ID</th>
                <td>${order.user_id}</td>
              </tr>
              <tr>
                <th>Kitob ID</th>
                <td>${order.book_id}</td>
              </tr>
              <tr>
                <th>Miqdor</th>
                <td>${order.quantity}</td>
              </tr>
              <tr>
                <th>Umumiy Narx</th>
                <td>${order.total_price}</td>
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
export async function updateOrder(req, res, next) {
  try {
    let { id } = req.body; // buyurtma id
    const idd = parseInt(id);
    const updateOrder = req.body;
    const dbOrder = await pool.query(
      `
        SELECT user_id,book_id,quantity FROM orders WHERE id=$1
        `,
      [idd]
    );
    if (!dbOrder) {
      throw new CustomError("Bunday Id li Order yoq", 403);
    }

    const newUpdatedOrder = { ...dbOrder.rows[0], ...updateOrder };

    const book_price = await pool.query(
      `
        SELECT price FROM books WHERE id=$1
        `,
      [newUpdatedOrder.book_id]
    );
    const total_price = book_price.rows[0].price * newUpdatedOrder.quantity;
    const result = await pool.query(
      `
        UPDATE orders SET user_id=$1,book_id=$2,quantity=$3,total_price=$4 WHERE id=$5
        `,
      [
        newUpdatedOrder.user_id,
        newUpdatedOrder.book_id,
        newUpdatedOrder.quantity,
        total_price,
        idd,
      ]
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
            .update-message {
              background-color: #d6d8db;
              border: 1px solid #c6c8ca;
              border-radius: 5px;
              padding: 20px;
              display: inline-block;
            }
            .update-message h1 {
              color: #383d41;
            }
            .update-message p {
              font-size: 1.2em;
            }
          </style>
        </head>
        <body>
          <div class="update-message">
            <h1>Buyurtma muvaffaqiyatli yangilandi!</h1>
            <p>Yangilangan buyurtma muvaffaqiyatli saqlandi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    console.log(err);
    next(err);
    console.log("Order yangilashda xatolik boldi");
  }
}
export async function deleteOrder(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    if (req.user.role === "User") {
      const db = await pool.query(
        `
        SELECT user_id FROM orders WHERE id=$1
        `,
        [id]
      );
      if (db.rows[0].user_id !== userId) {
        throw new CustomError(
          "Bu buyurtmani bekor qilishga huquqingiz yetmaydi??",
          401
        );
      }
      const result = await pool.query(
        `
          DELETE FROM orders WHERE id=$1
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
              .delete-message {
                background-color: #f5c6cb;
                border: 1px solid #f1b0b7;
                border-radius: 5px;
                padding: 20px;
                display: inline-block;
              }
              .delete-message h1 {
                color: #721c24;
              }
              .delete-message p {
                font-size: 1.2em;
              }
            </style>
          </head>
          <body>
            <div class="delete-message">
              <h1>Buyurtma muvaffaqiyatli bekor qilindi!</h1>
              <p>Buyurtma tizimdan muvaffaqiyatli o'chirildi.</p>
            </div>
          </body>
        </html>
      `);
      
    }
    // const db = await pool.query(
    //   `
    //   SELECT user_id FROM orders WHERE id=$1
    //   `,
    //   [id]
    // );
    // if (db.rows[0].user_id !== userId) {
    //   throw new CustomError(
    //     "Bu buyurtmani bekor qilishga huquqingiz yetmaydi",
    //     401
    //   );
    // }
    const dbOrder = await pool.query(
      `
          SELECT * FROM orders WHERE id=$1
          `,
      [id]
    );
    if (!dbOrder) {
      throw new CustomError("Bunday id li order yoq", 403);
    }

    const result = await pool.query(
      `
        DELETE FROM orders WHERE id=$1
        `,
      [id]
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
            .success-message p {
              font-size: 1.2em;
            }
          </style>
        </head>
        <body>
          <div class="success-message">
            <h1>Order muvaffaqiyatli o'chirildi!</h1>
            <p>Buyurtma tizimdan muvaffaqiyatli o'chirildi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    next(err);
    console.log(err.message);
  }
}
