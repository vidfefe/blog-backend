import PostModel from "../models/Post.js";

export const create = async (req, res) => {
  try {
    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(","),
      user: req.userId,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "It was not possible to create post",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const sort = req.query.sort;
    let sortOption = { createdAt: -1 };

    if (sort === "popular") {
      sortOption = { viewsCount: -1 };
    }

    const posts = await PostModel.find()
      .populate("user")
      .sort(sortOption)
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get posts",
    });
  }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().sort({ createdAt: -1 }).limit(10);
    const tags = posts
      .map((post) => post.tags)
      .flat()
      .slice(0, 7);

    res.json(tags);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get tags",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findById(postId).populate("user").populate({
      path: "comments.user",
      model: "User",
      select: "-passwordHash",
    });

    if (!post) {
      return res.status(404).json({ message: "The post was not found" });
    }

    const isAuthor = post.user._id.toString() === req.userId;

    if (!isAuthor) {
      post.viewsCount += 1;
      await post.save();
    }

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get post",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findOneAndDelete({ _id: postId });

    if (!post) {
      return res.status(404).json({ message: "The post was not found" });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to delete post",
    });
  }
};

export const update = async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags.split(","),
        user: req.userId,
      }
    );

    if (!post) {
      return res.status(404).json({ message: "The post was not found" });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to update post",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    console.log(req.userId);
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "The post was not found" });
    }

    post.comments.push({
      user: userId,
      text,
    });

    post.commentsCount = post.comments.length;

    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "It was not possible to create post",
    });
  }
};
