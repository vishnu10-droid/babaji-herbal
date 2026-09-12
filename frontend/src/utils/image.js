import { API_ORIGIN } from "../config/config";

// =====================================================
// IMAGE UTILITIES
//
// Product/category/user images ab dono forms me ho
// sakti hain:
//   - nayi ImageKit images  : { url, fileId }
//   - purani local images   : "/uploads/..."
//   - directly ImageKit URL : "https://ik.imagekit.io/..."
//
// resolveImage() dono ko handle karta hai aur ek final
// <img src> URL deta hai.
// =====================================================

export const resolveImage = (source, fallback = "") => {
  if (!source) {
    return fallback;
  }

  const url =
    typeof source === "string" ? source : source?.url || "";

  if (!url) {
    return fallback;
  }

  if (/^https?:\/\//.test(url)) {
    return url;
  }

  const leading = url.startsWith("/") ? "" : "/";

  return `${API_ORIGIN}${leading}${url}`;
};

// =====================================================
// ImageKit URL transformations
//
// "tr=" parameters se ImageKit par server-side
// optimization hoti hai: width, height, quality,
// format aur crop.
// =====================================================

export const imagekitTransform = (
  source,
  { width, height, quality = 80, format = "auto", crop = "fo-auto" } = {},
) => {
  const url = resolveImage(source);

  if (!url || !url.includes("ik.imagekit.io")) {
    return url;
  }

  const transforms = [];

  if (width) transforms.push(`w-${width}`);
  if (height) transforms.push(`h-${height}`);
  if (crop) transforms.push(crop);
  transforms.push(`q-${quality}`);
  if (format) transforms.push(`f-${format}`);

  if (transforms.length === 0) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}tr=${transforms.join(",")}`;
};

// =====================================================
// Shotcut: listing/thumbnail image
// =====================================================

export const thumbnail = (source, width = 300) =>
  imagekitTransform(source, {
    width,
    quality: 70,
    crop: "fo-auto",
  });

// =====================================================
// Shotcut: detail page image
// =====================================================

export const detailImage = (source, width = 800) =>
  imagekitTransform(source, {
    width,
    quality: 85,
    crop: "fo-auto",
  });