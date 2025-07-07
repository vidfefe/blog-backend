import { Router } from "express";

import { validate } from "../middlewares/validate";
import { UserController } from "../controllers";
import { checkAuth } from "../middlewares/checkAuth";
import { loginSchema, registerSchema } from "../validations/auth";

const router = Router();

router.post("/register", validate(registerSchema), UserController.register);
router.post("/login", validate(loginSchema), UserController.login);
router.get("/me", checkAuth, UserController.getUserInfo);

export default router;
