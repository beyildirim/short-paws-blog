import { useEffect, useState } from 'react';

export function useReadingProgress(targetRef: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const target = targetRef.current;
      if (!target) {
        setProgress(0);
        return;
      }
      const scrollTop = window.scrollY;
      const targetTop = target.offsetTop;
      const targetHeight = target.offsetHeight;
      const viewHeight = window.innerHeight;
      const total = targetHeight - viewHeight;
      if (total <= 0) {
        setProgress(100);
        return;
      }
      const scrolled = scrollTop - targetTop;
      const percentage = Math.min(100, Math.max(0, (scrolled / total) * 100));
      setProgress(percentage);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [targetRef]);

  return progress;
}
