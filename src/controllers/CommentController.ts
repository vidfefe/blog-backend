import { Request, Response } from "express";
import { Types } from "mongoose";

import { CommentBody } from "../validations/post";
import { PostModel } from "../models/Post";

export const addComment = async (
  req: Request<{ postId: string }, {}, CommentBody>,
  res: Response
) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;
    const { text } = req.body;

    const post = await PostModel.findByIdAndUpdate(
      postId,
      {
        $push: {
          comments: {
            user: new Types.ObjectId(userId),
            text,
          },
        },
      },
      { new: true, projection: { comments: { $slice: -1 } } }
    ).populate({ path: "comments.user", select: "-password" });

    if (!post) {
      res.status(404).json({ message: "The post was not found" });
      return;
    }

    res.status(201).json(post.comments[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "It was not possible to create comment",
    });
  }
};

export const updateComment = async (
  req: Request<{ postId: string; commentId: string }, {}, CommentBody>,
  res: Response
) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.userId;
    const { text } = req.body;

    const post = await PostModel.findById(postId);

    if (!post) {
      res.status(404).json({ message: "The post was not found" });
      return;
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      res.status(404).json({
        message: "The comment was not found",
      });
      return;
    }

    if (comment.user.toString() !== userId) {
      res.status(403).json({ message: "Not your comment" });
      return;
    }

    if (comment.text === text) {
      res.status(400).json({ message: "Comment text not changed" });
      return;
    }

    comment.text = text;
    await post.save();

    res.status(201).json(comment);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "It was not possible to update comment",
    });
  }
};

export const removeComment = async (
  req: Request<{ postId: string; commentId: string }>,
  res: Response
) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.userId;

    const post = await PostModel.findById(postId);

    if (!post) {
      res.status(404).json({ message: "The post was not found" });
      return;
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      res.status(404).json({
        message: "The comment was not found",
      });
      return;
    }

    if (comment.user.toString() !== userId) {
      res.status(403).json({ message: "Not your comment" });
      return;
    }

    comment.deleteOne();
    await post.save();
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "It was not possible to delete comment",
    });
  }
};
