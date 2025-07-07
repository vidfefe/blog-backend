import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { connectDB } from "./db/index.js";
import { config } from "./config.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import commentsRouter from "./routes/comment.js";
import uploadRoutes from "./routes/upload.js";
import tagsRouter from "./routes/tags.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

async function main() {
  await connectDB();

  const app = express();

  app.use(express.json());
  app.use(cors({ origin: config.corsOrigin }));

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(compression());
  app.use(morgan(config.env === "production" ? "combined" : "dev"));

  app.use("/uploads", express.static(config.uploads.dir));

  app.use("/auth", authRoutes);
  app.use("/posts", postRoutes);
  app.use("/posts/:postId/comments", commentsRouter);
  app.use("/upload", uploadRoutes);
  app.use("/tags", tagsRouter);

  app.use(errorHandler);

  app.listen(config.port, () => {
    console.log(`Listening on the port ${config.port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server: ", err);
});
