import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

type Category = { id: string; name: string; slug: string };

function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCats((data ?? []) as Category[]);
  };

  useEffect(() => {
    load();
  }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase.from("categories").insert({ name: name.trim(), slug });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Category added");
    setName("");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="p-8 lg:p-12">
      <h1 className="font-display text-4xl font-semibold text-foreground">Categories</h1>
      <p className="mt-2 text-muted-foreground">Organize your products.</p>

      <form onSubmit={add} className="mt-8 flex gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded-md border border-input bg-card px-3 py-2.5 text-sm focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/30"
        />
        <button disabled={saving} className="btn-brand">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {cats.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-muted-foreground">
                  No categories yet.
                </td>
              </tr>
            )}
            {cats.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-6 py-3 font-medium text-foreground">{c.name}</td>
                <td className="px-6 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-6 py-3 text-right">
                  <button
                    onClick={() => remove(c.id)}
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
