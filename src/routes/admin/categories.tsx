import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

type Category = { id: string; name: string; slug: string; image_url: string | null };

async function uploadImage(file: File) {
  const { data: sess } = await supabase.auth.getSession();
  if (!sess.session) throw new Error("Please sign in again to upload");
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${sess.session.user.id}/cat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (upErr) throw upErr;
  const { data: signed, error: signErr } = await supabase.storage
    .from("product-images")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (signErr) throw signErr;
  return signed.signedUrl;
}

function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [rowUploading, setRowUploading] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const rowFileRef = useRef<HTMLInputElement>(null);
  const rowTarget = useRef<string | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug, image_url")
      .order("name");
    setCats((data ?? []) as Category[]);
  };

  useEffect(() => {
    load();
  }, []);

  const onNewFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      setImageUrl(await uploadImage(file));
      toast.success("Image uploaded");
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onRowFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const id = rowTarget.current;
    e.target.value = "";
    if (!file || !id) return;
    setRowUploading(id);
    try {
      const url = await uploadImage(file);
      const { error } = await supabase.from("categories").update({ image_url: url }).eq("id", id);
      if (error) throw error;
      toast.success("Category image updated");
      load();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setRowUploading(null);
      rowTarget.current = null;
    }
  };

  const clearRowImage = async (id: string) => {
    const { error } = await supabase.from("categories").update({ image_url: null }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error } = await supabase
      .from("categories")
      .insert({ name: name.trim(), slug, image_url: imageUrl.trim() || null });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Category added");
    setName("");
    setImageUrl("");
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
      <p className="mt-2 text-muted-foreground">Organize your products and set a cover photo.</p>

      <form onSubmit={add} className="mt-8 rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New category name"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/30"
          />
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL (optional)"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:border-lavender focus:outline-none focus:ring-2 focus:ring-lavender/30"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*,.jfif"
            className="hidden"
            onChange={onNewFile}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-outline text-sm py-2 px-4"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Upload image"}
          </button>
          {imageUrl && (
            <span className="relative inline-block">
              <img src={imageUrl} alt="Category preview" className="h-16 w-16 rounded-md object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl("")}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button disabled={saving} className="btn-brand ml-auto">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </form>

      <input ref={rowFileRef} type="file" accept="image/*,.jfif" className="hidden" onChange={onRowFile} />

      <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Slug</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {cats.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  No categories yet.
                </td>
              </tr>
            )}
            {cats.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="px-6 py-3">
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} className="h-14 w-14 rounded-md object-cover" />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <ImagePlus className="h-4 w-4" />
                    </div>
                  )}
                </td>
                <td className="px-6 py-3 font-medium text-foreground">{c.name}</td>
                <td className="px-6 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-6 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        rowTarget.current = c.id;
                        rowFileRef.current?.click();
                      }}
                      disabled={rowUploading === c.id}
                      className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground hover:bg-blush/30"
                    >
                      {rowUploading === c.id ? "Uploading…" : c.image_url ? "Change photo" : "Add photo"}
                    </button>
                    {c.image_url && (
                      <button
                        onClick={() => clearRowImage(c.id)}
                        className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-destructive"
                      >
                        Remove photo
                      </button>
                    )}
                    <button
                      onClick={() => remove(c.id)}
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
    </div>
  );
}
