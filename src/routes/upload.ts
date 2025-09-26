import { Request, Response, Router } from "express";
import multer from "multer";

import cloudinary from "../lib/cloudinary.js";
import { config } from "../config.js";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) =>
    file.mimetype.startsWith("image/")
      ? cb(null, true)
      : cb(new Error("Only images allowed")),
  limits: { fileSize: 1024 * 1024 * 5 },
});

function uploadToCloudinary(buf: Buffer, folder: string) {
  return new Promise<import("cloudinary").UploadApiResponse>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (err, result) =>
          err || !result
            ? reject(err || new Error("No result"))
            : resolve(result)
      );
      stream.end(buf);
    }
  );
}

const router = Router();

router.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({
          error: "No file uploaded",
        });
        return;
      }

      const result = await uploadToCloudinary(
        req.file.buffer,
        config.cloud.folder
      );

      res.json({ url: result.secure_url });
    } catch (e) {
      res.status(500).json({
        message: "Failed to upload image",
      });
    }
  }
);

export default router;
