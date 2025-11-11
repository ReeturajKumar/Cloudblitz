import { useAuth } from "../../context/useAuth";

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 md:gap-6 px-4 md:px-6 py-3 bg-white border-b shadow-sm sticky top-0 z-30">
      <div className="flex items-center gap-4 ml-auto">
        {/* User Info */}
        <div className="flex items-center gap-2">
          <div className="bg-purple-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-semibold uppercase">
            {user?.name?.[0] || "A"}
          </div>
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
