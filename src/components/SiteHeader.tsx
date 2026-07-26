import { Link } from "@tanstack/react-router";
import { Phone, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

export function SiteHeader() {
  const { count } = useCart();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link to="/" className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight text-foreground">Beenaz</span>
          <span className="hidden text-xs uppercase tracking-widest text-muted-foreground sm:inline">
            Fashion House
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            to="/checkout"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-blush/30"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </Link>
          <a href="tel:03086844441" className="btn-brand text-sm py-2 px-4">
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Call Now</span>
          </a>
        </div>
      </div>
    </header>
  );
}
