import imagekit from "../config/imagekit.js";

// ========================================
// IMAGEKIT UPLOAD SERVICE
//
// Reusable upload/delete helpers.
// Private key kabhi frontend par expose
// nahi hoti - sab kuch yahin backend par
// chalta hai.
// ========================================

const IMAGEKIT_ROOT_FOLDER = "/baba-ji-herbal";

const ALLOWED_FOLDERS = [
  "products",
  "categories",
  "hero",
  "brands",
  "users",
];

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

// ========================================
// FOLDER HELPER
// ========================================

export const getImageKitFolder = (folder) => {
  const safeFolder = ALLOWED_FOLDERS.includes(folder)
    ? folder
    : "products";

  return `${IMAGEKIT_ROOT_FOLDER}/${safeFolder}`;
};

// ========================================
// FILE VALIDATION (defense in depth)
// ========================================

const validateFile = (file) => {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  if (!file.buffer || file.buffer.length === 0) {
    throw new Error("Uploaded file is empty");
  }

  if (
    file.mimetype &&
    !ALLOWED_MIME_TYPES.includes(file.mimetype)
  ) {
    throw new Error(
      "Invalid file type. Only jpg, jpeg, png, webp, gif and avif images are allowed",
    );
  }

  return true;
};

// ========================================
// SANITIZED FILE NAME
// ========================================

const getFileName = (file) => {
  const extension =
    file.originalname?.split(".")?.pop()?.toLowerCase() || "jpg";

  return `${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
};

// ========================================
// UPLOAD SINGLE IMAGE
// ========================================

export const uploadToImageKit = async (file, folder = "products") => {
  validateFile(file);

  const useUniqueFileName = true;

  const result = await imagekit.upload({
    file: file.buffer,
    fileName: getFileName(file),
    folder: getImageKitFolder(folder),
    useUniqueFileName,
    isPrivateFile: false,
  });

  if (!result || !result.url) {
    throw new Error("ImageKit upload failed");
  }

  return {
    url: result.url,
    fileId: result.fileId,
  };
};

// ========================================
// UPLOAD MULTIPLE IMAGES
// ========================================

export const uploadMultipleToImageKit = async (
  files,
  folder = "products",
) => {
  if (!files || files.length === 0) {
    throw new Error("No files provided for upload");
  }

  const results = [];

  for (const file of files) {
    results.push(await uploadToImageKit(file, folder));
  }

  return results;
};

// ========================================
// DELETE IMAGE BY FILE ID
// ========================================

export const deleteImagekitFile = async (fileId) => {
  if (!fileId) {
    return null;
  }

  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    console.error(
      "[ImageKit] DELETE FAILED:",
      error?.message || error,
    );
    return false;
  }
};