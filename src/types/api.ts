export type ProductType = "simple" | "bundle";

export type ProductListOut = {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_at_price?: number | null;
  type: ProductType;
  is_best_seller: boolean;
  is_new: boolean;
  is_trending: boolean;
  image_url?: string | null;
};

export type BundleComponentOut = {
  sku: string;
  name: string;
  qty: number;
};

export type ProductDetailOut = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  compare_at_price?: number | null;
  type: ProductType;
  image_url?: string | null;
  components?: BundleComponentOut[] | null;
};
