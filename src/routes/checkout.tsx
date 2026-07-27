import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({
    meta: [
      { title: "Checkout — Beenaz Fashion House" },
      { name: "description", content: "Complete your order with Beenaz Fashion House. Cash on delivery across Pakistan." },
      { property: "og:title", content: "Checkout — Beenaz Fashion House" },
      { property: "og:description", content: "Complete your order with Beenaz Fashion House. Cash on delivery across Pakistan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function CheckoutPage() {
  const { items, total, setQty, remove, clear } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("Your cart is empty");
    const name = form.name.trim();
    const phone = form.phone.trim();
    if (name.length < 2 || name.length > 100) return toast.error("Please enter your full name (2-100 characters)");
    if (!/^[0-9+()\-\s]{7,20}$/.test(phone)) return toast.error("Please enter a valid phone number");
    if (form.address.trim().length > 500) return toast.error("Address is too long (max 500 characters)");
    if (form.notes.trim().length > 1000) return toast.error("Notes are too long (max 1000 characters)");



    setSubmitting(true);
    const rows = items.map((i) => ({
      customer_name: name,
      phone,
      address: form.address.trim() || null,
      product_id: i.id.split("|")[0],
      product_name: `${i.name} × ${i.qty}`.slice(0, 200),
      total: Number(i.price) * i.qty,
      status: "pending",
      notes: form.notes.trim() || null,
    }));

    const { error } = await supabase.from("orders").insert(rows);
    setSubmitting(false);
    if (error) return toast.error(error.message);

    clear();
    setDone(true);
    toast.success("Order placed! We will call you shortly.");
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="pt-24 pb-20">
        <div className="container-tight">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Continue shopping
          </Link>

          <h1 className="mt-6 font-display text-4xl font-semibold text-foreground sm:text-5xl">Checkout</h1>

          {done ? (
            <div className="mt-12 rounded-2xl border border-border bg-card p-12 text-center">
              <p className="font-display text-3xl text-foreground">Thank you!</p>
              <p className="mt-3 text-muted-foreground">
                Your order has been received. Our team will call you to confirm the details.
              </p>
              <button type="button" onClick={() => navigate({ to: "/" })} className="btn-brand mt-8">
                Back to home
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-muted-foreground" />
              <p className="mt-4 font-display text-2xl text-foreground">Your cart is empty</p>
              <p className="mt-2 text-muted-foreground">Browse our collections and add pieces you love.</p>
              <Link to="/" className="btn-brand mt-6 inline-flex">
                Explore collections
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
              {/* Items */}
              <div className="space-y-4">
                {items.map((i) => (
                  <div key={i.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
                    <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-blush/40">
                      {i.image_url && (
                        <img src={i.image_url} alt={i.name} className="h-full w-full object-cover" loading="lazy" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-display text-lg font-semibold text-foreground">{i.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Rs. {Number(i.price).toLocaleString()} each
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <div className="inline-flex items-center rounded-lg border border-border">
                          <button
                            type="button"
                            onClick={() => setQty(i.id, i.qty - 1)}
                            className="h-9 w-9 text-foreground"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-sm text-foreground">{i.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(i.id, i.qty + 1)}
                            className="h-9 w-9 text-foreground"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(i.id)}
                          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" /> Remove
                        </button>
                      </div>
                    </div>
                    <p className="font-display text-lg font-semibold text-foreground">
                      Rs. {(Number(i.price) * i.qty).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6">
                <p className="font-display text-2xl font-semibold text-foreground">Delivery details</p>
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground" htmlFor="name">
                      Full name *
                    </label>
                    <input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground" htmlFor="phone">
                      Phone *
                    </label>
                    <input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground" htmlFor="address">
                      Delivery address
                    </label>
                    <textarea
                      id="address"
                      rows={3}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground" htmlFor="notes">
                      Notes (size, colour, instructions)
                    </label>
                    <textarea
                      id="notes"
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mt-6 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Payment</span>
                    <span>Cash on delivery</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="font-display text-xl text-foreground">Total</span>
                    <span className="font-display text-2xl font-semibold text-foreground">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button type="submit" disabled={submitting} className="btn-brand mt-6 w-full justify-center">
                  {submitting ? "Placing order…" : "Place Order"}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
