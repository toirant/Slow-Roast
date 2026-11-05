import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useInView<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.01,
  rootMargin = '100px 0px 50px 0px',
  triggerOnce = true,
}: UseInViewOptions = {}) {
  const elementRef = useRef<T | null>(null);
  const [isInView, setIsInView] = useState<boolean>(false);

  useEffect(() => {
    const node = elementRef.current;
    if (!node) return;

    // Check if IntersectionObserver is available (handles SSR/older environments)
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref: elementRef, isInView };
}
