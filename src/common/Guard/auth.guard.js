import jwt from "jsonwebtoken";
import { findUserByEmail } from "../../core/user/user.service.js";
import { getConfig } from "../config/config.service.js";

export async function authGard(req, res, next) {
  try {
    // console.log("cookies", req.cookies);

    const { accessToken } = req.cookies;
    const Token = accessToken;
    // const Token = req.headers.authorization?.split(" ")[1];
    // console.log("tokennn", Token);
    // console.log("accesToken", Token);
    const result = await jwt.verify(Token, getConfig("JWT_ACCESS_TOKEN"));
    const { email } = result;

    const user_rn = await findUserByEmail(email);
    // console.log("user_rn", user_rn);
    req.user = user_rn;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(403).send("Huquqingiz yetarli emas");
  }
}
