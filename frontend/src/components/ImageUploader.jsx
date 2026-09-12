import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

import { uploadImage } from "../service/upload.api";
import { resolveImage } from "../utils/image";

// =====================================================
// DEFAULT VALIDATION
// =====================================================

const DEFAULT_ACCEPT = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const ALLOWED_EXTENSION = /\.(jpe?g|png|webp|gif)$/i;

const getErrorMessage = (error, fallback) => {
  if (!error) return fallback;
  return (
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
};

// =====================================================
// IMAGE UPLOADER
// =====================================================
//
// Props:
//   value     - [{ url, fileId }] ya string images
//   onChange  - nayi updated image list
//   folder    - ImageKit folder (products/categories/
//               brands/users)
//   multiple  - ek se zyada images allowed ya nahi
//   maxFiles  - maximum images
//   maxSizeMB - maximum file size (MB)
//   accept    - allowed mime types
//
// Flow:
//   select -> preview -> backend upload -> ImageKit
//   -> { url, fileId } frontend me -> onChange
// =====================================================

export default function ImageUploader({
  value = [],
  onChange,
  folder = "products",
  multiple = true,
  maxFiles = 10,
  maxSizeMB = 10,
  accept = DEFAULT_ACCEPT,
  label = "Choose images",
  hint = "JPG, PNG, WEBP or GIF images",
}) {
  const inputRef = useRef(null);
  const pendingIdRef = useRef(0);

  const [pending, setPending] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const maxBytes = maxSizeMB * 1024 * 1024;

  // =====================================================
  // VALIDATE FILES
  // =====================================================

  const validateAndAdd = (fileList) => {
    setError("");

    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    if (!multiple && (value.length + pending.length + files.length) > 1) {
      setError("Only one image is allowed here.");
      return;
    }

    const validFiles = [];
    const errors = [];

    for (const file of files) {
      if (!accept.includes(file.type) || !ALLOWED_EXTENSION.test(file.name)) {
        errors.push(`"${file.name}" is not a supported image type.`);
        continue;
      }

      if (file.size > maxBytes) {
        errors.push(`"${file.name}" is larger than ${maxSizeMB} MB.`);
        continue;
      }

      if (value.length + pending.length + validFiles.length >= maxFiles) {
        errors.push(`You can upload a maximum of ${maxFiles} images.`);
        break;
      }

      validFiles.push(file);
    }

    if (errors.length > 0) {
      setError(errors[0]);
    }

    if (validFiles.length === 0) {
      return;
    }

    uploadFiles(validFiles);
  };

  // =====================================================
  // UPLOAD FILES (backend -> ImageKit)
  // =====================================================

  const uploadFiles = async (files) => {
    const batch = files.map((file) => ({
      id: ++pendingIdRef.current,
      file,
      preview: URL.createObjectURL(file),
      status: "uploading",
      error: "",
    }));

    setPending((current) => [...current, ...batch]);
    setUploading(true);

    const uploaded = [];

    for (const pendingItem of batch) {
      try {
        const response = await uploadImage(pendingItem.file, folder);

        const image = response?.data || {};

        if (!image.url) {
          throw new Error("ImageKit returned no image URL");
        }

        uploaded.push({
          url: image.url,
          fileId: image.fileId || "",
        });

        setPending((current) =>
          current.map((item) =>
            item.id === pendingItem.id
              ? { ...item, status: "done" }
              : item,
          ),
        );
      } catch (uploadError) {
        setPending((current) =>
          current.map((item) =>
            item.id === pendingItem.id
              ? {
                  ...item,
                  status: "error",
                  error: getErrorMessage(
                    uploadError,
                    "Image upload failed",
                  ),
                }
              : item,
          ),
        );
      }
    }

    if (uploaded.length > 0) {
      onChange(multiple ? [...value, ...uploaded] : uploaded);
    }

    setUploading(false);

    // Uploaded pending items ko preview list se
    // hatao (ab wo value me hain)
    setPending((current) => {
      const remaining = current.filter(
        (item) => item.status !== "done",
      );

      remaining.forEach((item) => URL.revokeObjectURL(item.preview));

      return remaining;
    });
  };

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  const removeUploaded = (index) => {
    const next = value.filter((_, itemIndex) => itemIndex !== index);
    onChange(next);
  };

  const removePending = (id) => {
    setPending((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((item) => item.id !== id);
    });
  };

  // =====================================================
  // DRAG & DROP
  // =====================================================

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    validateAndAdd(event.dataTransfer.files);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="space-y-3">
      {/* ============ DROP ZONE ============ */}
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`
          flex
          w-full
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-xl
          border-2
          border-dashed
          px-5
          py-6
          text-center
          transition
          disabled:cursor-not-allowed
          disabled:opacity-60
          ${
            dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-blue-200 bg-blue-50/50 hover:border-blue-500 hover:bg-blue-50"
          }
        `}
      >
        {uploading ? (
          <>
            <Loader2 size={28} className="mb-2 animate-spin text-blue-600" />
            <span className="font-semibold text-blue-700">Uploading...</span>
          </>
        ) : (
          <>
            <ImagePlus size={28} className="mb-2 text-blue-600" />
            <span className="font-semibold text-blue-700">{label}</span>
            <span className="mt-1 text-xs text-slate-500">
              {hint}
              {multiple ? ` • up to ${maxFiles} images • max ${maxSizeMB} MB` : ` • max ${maxSizeMB} MB`}
            </span>
            <span className="mt-2 text-[10px] text-slate-400">
              Drag &amp; drop or click to browse
            </span>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(",")}
          multiple={multiple}
          className="sr-only"
          onChange={(event) => {
            validateAndAdd(event.target.files);
            event.target.value = "";
          }}
        />
      </button>

      {/* ============ ERROR ============ */}
      {error && (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
          {error}
        </p>
      )}

      {/* ============ PREVIEW GRID ============ */}
      {(value.length > 0 || pending.length > 0) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Uploaded (saved) images */}
          {value.map((image, index) => {
            const src = resolveImage(image);

            return (
              <div
                key={`saved-${index}`}
                className="group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              >
                <img
                  src={src}
                  alt={`Image ${index + 1}`}
                  className="h-24 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeUploaded(index)}
                  title="Remove image"
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute right-1.5 top-1.5 rounded-full bg-slate-900/60 p-1 text-white transition hover:bg-rose-600"
                >
                  <X size={13} />
                </button>
                <p className="truncate px-2 py-1 text-[10px] text-slate-500">
                  Image {index + 1}
                </p>
              </div>
            );
          })}

          {/* Pending (uploading / failed) images */}
          {pending.map((item) => (
            <div
              key={`pending-${item.id}`}
              className={
                item.status === "error"
                  ? "relative overflow-hidden rounded-lg border border-rose-300 bg-rose-50"
                  : "relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
              }
            >
              <img
                src={item.preview}
                alt="Upload preview"
                className="h-24 w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePending(item.id)}
                title="Cancel upload"
                aria-label="Cancel upload"
                className="absolute right-1.5 top-1.5 rounded-full bg-slate-900/60 p-1 text-white transition hover:bg-rose-600"
              >
                <X size={13} />
              </button>

              {item.status === "uploading" && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-blue-500">
                  <div className="h-full w-1/2 animate-pulse bg-blue-200" />
                </div>
              )}

              {item.status === "uploading" && (
                <p className="px-2 py-1 text-[10px] font-semibold text-blue-600">
                  Uploading...
                </p>
              )}

              {item.status === "error" && (
                <p className="px-2 py-1 text-[10px] font-semibold text-rose-600">
                  {item.error}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}