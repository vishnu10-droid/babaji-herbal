import {
  uploadMultipleToImageKit,
  uploadToImageKit,
} from "../services/imagekitUpload.js";

// ========================================
// UPLOAD SINGLE IMAGE
// ========================================
//
// Expected: multipart/form-data with field "image"
// URL:      /api/upload/image/:folder
// Returns:  { url, fileId }

export const uploadSingleImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please select an image first.",
      });
    }

    const folder = req.params.folder || "products";

    const result = await uploadToImageKit(file, folder);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
};

// ========================================
// UPLOAD MULTIPLE IMAGES
// ========================================
//
// Expected: multipart/form-data with field "images"
// URL:      /api/upload/images/:folder
// Returns:  [{ url, fileId }, ...]

export const uploadMultipleImages = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files uploaded. Please select images first.",
      });
    }

    const folder = req.params.folder || "products";

    const results = await uploadMultipleToImageKit(files, folder);

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      data: results,
    });
  } catch (error) {
    console.error("MULTIPLE UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Image upload failed",
    });
  }
};