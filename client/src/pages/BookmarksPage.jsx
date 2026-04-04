import { useState, useEffect } from "react";
import { Loader2, Bookmark } from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import ExperienceCard from "../components/ExperienceCard.jsx";
import api from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";

const BookmarksPage = () => {
  const { user } = useAuth();
  const [bookmarkedExperiences, setBookmarkedExperiences] = useState([]);
  const [bookmarks, setBookmarks] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      if (!user?.bookmarks?.length) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch each bookmarked experience
        const results = await Promise.allSettled(
          user.bookmarks.map((id) => api.get(`/experiences/${id}`))
        );
        const exps = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value.data.data);
        setBookmarkedExperiences(exps);
        setBookmarks(new Set(user.bookmarks));
      } catch {
        toast.error("Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleBookmark = async (id) => {
    try {
      const { data } = await api.post(`/experiences/${id}/bookmark`);
      if (!data.data.isBookmarked) {
        // Remove from list
        setBookmarkedExperiences((prev) => prev.filter((e) => e._id !== id));
        setBookmarks((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success("Bookmark removed");
      }
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Bookmark size={22} className="text-[var(--indigo-light)]" />
            Bookmarks
          </h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            Experiences you've saved for later
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={28} className="animate-spin text-[var(--indigo)]" />
          </div>
        ) : bookmarkedExperiences.length === 0 ? (
          <div className="text-center py-20 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
            <p className="text-4xl mb-3">🔖</p>
            <p className="text-[var(--text-secondary)] text-sm">
              No bookmarks yet. Save experiences from the feed!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarkedExperiences.map((exp) => (
              <ExperienceCard
                key={exp._id}
                experience={exp}
                onBookmark={handleBookmark}
                isBookmarked={bookmarks.has(exp._id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BookmarksPage;
