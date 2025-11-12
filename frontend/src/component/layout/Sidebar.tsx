import { Home, Users, BarChart2, Menu, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/useAuth";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  const navItems = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/" },
    { name: "Enquiries", icon: <BarChart2 size={18} />, path: "/enquiries" },
    ...(isAdmin ? [{ name: "Users", path: "/users", icon: <Users /> }] : []),
  ];

  // Logout handler
  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Navbar Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 text-white p-2 rounded-md focus:outline-none"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full bg-[#0F172A] text-white flex flex-col justify-between p-4 transform transition-transform duration-300 z-40 w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <h1 className="text-2xl font-bold mb-6 text-center md:text-left">
            CloudBlitz
          </h1>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                to={item.path}
                key={item.name}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-800 hover:text-white text-gray-300"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-4 border-t border-blue-900 pt-4">
          <div className="bg-blue-800 text-center rounded-lg p-3">
            <p className="text-sm">Welcome, {user?.name}</p>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-red-500 w-full mt-2 text-sm py-2 rounded-md hover:bg-red-400 transition cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay on Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
        ></div>
      )}
    </>
  );
};

export default Sidebar;
