import { z } from "zod";
export const createPostSchema = z.object({
    title: z.string().min(1, "Title is required"),
    text: z.string().min(1, "Text is required"),
    tags: z.array(z.string().min(1)).optional(),
    imageUrl: z.string().url("Image URL must be valid"),
});
export const commentSchema = z.object({
    text: z.string().min(1, "Text is required"),
});
