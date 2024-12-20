import { Router } from "express";
import {
  addOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
} from "../core/order/order.service.js";
import { authGard } from "../common/Guard/auth.guard.js";
import {
  accessControl,
  accessControl2,
} from "../common/middlewares/access-control.middleware.js";

const orderRouter = Router();
orderRouter.get("/add", (req, res) => {
  res.render("addOrder", { layout: false });
});
orderRouter.get("/update", (req, res) => {
  res.render("updateOrder", { layout: false });
});
orderRouter.get("/delete", (req, res) => {
  res.render("deleteOrder", { layout: false });
});
orderRouter.post("/add", authGard, accessControl2(["User"]), addOrder);
orderRouter.get(
  "/all",
  authGard,
  accessControl2(["Admin", "User"]),
  getAllOrders
);
orderRouter.get(
  "/:id",
  authGard,
  accessControl2(["Admin", "User"]),
  getOrderById
);
orderRouter.post(
  "/update",
  authGard,
  accessControl(["Admin", "User"]),
  updateOrder
);
orderRouter.delete(
  "/delete/:id",
  authGard,
  accessControl2(["Admin", "User"]),
  deleteOrder
);

export default orderRouter;
