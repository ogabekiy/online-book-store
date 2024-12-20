import { Router } from "express";
import {
  addPublisher,
  deletePublisher,
  getAllPublishers,
  getPublisherById,
  updatePublisher,
} from "../core/publisher/publisher.service.js";
import { authGard } from "../common/Guard/auth.guard.js";
import { accessControl2 } from "../common/middlewares/access-control.middleware.js";

const publisherRouter = Router();

publisherRouter.get("/add", (req, res) => {
  res.render("addPublisher", { layout: false });
});
publisherRouter.get("/update/:id", (req, res) => {
  res.render("updatePublisher", { layout: false });
});
publisherRouter.get("/delete/:id", (req, res) => {
  res.render("deletePublisher", { layout: false });
});
publisherRouter.post(
  "/add",
  authGard,
  accessControl2(["Admin", "Seller"]),
  addPublisher
);
publisherRouter.get(
  "/all",
  authGard,
  accessControl2(["Admin", "Seller"]),
  getAllPublishers
);
publisherRouter.get(
  "/:id",
  authGard,
  accessControl2(["Admin", "Seller"]),
  getPublisherById
);
publisherRouter.post(
  "/update",
  authGard,
  accessControl2(["Admin", "Seller"]),
  updatePublisher
);
publisherRouter.delete(
  "/delete/:id",
  authGard,
  accessControl2(["Admin", "Seller"]),
  deletePublisher
);

export default publisherRouter;
