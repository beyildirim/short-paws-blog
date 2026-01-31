interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function ResponsiveImage({ src, alt, className, loading = 'lazy' }: ResponsiveImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
    />
  );
}
