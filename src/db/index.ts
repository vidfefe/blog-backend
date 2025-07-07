import mongoose from "mongoose";
import dotenv from "dotenv";

import { config } from "../config.js";

dotenv.config();

export async function connectDB() {
  try {
    await mongoose.connect(config.db.uri, {
      serverApi: { version: "1", strict: true, deprecationErrors: true },
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error: ", err);
    throw err;
  }
}
