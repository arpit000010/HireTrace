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
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg-primary)]/70 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--bg-primary)]/60">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[var(--indigo)] to-indigo-700 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)] ring-1 ring-white/10 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300">
            <span className="text-white font-bold text-xs tracking-wider">HT</span>
          </div>
          <span className="text-[15px] font-semibold text-[var(--text-primary)] tracking-tight hidden sm:block">
            HireTrace
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-2">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${
              isActive("/")
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
            }`}
          >
            <LayoutDashboard size={14} className={isActive("/") ? "opacity-70" : "opacity-50"} />
            <span className="hidden sm:inline">Feed</span>
          </Link>
          <Link
            to="/bookmarks"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 ${
              isActive("/bookmarks")
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]"
            }`}
          >
            <Bookmark size={14} className={isActive("/bookmarks") ? "opacity-70" : "opacity-50"} />
            <span className="hidden sm:inline">Bookmarks</span>
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/create"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-[13px] font-medium text-white bg-[var(--indigo)] hover:bg-indigo-400 transition-all duration-200 shadow-[inset_0_1px_rgba(255,255,255,0.2)] ring-1 ring-black/20"
          >
            <PlusCircle size={14} />
            <span className="hidden sm:inline">Share</span>
          </Link>

          {/* User menu */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-1.5 py-1.5 rounded-md hover:bg-[var(--bg-card)] transition-colors duration-200 ring-1 ring-transparent hover:ring-[var(--border)]">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 ring-1 ring-white/10 flex items-center justify-center text-white text-[10px] font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </button>

            {/* Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#09090b]/95 backdrop-blur-xl border border-[var(--border)] rounded-xl shadow-2xl shadow-black/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right group-hover:scale-100 scale-95">
              <div className="px-3 py-2.5 border-b border-[var(--border)]">
                <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
                <p className="text-[11px] text-[var(--text-secondary)] truncate">{user?.email}</p>
              </div>
              <div className="p-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)] transition-colors duration-150"
                >
                  <User size={14} />
                  Your Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-[13px] text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors duration-150"
                >
                  <LogOut size={14} />
                  Sign out
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
