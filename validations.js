import { body } from "express-validator";

export const registerValidation = [
  body("fullName", "Enter fullName").isLength({
    min: 3,
  }),
  body("email", "The wrong email format").isEmail(),
  body("password", "The password should be at least 5 characters").isLength({
    min: 5,
  }),
  body("avatarUrl", "Upload avatar image").isString(),
];

export const loginValidation = [
  body("email", "The wrong email format").isEmail(),
  body("password", "The password should be at least 5 characters").isLength({
    min: 5,
  }),
];

export const createPostValidation = [
  body("title", "Enter title").isLength({
    min: 3,
  }),
  body("text", "Enter text").isLength({ min: 3 }),
  body("tags", "The wrong tag format").optional().isString(),
  body("imageUrl", "Upload image").isString(),
];
