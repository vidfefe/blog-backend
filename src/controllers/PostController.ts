import { Request, Response } from "express";
import { SortOrder, Types } from "mongoose";

import { PostModel } from "../models/Post";
import { CreatePostBody } from "../validations/post";

export const create = async (
  req: Request<{}, {}, CreatePostBody>,
  res: Response
) => {
  try {
    const { title, text, imageUrl, tags = [] } = req.body;
    const userId = req.userId!;

    const exists = await PostModel.exists({ title });
    if (exists) {
      res.status(409).json({
        message: "Post with this title already exists",
      });
      return;
    }

    const post = await PostModel.create({
      title,
      text,
      imageUrl,
      tags: tags,
      user: new Types.ObjectId(userId),
    });

    res.status(201).json(post.toJSON());
  } catch (err) {
    res.status(500).json({
      message: "Internal error",
    });
  }
};

export const getAll = async (
  req: Request<{}, {}, {}, { sort?: string; page?: string; limit?: string }>,
  res: Response
) => {
  try {
    const sortOption: { [key: string]: SortOrder } =
      req.query.sort === "popular" ? { viewsCount: -1 } : { createdAt: -1 };

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.max(parseInt(req.query.limit || "10", 10), 1);
    const skip = (page - 1) * limit;

    const total = await PostModel.countDocuments();

    const posts = await PostModel.find()
      .populate("user")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .exec();

    posts.forEach((p) => {
      p.$locals.currentUserId = req.userId;
    });

    const totalPages = Math.ceil(total / limit);

    res.json({ posts, totalPages, currentPage: page });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get posts",
    });
  }
};

export const getOne = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await PostModel.findById(postId).populate("user").populate({
      path: "comments.user",
      model: "User",
      select: "-password",
    });

    if (!post) {
      res.status(404).json({ message: "The post was not found" });
      return;
    }

    if (userId && post.user._id.toString() !== userId) {
      const hasViewed = post.views.some(
        (id: Types.ObjectId) => id.toString() === userId
      );
      if (!hasViewed) {
        post.views.push(new Types.ObjectId(userId));
        await post.save();
      }
    }

    post.$locals.currentUserId = req.userId;
    res.json(post.toJSON());
  } catch (err) {
    res.status(500).json({
      message: "Failed to get post",
    });
  }
};

export const getLastTags = async (_req: Request, res: Response) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean<{ tags: string[] }[]>();

    const allTags = posts.flatMap((p) => p.tags);
    const uniqueTags = Array.from(new Set(allTags)).slice(0, 7);

    res.json(uniqueTags);
  } catch (err) {
    res.status(500).json({
      message: "Failed to get tags",
    });
  }
};

export const remove = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndDelete({ _id: postId });

    if (!post) {
      res.status(404).json({ message: "The post was not found" });
      return;
    }

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete post",
    });
  }
};

export const update = async (
  req: Request<{ id: string }, {}, CreatePostBody>,
  res: Response
) => {
  try {
    const { title, text, imageUrl, tags = [] } = req.body;
    const postId = req.params.id;

    const post = await PostModel.findByIdAndUpdate(postId, {
      title,
      text,
      imageUrl,
      tags,
      user: req.userId,
    });

    if (!post) {
      res.status(404).json({ message: "The post was not found" });
      return;
    }

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update post",
    });
  }
};

export const like = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId, likes: { $ne: userId } },
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!post) {
      res.status(409).json({
        message: "You already liked this post",
      });
      return;
    }

    res.status(200).json({
      likesCount: post.likesCount,
    });
  } catch {
    res.status(500).json({
      message: "Failed to like post",
    });
  }
};

export const unlike = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await PostModel.findOneAndUpdate(
      { _id: postId, likes: userId },
      { $pull: { likes: userId } },
      { new: true }
    );

    if (!post) {
      const exists = await PostModel.exists({ _id: postId });
      if (!exists) {
        res.status(404).json({
          message: "The post was not found",
        });
        return;
      }

      res.status(409).json({
        message: "You already unliked this post",
      });
      return;
    }

    res.status(200).json({
      likesCount: post.likesCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to unlike post",
    });
  }
};
