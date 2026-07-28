import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

function DashboardPage() {
  const [stats, setStats] = useState({ orders: 0, pending: 0, products: 0, revenue: 0 });

  useEffect(() => {
    (async () => {
      const [orders, pending, products, revenueRes] = await Promise.all([
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("total"),
      ]);
      const revenue = (revenueRes.data ?? []).reduce((sum, o: { total: number }) => sum + Number(o.total || 0), 0);
      setStats({
        orders: orders.count ?? 0,
        pending: pending.count ?? 0,
        products: products.count ?? 0,
        revenue,
      });
    })();
  }, []);

  const cards = [
    { label: "Total Orders", value: stats.orders },
    { label: "Pending Orders", value: stats.pending },
    { label: "Products", value: stats.products },
    { label: "Revenue", value: `Rs. ${stats.revenue.toLocaleString()}` },
  ];

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">Overview of your store.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-4 lg:grid-cols-4">

        {cards.map((c) => (
          <div key={c.label} className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:text-xs">{c.label}</p>
            <p className="mt-3 break-words font-display text-2xl font-semibold text-foreground sm:mt-4 sm:text-4xl">{c.value}</p>
          </div>

        ))}
      </div>
    </div>
  );
}
