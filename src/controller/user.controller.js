import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  loginUser,
  removeUser,
  updateUser,
  userRegister,
  verifyEmail,
} from "../core/user/user.service.js";
import { authGard } from "../common/Guard/auth.guard.js";
import { accessControl } from "../common/middlewares/access-control.middleware.js";

const userRouter = Router();

userRouter.get("/register", (req, res) => {
  res.render("register", { layout: false });
});
userRouter.get("/delete/:id", (req, res) => {
  res.render("deleteUser", { layout: false });
});
userRouter.post("/register", userRegister);
userRouter.get("/all", authGard, accessControl(["Admin", "User"]), getAllUsers);
userRouter.get("/login", (req, res) => {
  res.render("login", { layout: false });
});
userRouter.post("/login", loginUser);
userRouter.get("/verify-email/:token", verifyEmail);
userRouter.get("/update", (req, res) => {
  res.render("updateUser", { layout: false });
});
userRouter.get("/login/admin", (req, res) => {
  res.render("admin", { layout: false });
});
userRouter.get("/login/seller", (req, res) => {
  res.render("seller", { layout: false });
});
userRouter.get("/login/user", (req, res) => {
  res.render("user", { layout: false });
});
userRouter.post(
  "/update",
  authGard,
  accessControl(["Admin", "User", "Seller"]),
  updateUser
);
userRouter.get(
  "/:id",
  authGard,
  accessControl(["Admin", "User", "Seller"]),
  getUserById
);
// userRouter.get("/admin", (req, res) => {
//   res.render("admin"), { layout: false };
// });
userRouter.delete(
  "/delete/:id",
  authGard,
  accessControl(["Admin", "User", "Seller"]),
  removeUser
);
export default userRouter;
