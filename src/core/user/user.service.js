import { pool } from "../../common/database/database.service.js";
import bcrypt from "bcryptjs";
import { registerValidator } from "./validators/register.validator.js";
import jwt from "jsonwebtoken";
import { getConfig } from "../../common/config/config.service.js";
import { sendEmailConfirmation } from "../../common/service/mail.service.js";
import CustomError from "../../common/exceptionFilter/custom.error.js";

import { loginValidator } from "./validators/login.validator.js";
export const devices = {};

export async function userRegister(req, res, next) {
  try {
    const newUser = req.body;
    // const a = 4;
    // a = 5;
    const { error } = registerValidator.validate(newUser);
    if (error) {
      // return res.status(401).send(error.details[0].message);
      throw new CustomError(error.details[0].message, 400);
    }
    const dbUzer = await findUserByEmail(newUser.email);
    if (dbUzer) {
      // return res.status(401).send("Bunday email oldin royxatdan otgan");
      throw new CustomError("Bunday email oldin ro'yxatdan o'tgan", 401);
    }
    // console.log(dbUzer);
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    const result = await pool.query(
      `
        INSERT INTO users (name,email,password,role) VALUES($1,$2,$3,$4) RETURNING *
        `,
      [newUser.name, newUser.email, hashedPassword, newUser.role]
    );
    const emailConfirmationToken = await generateEmailConfirmationToken({
      email: newUser.email,
    });
    await sendEmailConfirmation(
      newUser.email,
      newUser.first_name,
      emailConfirmationToken
    );
    res
      .status(200)
      .send(
        `<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ro'yxatdan o'tish muvaffaqiyatli</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #e0f7fa;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
            text-align: center;
            width: 80%;
            max-width: 500px;
        }
        h1 {
            color: #00796b;
        }
        p {
            color: #004d40;
            font-size: 18px;
            margin-top: 10px;
        }
        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #00796b;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            cursor: pointer;
        }
        .btn:hover {
            background-color: #004d40;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Muvaffaqiyatli Ro'yxatdan O'tdingiz!</h1>
        <p>
            Tasdiqlash uchun sizning email manzilingizga tasdiqlash xati yuborildi. Iltimos, pochta qutingizni tekshirib ko'ring va tasdiqlashni amalga oshiring.
        </p>
        <a href="/" class="btn">Bosh Sahifaga O'tish</a>
    </div>
</body>
</html>
`
      );
  } catch (err) {
    console.log("Xatolik bo'ldi", err.message);
    next(err);
    // res.status(500).send("Erro" + err.message);
  }
}
export async function findUserByEmail(email) {
  const result = await pool.query(
    `
        SELECT * FROM users WHERE email=$1
        `,
    [email]
  );
  return result.rows[0];
}
export async function getAllUsers(req, res, next) {
  try {
    const result = await pool.query(`
        SELECT id,name,email,password,role FROM users
        `);
    const users = result.rows
    res.status(200).send(`<!DOCTYPE html>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>User Ma'lumotlari</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .container {
                    width: 90%;
                    max-width: 1200px;
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #00796b;
                    text-align: center;
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #00796b;
                    color: #fff;
                }
                tr:nth-child(even) {
                    background-color: #f2f2f2;
                }
                tr:hover {
                    background-color: #ddd;
                }
                .no-data {
                    text-align: center;
                    color: #777;
                    font-size: 1.2em;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>User Ma'lumotlari</h1>
                ${users.length === 0 ? 
                    '<p class="no-data">Hozircha foydalanuvchi mavjud emas.</p>' :
                    `<table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Ism</th>
                                <th>Email</th>
                                <th>Parol</th>
                                <th>Rol</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${users.map(user => `
                                <tr>
                                    <td>${user.id}</td>
                                    <td>${user.name}</td>
                                    <td>${user.email}</td>
                                    <td>hidden</td>
                                    <td>${user.role}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>`
                }
            </div>
        </body>
        </html>`);
  } catch (err) {
    console.log(err.message);
    next(err);
    // res.status(500).send("Userlarni olishda xatolik boldi" + err.message);
  }
}
export async function loginUser(req, res, next) {
  try {
    const login = req.body;
    const { error } = loginValidator.validate(login);
    if (error) {
      // return res.status(401).send(error.details[0].message);
      throw new CustomError(error.details[0].message, 400);
    }

    const dbUser = await findUserByEmail(login.email);
    if (!dbUser) {
      // res.status(401).send("Bunday email oldin royxatdan otmagan");
      throw new CustomError("Bunday email oldin royxatdan otmagan", 401);
    }
    const checkPassword = await bcrypt.compare(login.password, dbUser.password);
    if (!checkPassword) {
      // return res.status(403).send("Password xato");
      throw new CustomError("Password xato", 403);
    }
   
    const accessToken = await createAccessToken({ email: login.email });
    const refreshToken = await createRefreshToken({ email: login.email });
  
    res.cookie("accessToken", accessToken);
    res.cookie("refreshToken", refreshToken);


    if (dbUser.role === "User") {
      res.redirect("/user/login/user");
  
    }

    if (dbUser.role === "Seller") {
      res.redirect("/user/login/seller");
    
    }

    if (dbUser.role === "Admin") {
      res.redirect("/user/login/admin");
      
    }
  } catch (err) {
    next(err);
    console.log(err);
  }
}
export async function createAccessToken(data) {
  const token = jwt.sign(data, getConfig("JWT_ACCESS_TOKEN"), {
    expiresIn: "15m",
  });
  // console.log(token);
  return token;
}
export async function createRefreshToken(data) {
  return jwt.sign(data, getConfig("JWT_REFRESH_SECRET"), { expiresIn: "6h" });
}
export async function generateEmailConfirmationToken(data) {
  return jwt.sign(data, getConfig("JWT_EMAIL_CONFIRMATION_SECRET"), {
    expiresIn: "15m",
  });
}
export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.params;
    const resultJwt = await jwt.verify(
      token,
      getConfig("JWT_EMAIL_CONFIRMATION_SECRET")
    );
    const result = await pool.query(
      `
                UPDATE users SET status=$1 WHERE email=$2 
            `,
      [true, resultJwt.email]
    );
    res.status(200).send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #e9ecef;
              color: #495057;
              text-align: center;
              padding: 50px;
            }
            .confirmation-message {
              background-color: #d4edda;
              border: 1px solid #c3e6cb;
              border-radius: 5px;
              padding: 20px;
              display: inline-block;
            }
            .confirmation-message h1 {
              color: #155724;
              margin-bottom: 15px;
            }
            .confirmation-message p {
              font-size: 1.2em;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="confirmation-message">
            <h1>Email tasdiqlandi!</h1>
            <p>Sizning email manzilingiz muvaffaqiyatli tasdiqlandi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    // console.log(err.message);
    next(err);
  }
}
export async function removeUser(req, res, next) {
  try {
    const { id } = req.params;
    const db = await pool.query(`SELECT * FROM users WHERE id=$1`, [id]);
    if (!db) {
      throw new CustomError("Bunday id li user yoq", 401);
    }
    const result = await pool.query(
      `
      DELETE FROM users WHERE id=$1
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
              color: #343a40;
              text-align: center;
              padding: 50px;
            }
            .confirmation-message {
              background-color: #d1ecf1;
              border: 1px solid #bee5eb;
              border-radius: 5px;
              padding: 20px;
              display: inline-block;
            }
            .confirmation-message h1 {
              color: #0c5460;
              margin-bottom: 15px;
            }
            .confirmation-message p {
              font-size: 1.2em;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="confirmation-message">
            <h1>User muvaffaqiyatli o'chirildi!</h1>
            <p>Foydalanuvchi ma'lumotlari muvaffaqiyatli o'chirildi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    // res.send("User muvaffaqiyatli o'chirildi");
    next(err);
    console.log("user oochirishda xatolik", err.message);
  }
}
export async function updateUser(req, res, next) {
  try {
    const { id } = req.body;
    const newUser = req.body;
    console.log(newUser);
    const dbUser = await pool.query(
      `
      SELECT * FROM users WHERE id = $1
      `,
      [id]
    );
    if (!dbUser) {
      throw new CustomError("Bunday id li User yoq", 401);
    }
    const newUpdatedUser = { ...dbUser.rows[0], ...newUser };
    // console.log(newUpdatedUser);

    const hashedPassword = await bcrypt.hash(newUpdatedUser.password, 10);
    const result = await pool.query(
      `
      UPDATE users SET name=$1,email=$2,password=$3,role=$4 WHERE id=$5 RETURNING *
      `,
      [
        newUpdatedUser.name,
        newUpdatedUser.email,
        hashedPassword,
        newUpdatedUser.role,
        id,
      ]
    );
    // console.log(result.rows[0]);

    res.status(200).send(`
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #e9ecef;
              color: #495057;
              text-align: center;
              padding: 50px;
            }
            .update-message {
              background-color: #d4edda;
              border: 1px solid #c3e6cb;
              border-radius: 8px;
              padding: 20px;
              display: inline-block;
            }
            .update-message h1 {
              color: #155724;
              margin-bottom: 15px;
            }
            .update-message p {
              font-size: 1.2em;
              margin: 0;
            }
          </style>
        </head>
        <body>
          <div class="update-message">
            <h1>User muvaffaqiyatli yangilandi!</h1>
            <p>Foydalanuvchi ma'lumotlari muvaffaqiyatli yangilandi.</p>
          </div>
        </body>
      </html>
    `);
    
  } catch (err) {
    console.log(err.message);
    next(err);
  }
}
export async function getUserById(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT id,name,email,password,role FROM users WHERE id=$1
      `,
      [id]
    );
    if (!result) {
      throw new CustomError("Bunday id li user yoq", 401);
    }
    const user = result.rows[0]
    res.send(`<!DOCTYPE html>
      <html lang="uz">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>User Ma'lumotlari</title>
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
            width: 300px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          td.hidden {
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>User Ma'lumotlari</h1>
          <table>
            <tr>
              <th>ID</th>
              <td>${user.id}</td>
            </tr>
            <tr>
              <th>Ism</th>
              <td>${user.name}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>${user.email}</td>
            </tr>
            <tr>
              <th>Parol</th>
              <td class="hidden">****</td>
            </tr>
            <tr>
              <th>Rol</th>
              <td>${user.role}</td>
            </tr>
          </table>
        </div>
      </body>
      </html>`);
  } catch (err) {
    next(err);
    console.log(err.message);
  }
}
export async function logoutUser(req, res) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
}
