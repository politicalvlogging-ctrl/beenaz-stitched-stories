import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Upload, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});

type Category = { id: string; name: string };
type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: string | null;
  in_stock: boolean;
};

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const [p, c] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name").order("name"),
    ]);
    setProducts((p.data ?? []) as Product[]);
    setCategories((c.data ?? []) as Category[]);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Product deleted");
    load();
  };

  return (
    <div className="p-4 sm:p-8 lg:p-12">
      <div className="grid grid-cols-1 gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">Products</h1>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">Manage your product catalog.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="btn-brand w-full justify-center sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add product
        </button>
      </div>

      {/* Mobile cards */}
      <div className="mt-6 space-y-3 md:hidden">
        {products.length === 0 && (
          <div className="rounded-xl border border-border bg-card px-4 py-12 text-center text-sm text-muted-foreground">
            No products yet. Tap "Add product" to get started.
          </div>
        )}
        {products.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex gap-3">
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="h-16 w-16 shrink-0 rounded-md object-cover" />
              ) : (
                <div className="h-16 w-16 shrink-0 rounded-md bg-muted" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-foreground">{p.name}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {categories.find((c) => c.id === p.category_id)?.name ?? "—"}
                </p>
                <p className="mt-1 text-sm text-foreground">Rs. {Number(p.price).toLocaleString()}</p>
                <span
                  className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[11px] ${
                    p.in_stock ? "bg-lavender/20 text-lavender-deep" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {p.in_stock ? "In stock" : "Out"}
                </span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => {
                  setEditing(p);
                  setOpen(true);
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground"
              >
                <Pencil className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => remove(p.id)}
                className="flex items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground"
                aria-label="Delete product"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="mt-8 hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-muted-foreground">
                  No products yet. Click "Add product" to get started.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-6 py-3">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-12 w-12 rounded object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded bg-muted" />
                  )}
                </td>
                <td className="px-6 py-3 font-medium text-foreground">{p.name}</td>
                <td className="px-6 py-3 text-muted-foreground">
                  {categories.find((c) => c.id === p.category_id)?.name ?? "—"}
                </td>
                <td className="px-6 py-3">Rs. {Number(p.price).toLocaleString()}</td>
                <td className="px-6 py-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${p.in_stock ? "bg-lavender/20 text-lavender-deep" : "bg-muted text-muted-foreground"}`}>
                    {p.in_stock ? "In stock" : "Out"}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditing(p);
                        setOpen(true);
                      }}
                      className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <ProductDialog
          initial={editing}
          categories={categories}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function ProductDialog({
  initial,
  categories,
  onClose,
  onSaved,
}: {
  initial: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price != null ? String(initial.price) : "",
    image_url: initial?.image_url ?? "",
    category_id: initial?.category_id ?? "",
    in_stock: initial?.in_stock ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/") && !/\.(jpe?g|png|jfif|webp|gif|avif)$/i.test(file.name)) {
      return toast.error("Please select an image file");
    }
    setUploading(true);
    try {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        setUploading(false);
        return toast.error("Please sign in again to upload");
      }
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${sess.session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false, contentType: file.type || undefined });
      if (upErr) throw upErr;
      const { data: signed, error: signErr } = await supabase.storage
        .from("product-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signErr) throw signErr;
      setForm((f) => ({ ...f, image_url: signed.signedUrl }));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description || null,
      price: form.price === "" ? 0 : Number(form.price),
      image_url: form.image_url || null,
      category_id: form.category_id || null,
      in_stock: form.in_stock,
      updated_at: new Date().toISOString(),
    };
    const { error } = initial
      ? await supabase.from("products").update(payload).eq("id", initial.id)
      : await supabase.from("products").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(initial ? "Product updated" : "Product added");
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-4">
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-card p-5 shadow-xl sm:max-h-[90vh] sm:rounded-2xl sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="min-w-0 truncate font-display text-xl font-semibold text-foreground sm:text-2xl">
            {initial ? "Edit product" : "Add product"}
          </h2>
          <button onClick={onClose} className="shrink-0 rounded-md p-2 text-muted-foreground hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={save} className="mt-6 space-y-4">
          <Field label="Name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} />
          </Field>
          <Field label="Description">
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} />
          </Field>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Price (Rs.)">
              <input required type="text" inputMode="decimal" placeholder="e.g. 4500" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value.replace(/[^0-9.]/g, "") })} className={inputCls} />
            </Field>
            <Field label="Category">
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className={inputCls}>
                <option value="">— none —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Product image">
            <div className="mt-1 space-y-2">
              {form.image_url && (
                <div className="relative inline-block">
                  <img src={form.image_url} alt="preview" className="h-28 w-28 rounded-md object-cover border border-border" />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, image_url: "" })}
                    className="absolute -top-2 -right-2 rounded-full bg-background border border-border p-1 shadow"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.jfif"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFileUpload(f);
                  e.target.value = "";
                }}
              />
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploading ? "Uploading…" : form.image_url ? "Replace image" : "Upload image"}
                </button>
                <span className="text-xs text-muted-foreground">JPG, PNG, JFIF, WEBP</span>
              </div>
              <input
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className={inputCls}
                placeholder="…or paste an image URL"
              />
            </div>
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.in_stock} onChange={(e) => setForm({ ...form, in_stock: e.target.checked })} />
            In stock
          </label>
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-outline w-full justify-center sm:w-auto">Cancel</button>
            <button type="submit" disabled={saving} className="btn-brand w-full justify-center sm:w-auto">{saving ? "Saving…" : "Save"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputCls = "mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}
