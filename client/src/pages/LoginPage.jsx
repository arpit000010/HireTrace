import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/");
    } catch (err) {
      const msg = err?.response?.data?.message || "Login failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-[var(--indigo)] opacity-[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-[var(--cyan)] opacity-[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--indigo)] to-[var(--cyan)] flex items-center justify-center shadow-lg shadow-[var(--indigo)]/30">
              <span className="text-white font-bold text-sm">HT</span>
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
              HireTrace
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-4">
            Welcome back
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Sign in to your account to continue
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Email address
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 bg-[var(--bg-primary)] border rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 text-sm outline-none transition-all duration-200
                  focus:border-[var(--indigo)] focus:ring-2 focus:ring-[var(--indigo)]/20
                  ${errors.email ? "border-[var(--red)]" : "border-[var(--border)]"}`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-[var(--red)]">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 pr-11 bg-[var(--bg-primary)] border rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 text-sm outline-none transition-all duration-200
                    focus:border-[var(--indigo)] focus:ring-2 focus:ring-[var(--indigo)]/20
                    ${errors.password ? "border-[var(--red)]" : "border-[var(--border)]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-[var(--red)]">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm text-white
                bg-gradient-to-r from-[var(--indigo)] to-[#4f46e5]
                hover:from-[var(--indigo-light)] hover:to-[var(--indigo)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-lg shadow-[var(--indigo)]/25 mt-2"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[var(--indigo-light)] hover:text-[var(--indigo)] font-medium transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
