import multer from "multer";
import path from "path";

// ========================================
// UPLOAD MIDDLEWARE
//
// Files ab local disk par save nahi hote.
// Unhe memory (buffer) me rakha jaata hai
// aur controller ImageKit par upload karta
// hai.
// ========================================

const ALLOWED_TYPES = /jpeg|jpg|png|webp|gif|avif/;

// ========================================
// FILE FILTER
// ========================================

const fileFilter = (req, file, cb) => {
  const extension = ALLOWED_TYPES.test(
    path.extname(file.originalname).toLowerCase(),
  );

  const mimeType = ALLOWED_TYPES.test(file.mimetype);

  if (extension && mimeType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only jpg, jpeg, png, webp, gif and avif images are allowed",
      ),
    );
  }
};

// ========================================
// UPLOAD BUILDER
// ========================================

const createUpload = (maxSizeMB) =>
  multer({
    storage: multer.memoryStorage(),
    fileFilter,
    limits: {
      fileSize: maxSizeMB * 1024 * 1024,
    },
  });

// ========================================
// PRE-CONFIGURED INSTANCES
// ========================================

// Product images - 40 MB tak
export const productUpload = createUpload(40);

// Category (aur generic) images - 10 MB tak
export const categoryUpload = createUpload(10);

// Backward-compatible alias
export const upload = productUpload;

export default productUpload;