import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

const UserSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/account",
      icon: "🏠",
    },
    {
      name: "My Profile",
      path: "/account/profile",
      icon: "👤",
    },
    {
      name: "My Orders",
      path: "/account/orders",
      icon: "📦",
    },
    {
      name: "Wishlist",
      path: "/account/wishlist",
      icon: "❤️",
    },
    {
      name: "My Cart",
      path: "/cart",
      icon: "🛒",
    },
    {
      name: "Transactions",
      path: "/account/transactions",
      icon: "💳",
    },
    {
      name: "My Reviews",
      path: "/account/reviews",
      icon: "⭐",
    },
    {
      name: "Settings",
      path: "/account/settings",
      icon: "⚙️",
    },
  ];

  const handleLogout = () => {
    if (logout) {
      logout();
    }

    navigate("/login");
  };

  return (
    <aside className="hidden w-64 shrink-0 bg-[#0b2a63] text-white md:block">

      <div className="sticky top-0 flex h-screen flex-col">

        {/* Logo */}
        <div className="border-b border-white/10 px-6 py-6">

          <h1 className="text-xl font-bold">
            My Account
          </h1>

          <p className="mt-1 text-xs text-blue-200">
            Customer Panel
          </p>

        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-1 px-3 py-5">

          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/account"}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-blue-900"
                    : "text-blue-100 hover:bg-white/10"
                }`
              }
            >

              <span className="text-lg">
                {item.icon}
              </span>

              {item.name}

            </NavLink>
          ))}

        </nav>

        {/* Logout */}
        <div className="border-t border-white/10 p-3">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-blue-100 hover:bg-red-500/20 hover:text-white"
          >
            <span>🚪</span>
            Logout
          </button>

        </div>

      </div>

    </aside>
  );
};

export default UserSidebar;