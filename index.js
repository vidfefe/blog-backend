import express from "express";
import mongoose from "mongoose";

import {
  registerValidation,
  loginValidation,
  createPostValidation,
} from "./validations.js";
import { checkAuth, checkAuthOptional } from "./utils/checkAuth.js";
import multer from "multer";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import { UserController, PostConroller } from "./controllers/index.js";
import cors from "cors";

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 8000;
const uri =
  "mongodb://admin:55.901@ac-odybaem-shard-00-00.fmpwdbb.mongodb.net:27017,ac-odybaem-shard-00-01.fmpwdbb.mongodb.net:27017,ac-odybaem-shard-00-02.fmpwdbb.mongodb.net:27017/blog?ssl=true&replicaSet=atlas-qaiswu-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Blog-cluster";

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

mongoose
  .connect(uri, clientOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.listen(port, (err) => {
  if (err) {
    console.log("Error: ", err);
  }

  console.log(`Listening on the port ${port}`);
});

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getUserInfo);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.post(
  "/posts",
  checkAuth,
  createPostValidation,
  handleValidationErrors,
  PostConroller.create
);
app.get("/posts", PostConroller.getAll);
app.get("/tags", PostConroller.getLastTags);
app.get("/posts/:id", checkAuthOptional, PostConroller.getOne);
app.delete("/posts/:id", checkAuth, PostConroller.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  createPostValidation,
  handleValidationErrors,
  PostConroller.update
);
app.post("/posts/:id/comments", checkAuth, PostConroller.addComment);
