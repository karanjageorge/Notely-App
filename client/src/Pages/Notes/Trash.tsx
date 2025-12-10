/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/dashboard";
import api from "../../lib/axiosAPI";
import { toast } from "sonner";

export default function Trash() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrash = async () => {
    try {
      const res = await api.get("/profile/trash");
      setNotes(res.data.entries ?? []);
    } catch {
      toast.error("Failed to load trash");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  const restore = async (id: string) => {
    try {
      await api.patch(`/entries/restore/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Note restored");
    } catch {
      toast.error("Restore failed");
    }
  };

  const hardDelete = async (id: string) => {
    try {
      await api.delete(`/entries/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Note permanently deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-4">Trash</h1>

      {loading && <div>Loading...</div>}

      {!loading && notes.length === 0 && (
        <p className="text-slate-600">Nothing to show</p>
      )}

      {notes.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((n) => (
            <article key={n.id} className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">{n.title}</h3>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                {n.synopsis}
              </p>

              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => restore(n.id)}
                  className="text-blue-600 hover:underline"
                >
                  Restore
                </button>
                <button
                  onClick={() => hardDelete(n.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete Permanently
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
