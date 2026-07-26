import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Phone, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/category/$slug")({
  component: CategoryPage,
  head: ({ params }) => {
    const title = params.slug
      .split("-")
      .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
      .join(" ");
    return {
      meta: [
        { title: `${title} — Beenaz Fashion House` },
        { name: "description", content: `Shop the ${title} collection at Beenaz Fashion House, Lahore.` },
        { property: "og:title", content: `${title} — Beenaz Fashion House` },
        { property: "og:description", content: `Shop the ${title} collection at Beenaz Fashion House, Lahore.` },
        { property: "og:type", content: "website" },
      ],
    };
  },
});

type Category = { id: string; name: string; slug: string };
type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  in_stock: boolean;
};

function CategoryPage() {
  const { slug } = Route.useParams();
  const { add } = useCart();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setMissing(false);
      const { data: cat } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("slug", slug)
        .maybeSingle();
      if (cancelled) return;
      if (!cat) {
        setMissing(true);
        setLoading(false);
        return;
      }
      setCategory(cat);
      const { data: prods } = await supabase
        .from("products")
        .select("id, name, description, price, image_url, in_stock")
        .eq("category_id", cat.id)
        .order("created_at", { ascending: false });
      if (cancelled) return;
      setProducts(prods ?? []);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const addToCart = (p: Product) => {
    add({ id: p.id, name: p.name, price: Number(p.price), image_url: p.image_url });
    toast.success(`${p.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-24 pb-20">
        <div className="container-tight">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <div className="mt-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-lavender-deep">Collection</p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-foreground sm:text-5xl">
              {category?.name ?? (missing ? "Not found" : "Loading…")}
            </h1>
          </div>

          {loading ? (
            <p className="mt-16 text-center text-muted-foreground">Loading products…</p>
          ) : missing ? (
            <p className="mt-16 text-center text-muted-foreground">This collection does not exist.</p>
          ) : products.length === 0 ? (
            <div className="mt-16 rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
              <p className="font-display text-2xl text-foreground">No products yet</p>
              <p className="mt-2 text-muted-foreground">
                New pieces for this collection are coming soon. Call us to check what's in store.
              </p>
              <a href="tel:03086844441" className="btn-brand mt-6 inline-flex">
                <Phone className="h-4 w-4" /> 0308 6844441
              </a>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-lg"
                >
                  <Link to="/product/$id" params={{ id: p.id }} className="block">
                    <div className="aspect-[3/4] overflow-hidden bg-blush/40">
                      {p.image_url ? (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col p-6">
                    <Link to="/product/$id" params={{ id: p.id }}>
                      <h2 className="font-display text-xl font-semibold text-foreground hover:text-lavender-deep">
                        {p.name}
                      </h2>
                    </Link>
                    {p.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {p.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-display text-lg font-semibold text-foreground">
                        Rs. {Number(p.price).toLocaleString()}
                      </p>
                      {!p.in_stock && (
                        <span className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                          Out of stock
                        </span>
                      )}
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={!p.in_stock}
                        onClick={() => addToCart(p)}
                        className="btn-outline flex-1 justify-center text-sm disabled:opacity-50"
                      >
                        <ShoppingBag className="h-4 w-4" /> Add to Cart
                      </button>
                      <Link
                        to="/checkout"
                        onClick={() => p.in_stock && addToCart(p)}
                        disabled={!p.in_stock}
                        className="btn-brand flex-1 justify-center text-sm"
                      >
                        Order Now
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
