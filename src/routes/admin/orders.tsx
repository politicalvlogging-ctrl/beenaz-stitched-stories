import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
});

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  address: string | null;
  product_name: string | null;
  total: number;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = async () => {
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data ?? []) as Order[]);
  };

  useEffect(() => {
    load();
  }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status updated");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Orders</h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">Track and update customer orders.</p>

      {/* Mobile cards */}
      <div className="mt-6 space-y-3 md:hidden">
        {orders.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
            No orders yet.
          </div>
        )}
        {orders.map((o) => (
          <div key={o.id} className="rounded-xl border border-border bg-card p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{o.customer_name}</p>
                <a href={`tel:${o.phone}`} className="text-sm text-lavender-deep underline">{o.phone}</a>
                {o.address && <p className="mt-1 text-xs text-muted-foreground">{o.address}</p>}
              </div>
              <button
                onClick={() => remove(o.id)}
                className="shrink-0 rounded-md p-2 text-muted-foreground"
                aria-label="Delete order"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 space-y-1 text-sm">
              <p className="text-muted-foreground">
                Product: <span className="text-foreground">{o.product_name ?? "—"}</span>
              </p>
              <p className="text-muted-foreground">
                Total: <span className="text-foreground">Rs. {Number(o.total).toLocaleString()}</span>
              </p>
              <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleString()}</p>
            </div>
            <select
              value={o.status}
              onChange={(e) => setStatus(o.id, e.target.value)}
              className="mt-3 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="mt-8 hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Product</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-muted-foreground">
                  No orders yet.
                </td>
              </tr>
            )}
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-border align-top">
                <td className="px-6 py-3">
                  <p className="font-medium text-foreground">{o.customer_name}</p>
                  {o.address && <p className="mt-1 text-xs text-muted-foreground">{o.address}</p>}
                </td>
                <td className="px-6 py-3">{o.phone}</td>
                <td className="px-6 py-3">{o.product_name ?? "—"}</td>
                <td className="px-6 py-3">Rs. {Number(o.total).toLocaleString()}</td>
                <td className="px-6 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => setStatus(o.id, e.target.value)}
                    className="rounded-md border border-input bg-background px-2 py-1 text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-3 text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => remove(o.id)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
