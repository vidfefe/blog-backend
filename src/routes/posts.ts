import { Router } from "express";

import { checkAuth, checkAuthOptional } from "../middlewares/checkAuth";
import { PostConroller } from "../controllers";
import { validate } from "../middlewares/validate";
import { createPostSchema } from "../validations/post";

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
