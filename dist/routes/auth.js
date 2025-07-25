import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { UserController } from "../controllers/index.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { loginSchema, registerSchema } from "../validations/auth.js";
const router = Router();
router.post("/register", validate(registerSchema), UserController.register);
router.post("/login", validate(loginSchema), UserController.login);
router.get("/me", checkAuth, UserController.getUserInfo);
export default router;
