import { Router } from "express";
import { PostConroller } from "../controllers/index.js";
const router = Router();
router.get("/", PostConroller.getLastTags);
export default router;
