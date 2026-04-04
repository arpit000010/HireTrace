import { Link } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Eye,
  MessageCircle,
  Bookmark,
  BookmarkCheck,
  Building2,
  Briefcase,
} from "lucide-react";
import { DIFFICULTY_COLORS, RESULT_COLORS } from "../utils/constants.js";
import { formatDistanceToNow } from "../utils/dateUtils.js";

const ExperienceCard = ({ experience, onBookmark, isBookmarked }) => {
  const {
    _id,
    company,
    role,
    difficulty,
    result,
    experienceType,
    content,
    upvotes = [],
    downvotes = [],
    views = 0,
    comments = [],
    author,
    createdAt,
  } = experience;



  return (
    <article className="group relative bg-[var(--bg-primary)] border border-[var(--border)] rounded-[20px] p-5 hover:bg-[var(--bg-card)] transition-all duration-300 flex flex-col gap-3.5 hover:shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:-translate-y-1 hover:border-[var(--border-hover)] ring-1 ring-inset ring-white/5 overflow-hidden">
      {/* Background radial gradient on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(ellipse_at_top_right,_var(--indigo-glow),_transparent_50%)] pointer-events-none transition-opacity duration-300"></div>

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0 z-10">
          {/* Company icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-[var(--border)] shadow-[inset_0_1px_rgba(255,255,255,0.1)] flex items-center justify-center shrink-0 text-[var(--indigo-light)] group-hover:scale-105 transition-transform duration-300">
            <Building2 size={18} strokeWidth={1.5} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] text-[15px] leading-tight truncate tracking-tight">
              {company}
            </h3>
            <div className="flex items-center gap-1.5 mt-1 text-[var(--text-secondary)]">
              <Briefcase size={12} strokeWidth={1.5} />
              <span className="text-[13px] truncate font-medium">{role}</span>
            </div>
          </div>
        </div>

        {/* Bookmark */}
        {onBookmark && (
          <button
            onClick={() => onBookmark(_id)}
            className={`p-2 rounded-xl transition-all duration-200 shrink-0 z-10 hover:scale-110 active:scale-95 ${
              isBookmarked
                ? "text-[var(--indigo-light)] bg-[var(--indigo)]/15 shadow-[inset_0_0_8px_rgba(99,102,241,0.2)] ring-1 ring-[var(--indigo)]/30"
                : "text-[var(--text-secondary)] hover:text-[var(--indigo-light)] hover:bg-[var(--indigo)]/10 ring-1 ring-transparent hover:ring-[var(--indigo)]/20"
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={16} strokeWidth={2} /> : <Bookmark size={16} strokeWidth={1.5} />}
          </button>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {difficulty && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide uppercase shadow-sm ${DIFFICULTY_COLORS[difficulty]}`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        )}
        {result && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase shadow-sm ${RESULT_COLORS[result]}`}
          >
            {result.charAt(0).toUpperCase() + result.slice(1)}
          </span>
        )}
        {experienceType && (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase text-[var(--text-secondary)] bg-zinc-800/50 border border-zinc-700 shadow-sm">
            {experienceType}
          </span>
        )}
      </div>

      {/* Excerpt */}
      <Link to={`/experience/${_id}`} className="block mt-1 z-10">
        <p className="text-[var(--text-secondary)] text-[14px] leading-[1.6] line-clamp-2 group-hover:text-zinc-300 transition-colors">
          {content}
        </p>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]/50 mt-auto z-10">
        {/* Stats */}
        <div className="flex items-center gap-3.5 text-[var(--text-secondary)] text-[13px] font-medium">
          <span className="flex items-center gap-1.5 hover:text-green-400 transition-colors">
            <ThumbsUp size={14} strokeWidth={1.5} />
            {upvotes.length}
          </span>
          <span className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
            <ThumbsDown size={14} strokeWidth={1.5} />
            {downvotes.length}
          </span>
          <span className="flex items-center gap-1.5">
            <Eye size={14} strokeWidth={1.5} />
            {views}
          </span>
          <span className="flex items-center gap-1.5">
            <MessageCircle size={14} strokeWidth={1.5} />
            {Array.isArray(comments) ? comments.length : 0}
          </span>
        </div>

        {/* Author + date */}
        <div className="flex items-center gap-2 text-[12px] text-[var(--text-secondary)] font-medium">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold shadow-sm ring-1 ring-white/10">
            {author?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline truncate max-w-[90px]">
            {author?.name}
          </span>
          <span className="opacity-50">·</span>
          <span>{formatDistanceToNow(createdAt)}</span>
        </div>
      </div>
    </article>
  );
};

export default ExperienceCard;
