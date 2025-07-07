import { Router } from "express";
import multer from "multer";
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, process.env.UPLOAD_DIR || "uploads");
    },
    filename: (_req, file, cb) => {
        const name = `${Date.now()}-${file.originalname}`;
        cb(null, name);
    },
});
const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => file.mimetype.startsWith("image/") ? cb(null, true) : cb(null, false),
    limits: { fileSize: 1024 * 1024 * 5 },
});
const router = Router();
router.post("/", upload.single("image"), (req, res) => {
    if (!req.file) {
        res.status(400).json({
            error: "No file uploaded",
        });
        return;
    }
    const filename = req.file.filename;
    const encoded = encodeURIComponent(filename);
    const url = `${req.protocol}://${req.get("host")}/uploads/${encoded}`;
    res.json({ url });
});
export default router;
