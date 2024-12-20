import express from "express";
import { getConfig } from "./common/config/config.service.js";
import { initDatabase } from "./common/database/database.service.js";
import userRouter from "./controller/user.controller.js";
import { fileURLToPath } from "url"; //hbs
import path from "path"; //hbs
import bodyParser from "body-parser"; //hbs i
import { create } from "express-handlebars"; // hbs -
import cookieParser from "cookie-parser";
import notFoundRoutes from "./common/middlewares/notFoundRoutes.service.js";
import expressErrorHandling from "./common/middlewares/express.errorHandling.js";
import { accessLogger, errorLogger } from "./common/service/logger.service.js";
import categoryRouter from "./controller/category.controller.js";
import publisherRouter from "./controller/publisher.controller.js";
import bookRouter from "./controller/book.controller.js";
import orderRouter from "./controller/order.controller.js";
const __filename = fileURLToPath(import.meta.url); //hbs
const __dirname = path.dirname(__filename); // hbs
const app = express();
const PORT = getConfig("EXPRESS_PORT") || 3000;

const hbs = create({
  extname: ".handlebars",
  defaultLayout: "main",
});
process.on("uncaughtException", (err) => {
  errorLogger.error({ type: "uncaughtException", message: err.message });
});
process.on("unhandledRejection", (err) => {
  errorLogger.error({ type: "unhandledRejection", message: err.message });
});
async function initRoutes() {
  app.use("/user", userRouter);
  app.use("/category", categoryRouter);
  app.use("/publisher", publisherRouter);
  app.use("/book", bookRouter);
  app.use("/order", orderRouter);
}

async function init() {
  app.use(express.json());
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true })); //hbs
  app.use((req, res, next) => {
    const { url, method } = req;
    accessLogger.info({ url, method });
    next();
  });
  initRoutes();
  app.use(notFoundRoutes);
  app.use(expressErrorHandling);
  app.engine("handlebars", hbs.engine); //hbs
  app.set("view engine", "handlebars"); //hbs
  app.set("views", path.join(__dirname, "views")); // hbs
  initDatabase();
  app.listen(PORT, () => console.log(`Server ${PORT} PORT da ishlayapti`));
}
init();
