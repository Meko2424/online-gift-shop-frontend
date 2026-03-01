import { useEffect, useMemo, useState } from "react";
import { apiGet } from "../lib/api";
import type { ProductListOut } from "../types/api";

type Collection = "best-sellers" | "new" | "trending";

function buildQuery(
  params: Record<string, string | number | undefined | null>,
) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    qs.set(k, String(v));
  });
  return qs.toString();
}

export function useProducts(opts: {
  category?: string | null;
  collection?: Collection | null;
  q?: string | null;
  limit?: number;
  offset?: number;
}) {
  const { category, collection, q, limit = 24, offset = 0 } = opts;

  const [data, setData] = useState<ProductListOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = useMemo(
    () => JSON.stringify({ category, collection, q, limit, offset }),
    [category, collection, q, limit, offset],
  );

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const query = buildQuery({
      category: category || undefined,
      collection: collection || undefined,
      q: q || undefined,
      limit,
      offset,
    });

    apiGet<ProductListOut[]>(`/api/products?${query}`)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message ?? "Failed to load products");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { data, loading, error };
}
