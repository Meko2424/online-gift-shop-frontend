export type ProductType = "simple" | "bundle";
export type FulfillmentType = "STOCKED" | "MADE_TO_ORDER" | "DIGITAL";

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

export type OrderItemOut = {
  id: number;
  product_id: number;
  qty: number;
  unit_price: number;

  cogs_unit_cost: number | null;
  cogs_total: number | null;

  product_type: ProductType;
  fulfillment_type: FulfillmentType;

  delivery_date: string | null;
};

export type OrderOut = {
  id: number;
  status: "PENDING" | "PAID" | "FULFILLING" | "COMPLETED" | "CANCELLED";
  warehouse_id: number | null;
  customer_name: string;
  customer_phone: string;
  total_amount: number;
  created_at: string;
  gift_message: string | null;
  items: OrderItemOut[];
};
