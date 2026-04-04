import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import api from "../api/axios.js";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (hasVerified.current) return;
      hasVerified.current = true;

      try {
        const { data } = await api.get(`/auth/verify-email/${token}`);
        setStatus("success");
        setMessage(data.message);
      } catch (err) {
        setStatus("error");
        setMessage(err?.response?.data?.message || "Verification failed");
      }
    };

    if (token) verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 size={40} className="animate-spin text-[var(--indigo)] mb-4" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Verifying...</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">Checking your verification link.</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center">
            <CheckCircle2 size={50} className="text-[var(--green)] mb-4" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Email Verified!</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">{message}</p>
            <Link
              to="/login"
              className="mt-6 px-6 py-2.5 rounded-xl bg-[var(--indigo)] text-white hover:bg-[var(--indigo-light)] font-medium transition-colors inline-block"
            >
              Sign in now
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center">
            <XCircle size={50} className="text-[var(--red)] mb-4" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Verification Failed</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">{message}</p>
            <Link
              to="/register"
              className="mt-6 px-6 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--indigo)] font-medium transition-colors inline-block"
            >
              Try again
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
