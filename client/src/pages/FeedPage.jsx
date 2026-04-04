import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import ExperienceCard from "../components/ExperienceCard.jsx";
import api from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";
import {
  COMPANIES,
  DIFFICULTIES,
  RESULTS,
  EXPERIENCE_TYPES,
  SORT_OPTIONS,
} from "../utils/constants.js";

const EmptyState = ({ message }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center mb-4 text-2xl">
      🔍
    </div>
    <p className="text-[var(--text-secondary)] text-sm">{message}</p>
  </div>
);

const FeedPage = () => {
  const { user } = useAuth();

  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  // Filters
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    company: "",
    difficulty: "",
    result: "",
    experienceType: "",
    sort: "latest",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchExperiences = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (filters.company) params.set("company", filters.company);
        if (filters.difficulty) params.set("difficulty", filters.difficulty);
        if (filters.result) params.set("result", filters.result);
        if (filters.experienceType)
          params.set("experienceType", filters.experienceType);
        params.set("sort", filters.sort);
        params.set("page", page);
        params.set("limit", 12);

        const { data } = await api.get(`/experiences?${params.toString()}`);
        setExperiences(data.data.experiences);
        setPagination(data.data.pagination);
      } catch {
        toast.error("Failed to load experiences");
      } finally {
        setLoading(false);
      }
    },
    [search, filters]
  );

  // Fetch user bookmarks
  useEffect(() => {
    if (user?.bookmarks) setBookmarks(new Set(user.bookmarks));
  }, [user]);

  useEffect(() => {
    fetchExperiences(1);
  }, [fetchExperiences]);

  const handleBookmark = async (id) => {
    try {
      const { data } = await api.post(`/experiences/${id}/bookmark`);
      setBookmarks((prev) => {
        const next = new Set(prev);
        data.data.isBookmarked ? next.add(id) : next.delete(id);
        return next;
      });
      toast.success(data.data.isBookmarked ? "Bookmarked!" : "Removed bookmark");
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? "" : value }));
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => k !== "sort" && v
  ).length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Interview Experiences
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Real stories from real candidates
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="text"
              placeholder="Search by company, role, or tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/60 outline-none focus:border-[var(--indigo)] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={(e) => setFilters((p) => ({ ...p, sort: e.target.value }))}
            className="px-3 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-[var(--indigo)] transition-colors"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              showFilters || activeFilterCount > 0
                ? "border-[var(--indigo)] text-[var(--indigo-light)] bg-[var(--indigo)]/10"
                : "border-[var(--border)] text-[var(--text-secondary)] bg-[var(--bg-card)] hover:border-[var(--indigo)]"
            }`}
          >
            <SlidersHorizontal size={15} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-[var(--indigo)] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 mb-4 flex flex-wrap gap-4">
            {/* Difficulty */}
            <div>
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                Difficulty
              </p>
              <div className="flex gap-1.5">
                {DIFFICULTIES.map((d) => (
                  <button
                    key={d}
                    onClick={() => handleFilterChange("difficulty", d)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      filters.difficulty === d
                        ? "border-[var(--indigo)] bg-[var(--indigo)]/15 text-[var(--indigo-light)]"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--indigo)]"
                    }`}
                  >
                    {d.charAt(0).toUpperCase() + d.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Result */}
            <div>
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                Result
              </p>
              <div className="flex flex-wrap gap-1.5">
                {RESULTS.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleFilterChange("result", r)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      filters.result === r
                        ? "border-[var(--indigo)] bg-[var(--indigo)]/15 text-[var(--indigo-light)]"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--indigo)]"
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                Type
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EXPERIENCE_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleFilterChange("experienceType", t)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      filters.experienceType === t
                        ? "border-[var(--indigo)] bg-[var(--indigo)]/15 text-[var(--indigo-light)]"
                        : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--indigo)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
                Company
              </p>
              <select
                value={filters.company}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, company: e.target.value }))
                }
                className="px-3 py-1.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] outline-none focus:border-[var(--indigo)] transition-colors"
              >
                <option value="">All companies</option>
                {COMPANIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={() =>
                  setFilters({
                    company: "",
                    difficulty: "",
                    result: "",
                    experienceType: "",
                    sort: "latest",
                  })
                }
                className="self-end flex items-center gap-1 text-xs text-[var(--red)] hover:underline"
              >
                <X size={12} /> Clear all
              </button>
            )}
          </div>
        )}

        {/* Cards grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-[var(--indigo)]" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {experiences.length === 0 ? (
                <EmptyState message="No experiences match your filters. Try adjusting them!" />
              ) : (
                experiences.map((exp) => (
                  <ExperienceCard
                    key={exp._id}
                    experience={exp}
                    onBookmark={handleBookmark}
                    isBookmarked={bookmarks.has(exp._id)}
                  />
                ))
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => fetchExperiences(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        p === pagination.page
                          ? "bg-[var(--indigo)] text-white"
                          : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default FeedPage;
