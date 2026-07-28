import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground sm:text-base">Store information.</p>

      <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2">

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Account</h2>
          <p className="mt-3 text-sm text-muted-foreground">Signed in as</p>
          <p className="text-foreground">{email ?? "—"}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-xl font-semibold text-foreground">Store</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-muted-foreground">Name</dt>
              <dd className="text-foreground">Beenaz Fashion House</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Address</dt>
              <dd className="text-foreground">SQ 99 Mall & Apartments, Shop 106, First Floor, Bahria Town, Lahore 54000</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="text-foreground">0308 6844441 · 0324 4311936</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
