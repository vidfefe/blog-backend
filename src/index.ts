import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import { connectDB } from "./db";
import { config } from "./config";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/posts";
import commentsRouter from "./routes/comment";
import uploadRoutes from "./routes/upload";
import tagsRouter from "./routes/tags";
import { errorHandler } from "./middlewares/errorHandler";

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
