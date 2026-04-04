import { useState, useEffect } from "react";
import { Loader2, User, Mail, Calendar, FileText } from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import ExperienceCard from "../components/ExperienceCard.jsx";
import api from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";
import { formatDistanceToNow } from "../utils/dateUtils.js";

const ProfilePage = () => {
  const { user } = useAuth();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyExperiences = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/experiences/my");
        setExperiences(data.data.experiences);
      } catch {
        toast.error("Failed to load your experiences");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyExperiences();
  }, [user]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile card */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--indigo)] to-[var(--cyan)] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[var(--indigo)]/25">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-[var(--text-primary)]">{user?.name}</h1>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                  <Mail size={13} /> {user?.email}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
                  <Calendar size={13} /> Joined {formatDistanceToNow(user?.createdAt)}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="shrink-0 text-center hidden sm:block">
              <p className="text-2xl font-bold text-[var(--indigo-light)]">
                {experiences.length}
              </p>
              <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1 justify-center">
                <FileText size={11} /> Posts
              </p>
            </div>
          </div>

          {user?.bio && (
            <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)] pt-4">
              {user.bio}
            </p>
          )}
        </div>

        {/* My experiences */}
        <h2 className="text-base font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <FileText size={15} className="text-[var(--indigo-light)]" />
          My Experiences
          <span className="text-[var(--text-secondary)] font-normal text-sm">
            ({experiences.length})
          </span>
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-[var(--indigo)]" />
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-16 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl">
            <p className="text-4xl mb-3">📝</p>
            <p className="text-[var(--text-secondary)] text-sm">
              You haven't shared any experiences yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {experiences.map((exp) => (
              <ExperienceCard key={exp._id} experience={exp} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;
