import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  product_id: number;
  slug: string;
  name: string;
  image_url?: string | null;
  unit_price: number;
  qty: number;
  product_type?: "simple" | "bundle";
  delivery_date?: string;
};

type CartState = {
  items: CartItem[];
  itemsCount: number;
  subtotal: number;

  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (product_id: number, qty: number) => void;
  removeItem: (product_id: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartState | null>(null);

const LS_KEY = "bole_cart_v1";

function clampQty(qty: number) {
  if (!Number.isFinite(qty)) return 1;
  return Math.max(1, Math.floor(qty));
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as CartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const api: CartState = useMemo(() => {
    const itemsCount = items.reduce((sum, it) => sum + it.qty, 0);
    const subtotal = items.reduce((sum, it) => sum + it.qty * it.unit_price, 0);

    function addItem(item: Omit<CartItem, "qty">, qty = 1) {
      const q = clampQty(qty);

      setItems((prev) => {
        const idx = prev.findIndex((x) => x.product_id === item.product_id);
        if (idx >= 0) {
          const next = [...prev];
          const existing = next[idx];

          // Update details + optionally update delivery_date if provided
          next[idx] = {
            ...existing,
            ...item,
            delivery_date: item.delivery_date ?? existing.delivery_date,
            qty: existing.qty + q,
          };
          return next;
        }

        return [...prev, { ...item, qty: q }];
      });
    }

    function setQty(product_id: number, qty: number) {
      const q = clampQty(qty);
      setItems((prev) =>
        prev.map((it) =>
          it.product_id === product_id ? { ...it, qty: q } : it,
        ),
      );
    }

    function removeItem(product_id: number) {
      setItems((prev) => prev.filter((it) => it.product_id !== product_id));
    }

    function clear() {
      setItems([]);
    }

    return { items, itemsCount, subtotal, addItem, setQty, removeItem, clear };
  }, [items]);

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
