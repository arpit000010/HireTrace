import { Link, useNavigate, useLocation } from "react-router-dom";
import { PlusCircle, Bookmark, LogOut, User, LayoutDashboard } from "lucide-react";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg-primary)]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--indigo)] to-[var(--cyan)] flex items-center justify-center shadow-md shadow-[var(--indigo)]/30">
            <span className="text-white font-bold text-xs">HT</span>
          </div>
          <span className="text-base font-bold text-[var(--text-primary)] tracking-tight hidden sm:block">
            HireTrace
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          <Link
            to="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/")
                ? "bg-[var(--indigo)]/15 text-[var(--indigo-light)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
            }`}
          >
            <LayoutDashboard size={15} />
            <span className="hidden sm:inline">Feed</span>
          </Link>
          <Link
            to="/bookmarks"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isActive("/bookmarks")
                ? "bg-[var(--indigo)]/15 text-[var(--indigo-light)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
            }`}
          >
            <Bookmark size={15} />
            <span className="hidden sm:inline">Bookmarks</span>
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/create"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white bg-[var(--indigo)] hover:bg-[var(--indigo-light)] transition-colors shadow-md shadow-[var(--indigo)]/25"
          >
            <PlusCircle size={15} />
            <span className="hidden sm:inline">Share</span>
          </Link>

          {/* User menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--indigo)] to-[var(--cyan)] flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-[var(--text-secondary)] hidden md:block max-w-[100px] truncate">
                {user?.name}
              </span>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-1.5 w-44 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl shadow-black/40 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
              <div className="p-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-colors"
                >
                  <User size={14} />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--red)] hover:bg-[var(--red)]/10 transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
