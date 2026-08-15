import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = "uploads/categories";
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadPath),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, extension)
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    callback(null, `${Date.now()}-${baseName}${extension}`);
  },
});

const fileFilter = (_req, file, callback) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const valid = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  callback(valid ? null : new Error("Only image files are allowed"), valid);
};

export default multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
