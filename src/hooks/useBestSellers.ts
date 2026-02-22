import { useEffect, useState } from "react";
import { apiGet } from "../lib/api";
import type { ProductListOut } from "../types/api";

export function useBestSellers() {
  const [data, setData] = useState<ProductListOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    apiGet<ProductListOut[]>("/api/products?collection=best-sellers&limit=20")
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message ?? "Failed to load best sellers");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
