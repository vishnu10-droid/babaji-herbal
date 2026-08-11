import React, { useState } from "react";

const AddCategory = () => {
  const dispatch = useDispatch();
  const     navigate = useNavigate();

  const { loading } = useSelector((state) => state.category);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
    isActive: true,
  });

  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];

      setFormData({
        ...formData,
        image: file,
      });

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Category Data:", formData);

    // API call yahan kar sakte ho
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Add Category
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a new product category
        </p>
      </div>

      {/* Main Card */}
      <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <form onSubmit={handleSubmit}>

          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* LEFT SIDE - IMAGE */}
            <div className="border-b border-gray-200 p-8 md:border-b-0 md:border-r">

              <h2 className="mb-5 text-lg font-semibold text-gray-800">
                Category Image
              </h2>

              <div className="flex min-h-[320px] items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">

                {preview ? (
                  <img
                    src={preview}
                    alt="Category Preview"
                    className="h-72 w-72 rounded-lg object-cover"
                  />
                ) : (
                  <label className="flex cursor-pointer flex-col items-center justify-center text-center">

                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                      <svg
                        className="h-8 w-8 text-purple-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>

                    <span className="font-medium text-gray-700">
                      Upload Category Image
                    </span>

                    <span className="mt-1 text-sm text-gray-400">
                      PNG, JPG or WEBP
                    </span>

                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {preview && (
                <label className="mt-4 block cursor-pointer text-center text-sm font-medium text-purple-700 hover:text-purple-900">
                  Change Image

                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* RIGHT SIDE - FORM */}
            <div className="p-8">

              <h2 className="mb-6 text-lg font-semibold text-gray-800">
                Category Information
              </h2>

              {/* Category Name */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category Name
                  <span className="text-red-500"> *</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-700 focus:ring-1 focus:ring-purple-700"
                />
              </div>

              {/* Description */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Enter category description"
                  className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-purple-700 focus:ring-1 focus:ring-purple-700"
                />
              </div>

              {/* Status */}
              <div className="mb-7 flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-4">

                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Category Status
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Enable this category for products
                  </p>
                </div>

                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="peer sr-only"
                  />

                  <div className="h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-purple-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">

                <button
                  type="button"
                  className="w-1/2 rounded-md border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-1/2 rounded-md bg-purple-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-900"
                >
                  Add Category
                </button>

              </div>

            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;