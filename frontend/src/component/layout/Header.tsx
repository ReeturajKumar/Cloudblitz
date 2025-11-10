import { Bell, Search } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useState } from "react";

const Header = () => {
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 md:gap-6 px-4 md:px-6 py-3 bg-white border-b shadow-sm sticky top-0 z-30">
      {/* Left Section (Search Bar or Icon) */}
      <div className="flex items-center flex-1 md:flex-none">
        {/* Mobile Search Toggle */}
        <button
          className="md:hidden text-gray-600 hover:text-gray-800 mr-3"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search size={20} />
        </button>

        {/* Desktop Search */}
        <div
          className={`${
            showSearch
              ? "flex w-full"
              : "hidden w-0 opacity-0 md:flex md:w-full md:opacity-100"
          } transition-all duration-300`}
        >
          <input
            type="text"
            placeholder="Search enquiries, users, or anything..."
            className="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200 text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell size={20} />
          <span className="absolute top-0 right-0 bg-red-500 h-2 w-2 rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="bg-purple-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-semibold uppercase">
            {user?.name?.[0] || "A"}
          </div>

          {/* User Name & Email — Hidden on Small Screens */}
          <div className="hidden sm:flex flex-col leading-tight pr-2">
            <p className="text-sm font-medium">{user?.name || "Admin User"}</p>
            <p className="text-xs text-gray-500 truncate max-w-[250px]">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
