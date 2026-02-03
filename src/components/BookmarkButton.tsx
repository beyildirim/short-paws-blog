import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarkStore } from '../store/bookmarkStore';

interface BookmarkButtonProps {
    postId: string;
    size?: number;
    showLabel?: boolean;
    className?: string;
}

export function BookmarkButton({
    postId,
    size = 20,
    showLabel = false,
    className = ''
}: BookmarkButtonProps) {
    const { toggleBookmark } = useBookmarkStore();
    const bookmarked = useBookmarkStore(state => state.bookmarkedPosts.includes(postId));

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(postId);
    };

    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-1 transition-all duration-300 ${bookmarked
                ? 'text-purple-600 scale-110'
                : 'text-gray-400 hover:text-purple-500'
                } ${className}`}
            aria-label={bookmarked ? 'Remove from reading list' : 'Add to reading list'}
            title={bookmarked ? 'Remove from reading list' : 'Save for later'}
        >
            {bookmarked ? (
                <BookmarkCheck size={size} className="fill-purple-200" />
            ) : (
                <Bookmark size={size} />
            )}
            {showLabel && (
                <span className="text-sm">
                    {bookmarked ? 'Saved' : 'Save'}
                </span>
            )}
        </button>
    );
}
