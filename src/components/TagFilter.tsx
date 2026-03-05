interface TagFilterProps {
  tags: string[];
  activeTag: string | null;
  onChange: (tag: string | null) => void;
}

export function TagFilter({ tags, activeTag, onChange }: TagFilterProps) {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by tag">
      <button
        onClick={() => onChange(null)}
        aria-pressed={activeTag === null}
        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
          activeTag === null
            ? 'bg-purple-600 text-white border-purple-600'
            : 'bg-white text-purple-600 border-purple-300 hover:border-purple-500'
        }`}
      >
        All
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onChange(tag)}
          aria-pressed={activeTag === tag}
          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
            activeTag === tag
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white text-purple-600 border-purple-300 hover:border-purple-500'
          }`}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
