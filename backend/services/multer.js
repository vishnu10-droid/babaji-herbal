import multer from "multer";
import path from "path";
import fs from "fs";

// Upload folder
const uploadPath = "uploads/products";

// Agar folder nahi hai to automatically create hoga
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;

  const extension = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimeType = allowedTypes.test(file.mimetype);

  if (extension && mimeType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only jpg, jpeg, png, webp and gif images are allowed"
      )
    );
  }
};

const upload = multer({
  storage: storage,

  fileFilter: fileFilter,

  limits: {
    fileSize: 40 * 1024 * 1024,
  },
});

export default upload;