/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageShell from "../../layouts/pageshell";
import api from "../../lib/axiosAPI";
import { toast } from "sonner";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function EditNote() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      nav("/dashboard");
      return;
    }

    const load = async () => {
      try {
        const res = await api.get(`/entries/${id}`);
        const note = res.data;
        setTitle(note.title || "");
        setSynopsis(note.synopsis || "");
        setContent(note.content || "");
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load note");
        nav("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSaving(true);
      await api.patch(`/entries/${id}`, { title, synopsis, content });
      toast.success("Note updated");
      nav(`/viewnote/${id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <PageShell>
        <div>Loading...</div>
      </PageShell>
    );

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Edit Note</h1>

        <form
          onSubmit={handleSave}
          className="space-y-4 bg-white p-6 rounded shadow"
        >
          <label className="block">
            <div className="text-sm font-medium mb-1">Title</div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium mb-1">Synopsis</div>
            <Input
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium mb-1">Content (Markdown)</div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full min-h-[220px] p-3 rounded border"
              required
            />
          </label>

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => nav(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-slate-900 hover:bg-slate-700"
            >
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
