/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import PageShell from "../../layouts/pageshell";
import api from "../../lib/axiosAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !synopsis.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/entries", { title, synopsis, content });
      toast.success("Note created successfully");
      nav("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Creation failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="w-full flex justify-center mt-6">
        <div className="w-full max-w-xl bg-white rounded-xl shadow p-6 space-y-6">
          <h1 className="text-xl font-semibold text-center">Create New Note</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Synopsis</label>
              <Input
                value={synopsis}
                onChange={(e) => setSynopsis(e.target.value)}
                placeholder="Short overview"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Content (Markdown)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your full note here..."
                className="w-full min-h-[180px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
            </div>

            <div className="pt-2 flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => nav(-1)}>
                Cancel
              </Button>

              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Note"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  );
}
