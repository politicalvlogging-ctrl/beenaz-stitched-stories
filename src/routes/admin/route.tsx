import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LayoutDashboard, Package, Tag, ShoppingCart, Settings, LogOut, Loader2, Menu, X } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin — Beenaz Fashion House" }],
  }),
});

type State = "loading" | "unauth" | "not-admin" | "ok";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const navigate = useNavigate();
  const [state, setState] = useState<State>("loading");
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (!cancelled) setState("unauth");
        return;
      }
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (cancelled) return;
      setState(roles ? "ok" : "not-admin");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state === "unauth") navigate({ to: "/auth" });
  }, [state, navigate]);

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  };

  if (state === "loading" || state === "unauth") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (state === "not-admin") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl font-semibold text-foreground">Access denied</h1>
          <p className="mt-2 text-muted-foreground">This account does not have admin access.</p>
          <button onClick={signOut} className="btn-brand mt-6">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card px-4 py-3 md:hidden">
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          className="rounded-md border border-border p-2 text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate font-display text-lg font-semibold leading-none text-foreground">Beenaz</p>
          <p className="mt-1 truncate text-[10px] uppercase tracking-widest text-muted-foreground">Fashion House</p>
        </div>
        <button
          onClick={signOut}
          aria-label="Sign out"
          className="shrink-0 rounded-md border border-border p-2 text-muted-foreground"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[85%] overflow-y-auto bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <p className="font-display text-lg font-semibold text-foreground">Menu</p>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="rounded-md p-2 text-muted-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <NavList pathname={pathname} onSignOut={signOut} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:block">
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="h-8 w-8 shrink-0 rounded-full bg-primary" />
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold leading-none text-foreground">Beenaz</p>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Fashion House</p>
            </div>
          </div>
          <NavList pathname={pathname} onSignOut={signOut} />
        </aside>
        <main className="min-w-0 flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NavList({ pathname, onSignOut }: { pathname: string; onSignOut: () => void }) {
  return (
    <nav className="p-4">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Admin</p>
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-foreground text-background" : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 border-t border-border pt-4">
        <button
          onClick={onSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </nav>
  );
}
