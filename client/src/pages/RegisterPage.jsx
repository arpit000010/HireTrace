import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserPlus, Loader2, MailCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import useAuth from "../hooks/useAuth.js";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    else if (form.name.trim().length < 2) errs.name = "Name too short";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Invalid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "Min 8 characters";
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
      await register(form.name, form.email, form.password);
      setSubmitted(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Registration failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Password strength indicator
  const getStrength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };
  const strength = getStrength(form.password);
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-[var(--red)]",
    "bg-[var(--yellow)]",
    "bg-blue-400",
    "bg-[var(--green)]",
  ][strength];

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-[var(--green)] opacity-[0.05] rounded-full blur-[100px]" />
        </div>
        <div className="relative w-full max-w-md text-center">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-10 shadow-2xl shadow-black/40">
            <div className="w-16 h-16 rounded-full bg-[var(--green)]/10 border border-[var(--green)]/30 flex items-center justify-center mx-auto mb-5">
              <MailCheck size={30} className="text-[var(--green)]" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Check your inbox
            </h2>
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">
              We sent a verification link to{" "}
              <span className="text-[var(--indigo-light)] font-medium">
                {form.email}
              </span>
              . Click it to activate your account.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2.5 rounded-xl bg-[var(--indigo)] hover:bg-[var(--indigo-light)] text-white text-sm font-semibold transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-12">
      {/* Background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[10%] w-[600px] h-[600px] bg-indigo-500 opacity-10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-cyan-500 opacity-10 rounded-full blur-[120px]" />
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
            Create your account
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Share and discover real interview experiences
          </p>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-card)]/80 backdrop-blur-xl border border-[var(--border)] rounded-3xl p-8 shadow-[0_8px_40px_rgb(0,0,0,0.5)] ring-1 ring-white/5">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Name */}
            <div>
              <label
                htmlFor="register-name"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Full name
              </label>
              <input
                id="register-name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full px-4 py-2.5 bg-zinc-900/50 border rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 text-sm outline-none transition-all duration-200
                  focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 shadow-inner
                  ${errors.name ? "border-[var(--red)]" : "border-[var(--border)]"}`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-[var(--red)]">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="register-email"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Email address
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 bg-zinc-900/50 border rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 text-sm outline-none transition-all duration-200
                  focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 shadow-inner
                  ${errors.email ? "border-[var(--red)]" : "border-[var(--border)]"}`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-[var(--red)]">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="register-password"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  className={`w-full px-4 py-2.5 pr-11 bg-zinc-900/50 border rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 text-sm outline-none transition-all duration-200
                    focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 shadow-inner
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

              {/* Strength bar */}
              {form.password && (
                <div className="mt-2.5">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength ? strengthColor : "bg-[var(--border)]"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Strength:{" "}
                    <span
                      className={`font-medium ${
                        strength === 1
                          ? "text-[var(--red)]"
                          : strength === 2
                          ? "text-[var(--yellow)]"
                          : strength === 3
                          ? "text-blue-400"
                          : "text-[var(--green)]"
                      }`}
                    >
                      {strengthLabel}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm text-white
                bg-[var(--text-primary)] text-[var(--bg-primary)]
                hover:bg-zinc-200 hover:shadow-lg hover:shadow-white/10
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 mt-4"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UserPlus size={16} />
              )}
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        {/* Footer link */}
        <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[var(--indigo-light)] hover:text-[var(--indigo)] font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
