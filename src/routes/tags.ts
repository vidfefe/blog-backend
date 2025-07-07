import { Router } from "express";

import { PostConroller } from "../controllers";

const router = Router();

router.get("/", PostConroller.getLastTags);

export default router;
