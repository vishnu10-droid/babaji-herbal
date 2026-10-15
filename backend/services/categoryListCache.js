const CATEGORY_LIST_TTL = 60 * 1000;

let cachedCategoryList = null;

export const getCachedCategoryList = () => {
  if (!cachedCategoryList) return null;
  if (Date.now() - cachedCategoryList.createdAt >= CATEGORY_LIST_TTL) {
    cachedCategoryList = null;
    return null;
  }
  return cachedCategoryList.data;
};

export const setCachedCategoryList = (data) => {
  cachedCategoryList = { createdAt: Date.now(), data };
};

export const clearCategoryListCache = () => {
  cachedCategoryList = null;
};
