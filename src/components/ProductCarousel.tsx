import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard, { type Product } from "./ProductCard";

export default function ProductCarousel({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // 280 card + 24 gap (gap-6)
  const scrollByAmount = useMemo(() => 304, []);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  function updateArrows() {
    const el = scrollerRef.current;
    if (!el) return;

    // Use small tolerance to avoid "almost at end" floating point issues
    const tolerance = 2;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setCanLeft(el.scrollLeft > tolerance);
    setCanRight(el.scrollLeft < maxScrollLeft - tolerance);
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    updateArrows();

    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => updateArrows());
    ro.observe(el);

    return () => {
      el.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.length]);

  function scrollLeft() {
    scrollerRef.current?.scrollBy({
      left: -scrollByAmount,
      behavior: "smooth",
    });
  }

  function scrollRight() {
    scrollerRef.current?.scrollBy({ left: scrollByAmount, behavior: "smooth" });
  }

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 pb-14">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] text-gray-500">
              FEATURED
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900">
              {title}
            </h2>
          </div>

          {/* Desktop arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={scrollLeft}
              disabled={!canLeft}
              className={[
                "rounded-full border bg-white/90 backdrop-blur p-2 shadow-md transition",
                canLeft ? "hover:bg-gray-50" : "opacity-40 cursor-not-allowed",
              ].join(" ")}
              aria-label="Scroll left"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              disabled={!canRight}
              className={[
                "rounded-full border bg-white/90 backdrop-blur p-2 shadow-md transition",
                canRight ? "hover:bg-gray-50" : "opacity-40 cursor-not-allowed",
              ].join(" ")}
              aria-label="Scroll right"
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="relative mt-6">
          {/* Mask wrapper */}
          <div className="relative overflow-hidden">
            {/* Edge fades (premium feel) */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-gray-50 via-gray-50/80 to-transparent" />

            {/* Mobile arrows overlay */}
            <button
              type="button"
              onClick={scrollLeft}
              disabled={!canLeft}
              className={[
                "sm:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white/95 p-2 shadow transition",
                canLeft ? "hover:bg-white" : "opacity-40 cursor-not-allowed",
              ].join(" ")}
              aria-label="Scroll left"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={scrollRight}
              disabled={!canRight}
              className={[
                "sm:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-white/95 p-2 shadow transition",
                canRight ? "hover:bg-white" : "opacity-40 cursor-not-allowed",
              ].join(" ")}
              aria-label="Scroll right"
            >
              <ChevronRight />
            </button>

            <div
              ref={scrollerRef}
              className="
                carousel-scroll
                grid grid-flow-col auto-cols-[280px] gap-6
                overflow-x-auto scroll-smooth snap-x snap-mandatory
                pb-2 px-6
                [scrollbar-width:none] [-ms-overflow-style:none]
              "
              style={{
                WebkitOverflowScrolling: "touch",
                scrollPaddingLeft: "24px",
                scrollPaddingRight: "24px",
              }}
            >
              {/* Scoped scrollbar hide */}
              <style>{`
                .carousel-scroll::-webkit-scrollbar { display: none; }
              `}</style>

              {products.map((p) => (
                <div key={p.id} className="snap-start">
                  <ProductCard product={p} />
                </div>
              ))}

              {/* spacer so last card can snap cleanly */}
              <div className="w-[24px]" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
