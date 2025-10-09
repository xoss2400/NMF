import React, { useRef, useEffect } from "react";

interface HorizontalScrollerProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  items?: any[];
  renderItem?: (item: any, index?: number) => React.ReactNode;
  itemWidth?: string;
  gap?: string;
  children?: React.ReactNode;
  showArrows?: boolean;
  className?: string;
}

export default function HorizontalScroller({
  title,
  subtitle,
  items = [],
  renderItem,
  itemWidth = "w-40",
  gap = "gap-6",
  children,
  showArrows = true,
  className = "",
}: HorizontalScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const scrollBy = (offset: number) => {
    if (!scrollerRef.current) return;
    scrollerRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  // keyboard support (arrow keys) when the scroller is focused
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollBy(320);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollBy(-320);
      }
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, []);

  const renderContents = () => {
    if (children) return children;
    if (Array.isArray(items) && renderItem) {
      return items.map((item, i) => (
        <div key={item?.id ?? i} className={`flex-shrink-0 ${itemWidth} snap-center`}>
          {renderItem(item, i)}
        </div>
      ));
    }
    return null;
  };

  return (
    <section className={`mb-12 relative ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h2 className="text-2xl font-bold">{title}</h2>}
          {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
        </div>
      )}

      <div className="max-w-7xl mx-auto relative">
        {showArrows && (
          <button
            aria-label="Scroll left"
            onClick={() => scrollBy(-320)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60"
          >
            ‹
          </button>
        )}

        {showArrows && (
          <button
            aria-label="Scroll right"
            onClick={() => scrollBy(320)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black bg-opacity-40 text-white rounded-full p-2 hover:bg-opacity-60"
          >
            ›
          </button>
        )}

        <div
          ref={scrollerRef}
          tabIndex={0}
          role="list"
          className={`flex ${gap} overflow-x-auto pb-4 snap-x snap-mandatory px-2`}
        >
          {renderContents()}
        </div>
      </div>
    </section>
  );
}
