import { motion } from "framer-motion";
import { useAuth } from "../../context/auth-context";

const UserProfile = () => {
  const { user } = useAuth();

  const name = user?.name || "User";
  const email = user?.email || "user@example.com";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your personal information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">

        <div className="flex flex-col items-center gap-5 border-b border-slate-100 pb-6 sm:flex-row">

          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-3xl font-bold text-blue-700">
            {name.charAt(0).toUpperCase()}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-slate-900">
              {name}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {email}
            </p>

            <span className="mt-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Customer
            </span>
          </div>

        </div>

        {/* Form */}
        <div className="mt-6 grid gap-5 md:grid-cols-2">

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>

            <input
              type="text"
              defaultValue={name}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <input
              type="email"
              defaultValue={email}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone Number
            </label>

            <input
              type="tel"
              placeholder="Enter phone number"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Country
            </label>

            <input
              type="text"
              placeholder="India"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Address
          </label>

          <textarea
            rows="4"
            placeholder="Enter your address"
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            Save Changes
          </button>
        </div>

      </div>
    </motion.div>
  );
};

export default UserProfile;