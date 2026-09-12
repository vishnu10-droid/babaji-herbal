import { motion } from "framer-motion";

const UserSettings = () => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account preferences.
        </p>
      </div>

      {/* Account Settings */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">

        <h2 className="text-lg font-bold">
          Account Settings
        </h2>

        <div className="mt-5 space-y-5">

          {/* Email Notifications */}
          <SettingRow
            title="Email Notifications"
            description="Receive updates about your orders and account."
            defaultChecked={true}
          />

          {/* Order Notifications */}
          <SettingRow
            title="Order Notifications"
            description="Get notifications when your order status changes."
            defaultChecked={true}
          />

          {/* Promotional Emails */}
          <SettingRow
            title="Promotional Emails"
            description="Receive offers, discounts and promotional emails."
            defaultChecked={false}
          />

        </div>

      </div>

      {/* Password */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">

        <h2 className="text-lg font-bold">
          Change Password
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">

          <div className="md:col-span-2">

            <label className="mb-2 block text-sm font-medium">
              Current Password
            </label>

            <input
              type="password"
              placeholder="Enter current password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>

        <div className="mt-5 flex justify-end">

          <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Update Password
          </button>

        </div>

      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">

        <h2 className="text-lg font-bold text-red-600">
          Danger Zone
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          These actions can affect your account permanently.
        </p>

        <button className="mt-5 rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
          Delete Account
        </button>

      </div>

    </motion.div>
  );
};


/* =========================
   SETTING ROW
========================= */

const SettingRow = ({
  title,
  description,
  defaultChecked,
}) => {

  return (
    <div className="flex items-center justify-between gap-5 border-b border-slate-100 pb-5 last:border-0 last:pb-0">

      <div>

        <h3 className="font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>

      </div>

      <label className="relative inline-flex cursor-pointer items-center">

        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="peer sr-only"
        />

        <div className="h-6 w-11 rounded-full bg-slate-200 peer-checked:bg-blue-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white" />

      </label>

    </div>
  );
};

export default UserSettings;