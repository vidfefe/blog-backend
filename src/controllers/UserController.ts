import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

import { UserModel } from "../models/User.js";
import { LoginBody, RegisterBody } from "../validations/auth.js";
import { config } from "../config.js";

function generateToken(userId: string) {
  return jwt.sign(
    {
      userId,
    },
    config.auth.jwtSecret,
    { expiresIn: "30d" }
  );
}

export const register = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
) => {
  try {
    const { fullname, email, password: plainPassword, avatarUrl } = req.body;

    const exists = await UserModel.exists({ email });
    if (exists) {
      res.status(409).json({
        message: "The email is already in use",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(plainPassword, salt);

    const user = await UserModel.create({
      fullname,
      email,
      password: hash,
      avatarUrl,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({
      user: user.toJSON(),
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal error",
    });
  }
};

export const login = async (req: Request<{}, {}, LoginBody>, res: Response) => {
  try {
    const { email, password: plainPassword } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(404).json({
        message: "The user does not exist",
      });
      return;
    }

    const isValidPassword = await bcrypt.compare(plainPassword, user.password);

    if (!isValidPassword) {
      res.status(400).json({
        message: "Wrong email or password",
      });
      return;
    }

    const token = generateToken(user._id.toString());

    res.json({
      user: user.toJSON(),
      token,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal error",
    });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      res.status(404).json({
        message: "The user was not found",
      });
      return;
    }

    res.json(user.toJSON());
  } catch (err) {
    res.status(500).json({
      message: "Internal error",
    });
  }
};
