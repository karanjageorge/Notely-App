/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/dashboard";
import api from "../../lib/axiosAPI";
import { useAuthStore } from "../../lib/store";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const userFromStore = useAuthStore((s) => s.user);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // helper to resolve username safely (fall back to localStorage user if needed)
  const username =
    userFromStore?.username ||
    userFromStore?.firstName ||
    (() => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        const u = JSON.parse(raw);
        return u?.username || u?.firstName || null;
      } catch {
        return null;
      }
    })() ||
    "User";

  useEffect(() => {
    // do not make the outer callback async — use an inner async fn
    const load = async () => {
      try {
        const res = await api.get("/profile/entries");
        // backend may return { message, entries } or just entries array
        const entries = (res.data && (res.data.entries ?? res.data)) ?? [];
        setNotes(Array.isArray(entries) ? entries : []);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setNotes([]);
        } else {
          toast.error("Failed to load your notes");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.patch(`/entries/trash/${id}`);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      toast.success("Note moved to trash");
    } catch {
      toast.error("Failed to delete note");
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold mb-6">Hello, {username} 👋</h1>

      {loading && <p>Loading your notes...</p>}

      {!loading && notes.length === 0 && (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <p className="text-slate-600 text-lg mb-4">
            You don’t have any notes yet.
          </p>

          <Link
            to="/createnote"
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded hover:bg-slate-700 transition"
          >
            <PlusCircle className="w-5 h-5" />
            Add Note
          </Link>
        </div>
      )}

      {!loading && notes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note: any) => (
            <article
              key={note.id}
              className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-200"
            >
              <h3 className="font-semibold text-lg">{note.title}</h3>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3">
                {note.synopsis}
              </p>

              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex gap-4">
                  <Link
                    to={`/viewnote/${note.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                  <Link
                    to={`/editnote/${note.id}`}
                    className="text-slate-700 hover:underline"
                  >
                    Edit
                  </Link>
                </div>

                <button
                  onClick={() => handleDelete(note.id)}
                  className="text-red-600 hover:text-red-800 flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              <div className="mt-3 text-xs text-slate-500">
                <div>
                  Created: {new Date(note.dateCreated).toLocaleString()}
                </div>
                {note.lastUpdated && (
                  <div>
                    Updated: {new Date(note.lastUpdated).toLocaleString()}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
