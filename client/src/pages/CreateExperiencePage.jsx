import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, PlusCircle, X, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";
import {
  COMPANIES,
  DIFFICULTIES,
  RESULTS,
  EXPERIENCE_TYPES,
} from "../utils/constants.js";

const InputField = ({ label, id, error, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
      {label}
    </label>
    {children}
    {error && <p className="mt-1.5 text-xs text-[var(--red)]">{error}</p>}
  </div>
);

const CreateExperiencePage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company: "",
    role: "",
    experienceType: "",
    difficulty: "",
    result: "",
    content: "",
    tips: "",
    rounds: [],
    questions: [],
    tags: [],
  });
  const [roundInput, setRoundInput] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const addItem = (key, input, setInput) => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setForm((p) => ({ ...p, [key]: [...p[key], trimmed] }));
    setInput("");
  };

  const removeItem = (key, index) =>
    setForm((p) => ({ ...p, [key]: p[key].filter((_, i) => i !== index) }));

  const validate = () => {
    const errs = {};
    if (!form.company) errs.company = "Company is required";
    if (!form.role.trim()) errs.role = "Role is required";
    if (!form.content.trim()) errs.content = "Experience description is required";
    if (form.content.trim().length < 50)
      errs.content = "Please write at least 50 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);

    setLoading(true);
    try {
      const { data } = await api.post("/experiences", form);
      toast.success("Experience shared!");
      navigate(`/experience/${data.data._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to post experience");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (err) =>
    `w-full px-4 py-2.5 bg-[var(--bg-primary)] border rounded-xl text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 text-sm outline-none transition-all duration-200 focus:border-[var(--indigo)] focus:ring-2 focus:ring-[var(--indigo)]/20 ${
      err ? "border-[var(--red)]" : "border-[var(--border)]"
    }`;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-5 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Share your experience</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Help others prepare by sharing what you went through
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Basic Info</h2>

            {/* Company */}
            <InputField label="Company *" id="company" error={errors.company}>
              <select
                id="company"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                className={inputClass(errors.company)}
              >
                <option value="">Select company…</option>
                {COMPANIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </InputField>

            {/* Role */}
            <InputField label="Role / Position *" id="role" error={errors.role}>
              <input
                id="role"
                type="text"
                value={form.role}
                onChange={(e) => set("role", e.target.value)}
                placeholder="e.g. Software Engineer Intern"
                className={inputClass(errors.role)}
              />
            </InputField>

            {/* Grid: type + difficulty + result */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField label="Interview Type" id="type">
                <select
                  id="type"
                  value={form.experienceType}
                  onChange={(e) => set("experienceType", e.target.value)}
                  className={inputClass()}
                >
                  <option value="">Any</option>
                  {EXPERIENCE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </InputField>

              <InputField label="Difficulty" id="difficulty">
                <select
                  id="difficulty"
                  value={form.difficulty}
                  onChange={(e) => set("difficulty", e.target.value)}
                  className={inputClass()}
                >
                  <option value="">Any</option>
                  {DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
                  ))}
                </select>
              </InputField>

              <InputField label="Result" id="result">
                <select
                  id="result"
                  value={form.result}
                  onChange={(e) => set("result", e.target.value)}
                  className={inputClass()}
                >
                  <option value="">Any</option>
                  {RESULTS.map((r) => (
                    <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                  ))}
                </select>
              </InputField>
            </div>
          </div>

          {/* Content */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Your Story</h2>

            <InputField label="Experience Description *" id="content" error={errors.content}>
              <textarea
                id="content"
                rows={6}
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder="Describe your interview experience in detail — how the process went, what topics were covered, the atmosphere, etc."
                className={`${inputClass(errors.content)} resize-none`}
              />
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                {form.content.length} characters
              </p>
            </InputField>

            <InputField label="Tips for future candidates" id="tips">
              <textarea
                id="tips"
                rows={3}
                value={form.tips}
                onChange={(e) => set("tips", e.target.value)}
                placeholder="Any advice or tips you'd share with someone preparing for this role?"
                className={`${inputClass()} resize-none`}
              />
            </InputField>
          </div>

          {/* Rounds, Questions, Tags */}
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Details (optional)</h2>

            {/* Rounds */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Interview Rounds
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={roundInput}
                  onChange={(e) => setRoundInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("rounds", roundInput, setRoundInput))}
                  placeholder="e.g. DSA Round, System Design…"
                  className={inputClass()}
                />
                <button type="button" onClick={() => addItem("rounds", roundInput, setRoundInput)} className="px-3 py-2 rounded-xl bg-[var(--indigo)]/15 text-[var(--indigo-light)] hover:bg-[var(--indigo)]/25 transition-colors">
                  <PlusCircle size={16} />
                </button>
              </div>
              {form.rounds.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.rounds.map((r, i) => (
                    <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)]">
                      <span className="text-[var(--indigo-light)] font-medium">{i + 1}.</span> {r}
                      <button type="button" onClick={() => removeItem("rounds", i)} className="ml-1 hover:text-[var(--red)]"><X size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Questions */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Questions Asked
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("questions", questionInput, setQuestionInput))}
                  placeholder="e.g. Reverse a linked list…"
                  className={inputClass()}
                />
                <button type="button" onClick={() => addItem("questions", questionInput, setQuestionInput)} className="px-3 py-2 rounded-xl bg-[var(--indigo)]/15 text-[var(--indigo-light)] hover:bg-[var(--indigo)]/25 transition-colors">
                  <PlusCircle size={16} />
                </button>
              </div>
              {form.questions.length > 0 && (
                <div className="flex flex-col gap-1">
                  {form.questions.map((q, i) => (
                    <span key={i} className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-xs text-[var(--text-secondary)]">
                      <span>• {q}</span>
                      <button type="button" onClick={() => removeItem("questions", i)} className="hover:text-[var(--red)] shrink-0"><X size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addItem("tags", tagInput, setTagInput))}
                  placeholder="e.g. DSA, OS, React…"
                  className={inputClass()}
                />
                <button type="button" onClick={() => addItem("tags", tagInput, setTagInput)} className="px-3 py-2 rounded-xl bg-[var(--indigo)]/15 text-[var(--indigo-light)] hover:bg-[var(--indigo)]/25 transition-colors">
                  <PlusCircle size={16} />
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {form.tags.map((t, i) => (
                    <span key={i} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-[var(--cyan)] bg-[var(--cyan)]/10 border border-[var(--cyan)]/20">
                      #{t}
                      <button type="button" onClick={() => removeItem("tags", i)} className="ml-0.5 hover:text-[var(--red)]"><X size={10} /></button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            id="create-submit"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-[var(--indigo)] to-[#4f46e5] hover:from-[var(--indigo-light)] hover:to-[var(--indigo)] disabled:opacity-50 transition-all duration-200 shadow-lg shadow-[var(--indigo)]/25"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
            {loading ? "Posting…" : "Post Experience"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateExperiencePage;
