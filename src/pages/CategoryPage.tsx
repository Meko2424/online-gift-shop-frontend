import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ProductCard, {
  type Product as CardProduct,
} from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import type { ProductListOut } from "../types/api";

type Collection = "best-sellers" | "new" | "trending";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80";

function mapSlugToCollection(slug: string): Collection | null {
  const s = slug.toLowerCase();
  if (s === "best-sellers" || s === "bestsellers") return "best-sellers";
  if (s === "new-arrivals" || s === "new" || s === "new-popular") return "new";
  if (s === "trending" || s === "trending-gifts") return "trending";
  return null;
}

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function toCard(p: ProductListOut): CardProduct {
  const badge =
    p.type === "bundle"
      ? "Combo"
      : p.is_best_seller
        ? "Best Seller"
        : p.is_new
          ? "New"
          : p.is_trending
            ? "Trending"
            : undefined;

  return {
    id: String(p.id),
    name: p.name,
    href: `/p/${p.slug}`,
    imageUrl: p.image_url || FALLBACK_IMG,
    price: p.price,
    compareAtPrice: p.compare_at_price ?? undefined,
    badge,
  };
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-4 py-2 text-sm font-semibold transition",
        active ? "bg-black text-white" : "bg-white border hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function CategoryPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const [sp, setSp] = useSearchParams();

  // URL-driven state
  const qParam = sp.get("q") ?? "";
  const collectionParam = (sp.get("collection") as Collection | null) ?? null;

  // If /c/best-sellers etc., treat it as a collection page unless user explicitly set category in query
  const inferredCollection = useMemo(() => mapSlugToCollection(slug), [slug]);

  const category = inferredCollection ? null : slug;
  const collection: Collection | null = collectionParam ?? inferredCollection;

  const [offset, setOffset] = useState(0);
  const limit = 24;

  const { data, loading, error } = useProducts({
    category,
    collection,
    q: qParam || null,
    limit,
    offset,
  });

  const cards = useMemo(() => data.map(toCard), [data]);

  const pageTitle = useMemo(() => {
    if (collection === "best-sellers") return "Best Sellers";
    if (collection === "new") return "New Arrivals";
    if (collection === "trending") return "Trending";
    return titleFromSlug(slug);
  }, [slug, collection]);

  function setCollection(next: Collection | null) {
    const nextSp = new URLSearchParams(sp);
    if (next) nextSp.set("collection", next);
    else nextSp.delete("collection");
    setOffset(0);
    setSp(nextSp);
  }

  function onSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const q = (fd.get("q") as string) ?? "";
    const nextSp = new URLSearchParams(sp);
    if (q.trim()) nextSp.set("q", q.trim());
    else nextSp.delete("q");
    setOffset(0);
    setSp(nextSp);
  }

  const canLoadMore = data.length === limit; // heuristic

  return (
    <main className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{pageTitle}</span>
        </nav>

        {/* Header row */}
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              {pageTitle}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Browse products and combos. Use filters to refine.
            </p>
          </div>

          {/* Search */}
          <form onSubmit={onSearchSubmit} className="w-full md:w-[420px]">
            <div className="flex items-center gap-2">
              <input
                name="q"
                defaultValue={qParam}
                placeholder="Search products…"
                className="w-full rounded-full border bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-900"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Chip active={!collection} onClick={() => setCollection(null)}>
            All
          </Chip>
          <Chip
            active={collection === "best-sellers"}
            onClick={() => setCollection("best-sellers")}
          >
            Best Sellers
          </Chip>
          <Chip
            active={collection === "new"}
            onClick={() => setCollection("new")}
          >
            New
          </Chip>
          <Chip
            active={collection === "trending"}
            onClick={() => setCollection("trending")}
          >
            Trending
          </Chip>

          {(qParam || collection) && (
            <button
              type="button"
              className="ml-2 text-sm font-semibold underline underline-offset-4 text-gray-700 hover:text-black"
              onClick={() => {
                setOffset(0);
                setSp(new URLSearchParams());
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* States */}
        {error ? (
          <div className="mt-8 rounded-3xl border bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold text-gray-900">
              Couldn’t load products
            </p>
            <p className="mt-2 text-sm text-gray-600">{error}</p>
          </div>
        ) : null}

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[420px] rounded-2xl border bg-white animate-pulse"
                />
              ))
            : cards.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>

        {/* Load more */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            disabled={loading || !canLoadMore}
            onClick={() => setOffset((v) => v + limit)}
            className={[
              "rounded-full px-6 py-3 text-sm font-semibold border bg-white",
              loading || !canLoadMore
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-50",
            ].join(" ")}
          >
            {loading
              ? "Loading…"
              : canLoadMore
                ? "Load more"
                : "No more products"}
          </button>
        </div>
      </div>
    </main>
  );
}
