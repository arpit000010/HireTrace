import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Eye,
  Building2,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  Loader2,
  Trash2,
  ArrowLeft,
  Send,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Navbar from "../components/Navbar.jsx";
import api from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";
import { DIFFICULTY_COLORS, RESULT_COLORS } from "../utils/constants.js";
import { formatDistanceToNow } from "../utils/dateUtils.js";

const ExperienceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [experience, setExperience] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [userVote, setUserVote] = useState(null); // 'up' | 'down' | null

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/experiences/${id}`);
        const exp = data.data;
        setExperience(exp);
        setComments(exp.comments || []);
        setVotes({
          upvotes: exp.upvotes?.length || 0,
          downvotes: exp.downvotes?.length || 0,
        });

        // Determine user's current vote
        if (user) {
          if (exp.upvotes?.includes(user._id)) setUserVote("up");
          else if (exp.downvotes?.includes(user._id)) setUserVote("down");
        }

        // Check bookmark
        if (user?.bookmarks?.includes(id)) setIsBookmarked(true);
      } catch {
        toast.error("Failed to load experience");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user, navigate]);

  const handleVote = async (type) => {
    try {
      const { data } = await api.post(`/experiences/${id}/vote`, { type });
      setVotes({
        upvotes: data.data.upvotes,
        downvotes: data.data.downvotes,
      });
      setUserVote((prev) => (prev === type ? null : type));
    } catch {
      toast.error("Failed to vote");
    }
  };

  const handleBookmark = async () => {
    try {
      const { data } = await api.post(`/experiences/${id}/bookmark`);
      setIsBookmarked(data.data.isBookmarked);
      toast.success(data.data.isBookmarked ? "Bookmarked!" : "Removed bookmark");
    } catch {
      toast.error("Failed to update bookmark");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const { data } = await api.post(`/comments/experience/${id}`, {
        text: commentText.trim(),
      });
      setComments((prev) => [data.data, ...prev]);
      setCommentText("");
      toast.success("Comment added");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)]">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-[var(--indigo)]" />
        </div>
      </div>
    );
  }

  if (!experience) return null;

  const {
    company,
    role,
    difficulty,
    result,
    experienceType,
    content,
    tips,
    rounds,
    questions,
    views,
    author,
    createdAt,
    tags = [],
  } = experience;

  const isAuthor = user?._id === author?._id;

  const handleDelete = async () => {
    if (!window.confirm("Delete this experience?")) return;
    try {
      await api.delete(`/experiences/${id}`);
      toast.success("Experience deleted");
      navigate("/");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-5 transition-colors"
        >
          <ArrowLeft size={15} /> Back
        </button>

        {/* Card */}
        <article className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 mb-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center text-[var(--indigo-light)]">
                <Building2 size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[var(--text-primary)]">
                  {company}
                </h1>
                <div className="flex items-center gap-1.5 text-[var(--text-secondary)] text-sm mt-0.5">
                  <Briefcase size={13} />
                  {role}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-xl border transition-colors ${
                  isBookmarked
                    ? "border-[var(--indigo)] bg-[var(--indigo)]/10 text-[var(--indigo-light)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--indigo)] hover:text-[var(--indigo-light)]"
                }`}
              >
                {isBookmarked ? (
                  <BookmarkCheck size={16} />
                ) : (
                  <Bookmark size={16} />
                )}
              </button>
              {isAuthor && (
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            {difficulty && (
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium border ${DIFFICULTY_COLORS[difficulty]}`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            )}
            {result && (
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${RESULT_COLORS[result]}`}
              >
                {result.charAt(0).toUpperCase() + result.slice(1)}
              </span>
            )}
            {experienceType && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-primary)] border border-[var(--border)]">
                {experienceType}
              </span>
            )}
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-medium text-[var(--cyan)] bg-[var(--cyan)]/10 border border-[var(--cyan)]/20"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="prose prose-sm max-w-none">
            <p className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap text-sm">
              {content}
            </p>
          </div>

          {/* Rounds */}
          {rounds?.length > 0 && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                Interview Rounds
              </h2>
              <ol className="space-y-1.5">
                {rounds.map((round, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--indigo)]/20 text-[var(--indigo-light)] text-xs flex items-center justify-center font-semibold">
                      {i + 1}
                    </span>
                    {round}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Questions */}
          {questions?.length > 0 && (
            <div className="mt-5">
              <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-2">
                Questions Asked
              </h2>
              <ul className="space-y-1.5">
                {questions.map((q, i) => (
                  <li
                    key={i}
                    className="text-sm text-[var(--text-secondary)] flex items-start gap-2"
                  >
                    <span className="text-[var(--indigo-light)] mt-0.5">•</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips */}
          {tips && (
            <div className="mt-5 p-3 rounded-xl bg-[var(--green)]/5 border border-[var(--green)]/20">
              <h2 className="text-sm font-semibold text-[var(--green)] mb-1">
                💡 Tips
              </h2>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {tips}
              </p>
            </div>
          )}

          {/* Meta footer */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border)]">
            {/* Votes */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVote("up")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                  userVote === "up"
                    ? "border-[var(--green)] bg-[var(--green)]/10 text-[var(--green)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--green)] hover:text-[var(--green)]"
                }`}
              >
                <ThumbsUp size={14} /> {votes.upvotes}
              </button>
              <button
                onClick={() => handleVote("down")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                  userVote === "down"
                    ? "border-[var(--red)] bg-[var(--red)]/10 text-[var(--red)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--red)] hover:text-[var(--red)]"
                }`}
              >
                <ThumbsDown size={14} /> {votes.downvotes}
              </button>
              <span className="flex items-center gap-1 text-xs text-[var(--text-secondary)] ml-2">
                <Eye size={13} /> {views} views
              </span>
            </div>

            {/* Author */}
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[var(--indigo)] to-[var(--cyan)] flex items-center justify-center text-white text-[10px] font-bold">
                {author?.name?.charAt(0).toUpperCase()}
              </div>
              <span>{author?.name}</span>
              <span>· {formatDistanceToNow(createdAt)}</span>
            </div>
          </div>
        </article>

        {/* Comments */}
        <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
          <h2 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-4">
            <MessageSquare size={16} className="text-[var(--indigo-light)]" />
            Comments ({comments.length})
          </h2>

          {/* Add comment */}
          <form onSubmit={handleAddComment} className="flex gap-2 mb-5">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment…"
              className="flex-1 px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 outline-none focus:border-[var(--indigo)] transition-colors"
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="px-3 py-2.5 rounded-xl bg-[var(--indigo)] text-white hover:bg-[var(--indigo-light)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submittingComment ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </form>

          {/* Comments list */}
          {comments.length === 0 ? (
            <p className="text-center text-sm text-[var(--text-secondary)] py-6">
              No comments yet. Be the first!
            </p>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)]"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[var(--indigo)] to-[var(--cyan)] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                    {comment.userId?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-[var(--text-primary)]">
                        {comment.userId?.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-secondary)]">
                          {formatDistanceToNow(comment.createdAt)}
                        </span>
                        {user?._id === comment.userId?._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-[var(--text-secondary)] hover:text-[var(--red)] transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ExperienceDetailPage;
