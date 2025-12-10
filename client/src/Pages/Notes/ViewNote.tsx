/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import PageShell from "../../layouts/pageshell";
import api from "../../lib/axiosAPI";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

export default function ViewNote() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [note, setNote] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // outer callback is NOT async to avoid returning a Promise
    if (!id) {
      nav("/dashboard");
      return;
    }

    const load = async () => {
      try {
        const res = await api.get(`/entries/${id}`);
        setNote(res.data);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Note not found");
        nav("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await api.patch(`/entries/trash/${id}`);
      toast.success("Moved to trash");
      nav("/dashboard");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <PageShell>
      {loading ? (
        <div>Loading...</div>
      ) : (
        note && (
          <div className="w-full max-w-3xl mx-auto">
            <article className="bg-white rounded-xl shadow p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold">{note.title}</h1>
                  <p className="text-slate-600 mt-1">{note.synopsis}</p>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/editnote/${note.id}`}
                    className="px-3 py-1 rounded hover:bg-slate-100 text-blue-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 rounded hover:bg-slate-100 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <hr className="my-4" />

              <div className="prose max-w-none">
                <ReactMarkdown>{note.content}</ReactMarkdown>
              </div>

              <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <div>
                    Created: {new Date(note.dateCreated).toLocaleString()}
                  </div>
                  {note.lastUpdated && (
                    <div>
                      Last updated:{" "}
                      {new Date(note.lastUpdated).toLocaleString()}
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={() => nav("/dashboard")}
                    className="text-sm px-3 py-1 rounded hover:bg-slate-100"
                  >
                    ← Back to dashboard
                  </button>
                </div>
              </div>
            </article>
          </div>
        )
      )}
    </PageShell>
  );
}
