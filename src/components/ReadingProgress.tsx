interface ReadingProgressProps {
  progress: number;
}

export function ReadingProgress({ progress }: ReadingProgressProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
      <div
        className="h-full bg-[rgb(var(--color-primary))] transition-[width] duration-150"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />
    </div>
  );
}
