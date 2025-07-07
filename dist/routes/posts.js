import { Router } from "express";
import { checkAuth, checkAuthOptional } from "../middlewares/checkAuth.js";
import { PostConroller } from "../controllers/index.js";
import { validate } from "../middlewares/validate.js";
import { createPostSchema } from "../validations/post.js";
const router = Router();
router
    .route("/")
    .get(checkAuthOptional, PostConroller.getAll)
    .post(checkAuth, validate(createPostSchema), PostConroller.create);
router.get("/tags", PostConroller.getLastTags);
router
    .route("/:id")
    .get(checkAuthOptional, PostConroller.getOne)
    .patch(checkAuth, validate(createPostSchema), PostConroller.update)
    .delete(checkAuth, PostConroller.remove);
router.put("/:id/like", checkAuth, PostConroller.like);
router.delete("/:id/like", checkAuth, PostConroller.unlike);
export default router;
