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

  const voteScore = upvotes.length - downvotes.length;

  return (
    <article className="group bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] transition-all duration-200 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Company icon */}
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] flex items-center justify-center shrink-0 text-[var(--indigo-light)]">
            <Building2 size={18} />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] text-sm leading-tight truncate">
              {company}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 text-[var(--text-secondary)]">
              <Briefcase size={11} />
              <span className="text-xs truncate">{role}</span>
            </div>
          </div>
        </div>

        {/* Bookmark */}
        {onBookmark && (
          <button
            onClick={() => onBookmark(_id)}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              isBookmarked
                ? "text-[var(--indigo-light)] bg-[var(--indigo)]/10"
                : "text-[var(--text-secondary)] hover:text-[var(--indigo-light)] hover:bg-[var(--indigo)]/10"
            }`}
          >
            {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        {difficulty && (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${DIFFICULTY_COLORS[difficulty]}`}
          >
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        )}
        {result && (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${RESULT_COLORS[result]}`}
          >
            {result.charAt(0).toUpperCase() + result.slice(1)}
          </span>
        )}
        {experienceType && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-primary)] border border-[var(--border)]">
            {experienceType}
          </span>
        )}
      </div>

      {/* Excerpt */}
      <Link to={`/experience/${_id}`} className="block">
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed line-clamp-2 group-hover:text-[var(--text-primary)] transition-colors">
          {content}
        </p>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[var(--border)] mt-auto">
        {/* Stats */}
        <div className="flex items-center gap-3 text-[var(--text-secondary)] text-xs">
          <span className="flex items-center gap-1">
            <ThumbsUp size={12} />
            {upvotes.length}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown size={12} />
            {downvotes.length}
          </span>
          <span className="flex items-center gap-1">
            <Eye size={12} />
            {views}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} />
            {Array.isArray(comments) ? comments.length : 0}
          </span>
        </div>

        {/* Author + date */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[var(--indigo)] to-[var(--cyan)] flex items-center justify-center text-white text-[10px] font-bold">
            {author?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline truncate max-w-[80px]">
            {author?.name}
          </span>
          <span>· {formatDistanceToNow(createdAt)}</span>
        </div>
      </div>
    </article>
  );
};

export default ExperienceCard;
