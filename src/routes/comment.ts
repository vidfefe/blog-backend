import { Router } from "express";

import { validate } from "../middlewares/validate.js";
import { CommentController } from "../controllers/index.js";
import { checkAuth } from "../middlewares/checkAuth.js";
import { commentSchema } from "../validations/post.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  checkAuth,
  validate(commentSchema),
  CommentController.addComment
);
router.delete("/:commentId", checkAuth, CommentController.removeComment);
router.put("/:commentId", checkAuth, CommentController.updateComment);

export default router;
