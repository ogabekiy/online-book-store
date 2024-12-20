import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getAll,
  getById,
  updateCategory,
} from "../core/category/category.service.js";
import { authGard } from "../common/Guard/auth.guard.js";
import { accessControl2 } from "../common/middlewares/access-control.middleware.js";

const categoryRouter = Router();

categoryRouter.get("/add", (req, res) => {
  res.render("addCategory", { layout: false });
});
categoryRouter.get("/update", (req, res) => {
  res.render("updateCategory", { layout: false });
});
categoryRouter.get("/delete/:id", (req, res) => {
  res.render("deleteCategory", { layout: false });
});
categoryRouter.post(
  "/add",
  authGard,
  accessControl2(["Admin", "Seller"]),
  addCategory
);
categoryRouter.get(
  "/all",
  authGard,
  accessControl2(["Admin", "Seller"]),
  getAll
);
categoryRouter.get(
  "/:id",
  authGard,
  accessControl2(["Admin", "Seller"]),
  getById
);
categoryRouter.post(
  "/update",
  authGard,
  accessControl2(["Admin", "Seller"]),
  updateCategory
);
categoryRouter.delete(
  "/delete/:id",
  authGard,
  accessControl2(["Admin", "Seller"]),
  deleteCategory
);

export default categoryRouter;
