/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/notes/AllNotes.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/dashboard";
import api from "../../lib/axiosAPI";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function AllNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/entries/all");
      const data = res.data ?? [];
      setNotes(Array.isArray(data) ? data : []);
    } catch {
      toast.error("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.patch(`/entries/trash/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Moved to trash");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">All Notes</h1>
        <Link
          to="/notes/create"
          className="inline-block bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-700"
        >
          New Note
        </Link>
      </div>

      {loading && <div>Loading...</div>}

      {!loading && notes.length === 0 && (
        <p className="text-center text-slate-600 mt-8">
          You don’t have any notes yet.
        </p>
      )}

      {notes.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((n) => (
            <div
              key={n.id}
              className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-semibold text-lg">{n.title}</h3>
              <p className="text-sm text-slate-600 mt-1 line-clamp-3">
                {n.synopsis}
              </p>

              <div className="mt-3 flex gap-4">
                <Link
                  to={`/notes/view/${n.id}`}
                  className="text-blue-600 text-sm"
                >
                  Read More
                </Link>
                <Link to={`/notes/edit/${n.id}`} className="text-sm">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                <div>Created: {new Date(n.dateCreated).toLocaleString()}</div>
                {n.lastUpdated && (
                  <div>Updated: {new Date(n.lastUpdated).toLocaleString()}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
