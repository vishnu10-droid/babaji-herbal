import multer from "multer";
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (_req, file, callback) => {
    callback(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_")}`);
  },
});

const upload = multer({ storage });
export default upload;
