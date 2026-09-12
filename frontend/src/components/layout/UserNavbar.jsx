import { useAuth } from "../../context/auth-context";

const UserNavbar = () => {
  const { user } = useAuth();

  const userName = user?.name || "User";

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 px-4 py-4 backdrop-blur-md md:px-6">

      <div className="flex items-center justify-between">

        {/* Left */}
        <div>

          <p className="text-xs text-slate-500">
            Customer Account
          </p>

          <h2 className="text-lg font-bold">
            Dashboard
          </h2>

        </div>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Notification */}
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100">
            🔔

            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* User */}
          <div className="hidden items-center gap-3 sm:flex">

            <div className="text-right">

              <p className="text-sm font-semibold">
                {userName}
              </p>

              <p className="text-xs text-slate-500">
                Customer
              </p>

            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              {userName.charAt(0).toUpperCase()}
            </div>

          </div>

        </div>

      </div>

    </header>
  );
};

export default UserNavbar;