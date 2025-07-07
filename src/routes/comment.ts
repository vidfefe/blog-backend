import { Router } from "express";

import { validate } from "../middlewares/validate";
import { CommentController } from "../controllers";
import { checkAuth } from "../middlewares/checkAuth";
import { commentSchema } from "../validations/post";

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
