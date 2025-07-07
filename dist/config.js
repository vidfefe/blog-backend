import dotenv from "dotenv";
import path from "path";
dotenv.config();
function required(name) {
    const v = process.env[name];
    if (!v)
        throw new Error(`Missing env var ${name}`);
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
    uploads: {
        dir: path.resolve(process.env.UPLOAD_DIR ?? "uploads"),
    },
    corsOrigin: process.env.CORS_ORIGIN?.split(",") ?? "*",
};
