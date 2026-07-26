import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Phone, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  head: () => ({
    meta: [
      { title: "Product — Beenaz Fashion House" },
      { name: "description", content: "Premium stitched women's clothing by Beenaz Fashion House, Lahore." },
      { property: "og:title", content: "Product — Beenaz Fashion House" },
      { property: "og:description", content: "Premium stitched women's clothing by Beenaz Fashion House, Lahore." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  in_stock: boolean;
  category_id: string | null;
};

const SIZES = ["S", "M", "L", "XL"];

function ProductPage() {
  const { id } = Route.useParams();
  const { add } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [categorySlug, setCategorySlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("id, name, description, price, image_url, in_stock, category_id")
        .eq("id", id)
        .maybeSingle();
      if (cancelled) return;
      setProduct(data ?? null);
      if (data?.category_id) {
        const { data: cat } = await supabase
          .from("categories")
          .select("slug")
          .eq("id", data.category_id)
          .maybeSingle();
        if (!cancelled) setCategorySlug(cat?.slug ?? null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const addToCart = () => {
    if (!product) return;
    add(
      {
        id: product.id,
        name: `${product.name} (Size ${size})`,
        price: Number(product.price),
        image_url: product.image_url,
      },
      qty,
    );
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-24 pb-20">
        <div className="container-tight">
          {categorySlug ? (
            <Link
              to="/category/$slug"
              params={{ slug: categorySlug }}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to collection
            </Link>
          ) : (
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>
          )}

          {loading ? (
            <p className="mt-20 text-center text-muted-foreground">Loading product…</p>
          ) : !product ? (
            <p className="mt-20 text-center text-muted-foreground">This product is no longer available.</p>
          ) : (
            <div className="mt-8 grid gap-12 lg:grid-cols-2">
              <div className="overflow-hidden rounded-2xl bg-blush/40 shadow-sm">
                <div className="aspect-[3/4]">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      loading="eager"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h1 className="font-display text-4xl font-semibold text-foreground sm:text-5xl">{product.name}</h1>
                <p className="mt-4 font-display text-3xl font-semibold text-lavender-deep">
                  Rs. {Number(product.price).toLocaleString()}
                </p>
                <p className="mt-2 text-sm">
                  {product.in_stock ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <Check className="h-4 w-4" /> In stock
                    </span>
                  ) : (
                    <span className="text-muted-foreground">Currently out of stock</span>
                  )}
                </p>

                {product.description && (
                  <p className="mt-6 text-base leading-relaxed text-muted-foreground">{product.description}</p>
                )}

                <div className="mt-8">
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Size</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`h-11 w-14 rounded-xl border text-sm font-medium transition-colors ${
                          size === s
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:bg-blush/30"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Quantity</p>
                  <div className="mt-3 inline-flex items-center rounded-xl border border-border bg-card">
                    <button
                      type="button"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      className="h-11 w-11 text-lg text-foreground"
                    >
                      −
                    </button>
                    <span className="w-10 text-center text-base font-medium text-foreground">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty((q) => q + 1)}
                      className="h-11 w-11 text-lg text-foreground"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={!product.in_stock}
                    onClick={addToCart}
                    className="btn-outline disabled:opacity-50"
                  >
                    <ShoppingBag className="h-4 w-4" /> Add to Cart
                  </button>
                  <button
                    type="button"
                    disabled={!product.in_stock}
                    onClick={() => {
                      addToCart();
                      navigate({ to: "/checkout" });
                    }}
                    className="btn-brand disabled:opacity-50"
                  >
                    Order Now
                  </button>
                  <a href="tel:03086844441" className="btn-outline">
                    <Phone className="h-4 w-4" /> Call to ask
                  </a>
                </div>

                <div className="mt-10 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                  <p className="font-display text-lg font-semibold text-foreground">Order details</p>
                  <p className="mt-2">Cash on delivery across Pakistan. Free stitching consultation in store.</p>
                  <p className="mt-1">SQ 99 Mall &amp; Apartments, Shop 106, Bahria Town, Lahore.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
