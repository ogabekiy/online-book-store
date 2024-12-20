import { Router } from "express";
import {
  addBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "../core/book/book.service.js";
import { authGard } from "../common/Guard/auth.guard.js";
import { accessControl2 } from "../common/middlewares/access-control.middleware.js";

const bookRouter = Router();

bookRouter.get("/add", (req, res) => {
  res.render("addBook", { layout: false });
});
bookRouter.get("/delete/:id", (req, res) => {
  res.render("deleteBook", { layout: false });
});
bookRouter.get("/update", (req, res) => {
  res.render("updateBook", { layout: false });
});
bookRouter.post("/add", authGard, accessControl2(["Admin", "Seller"]), addBook);
bookRouter.get("/all", authGard, getAllBooks);
bookRouter.get("/:id", authGard, getBookById);
bookRouter.post(
  "/update",
  authGard,
  accessControl2(["Admin", "User"]),
  updateBook
);
bookRouter.delete(
  "/delete/:id",
  authGard,
  accessControl2(["Admin", "Seller"]),
  deleteBook
);

export default bookRouter;
