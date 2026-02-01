interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

export function ResponsiveImage({ src, alt, className, loading = 'lazy', width, height }: ResponsiveImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      decoding="async"
      width={width}
      height={height}
    />
  );
}
