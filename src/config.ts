import dotenv from "dotenv";
import path from "path";

dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

export const config = {
  port: process.env.PORT ?? "4000",
  env: process.env.NODE_ENV ?? "development",

  db: {
    uri: required("MONGODB_URI"),
  },

  auth: {
    jwtSecret: required("JWT_SECRET"),
  },

  cloud: {
    name: required("CLOUDINARY_CLOUD_NAME"),
    apiKey: required("CLOUDINARY_API_KEY"),
    secretKey: required("CLOUDINARY_API_SECRET"),
    folder: process.env.CLOUDINARY_FOLDER ?? "uploads",
  },

  corsOrigin: process.env.CORS_ORIGIN?.split(",") ?? "*",
} as const;
