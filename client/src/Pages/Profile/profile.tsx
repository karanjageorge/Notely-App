/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import PageShell from "../../layouts/pageshell";
import api from "../../lib/axiosAPI";
import { useAuthStore } from "../../lib/store";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/profile");
        setProfile(res.data.userProf ?? res.data);
      } catch {
        toast.error("Failed to load profile");
      }
    })();
  }, []);

  return (
    <PageShell>
      <div className="flex items-center gap-4 mb-6">
        {profile?.avatar ? (
          <img
            src={profile.avatar}
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-slate-300 flex items-center justify-center text-xl">
            {profile?.firstName?.[0] ?? user?.username?.[0] ?? "U"}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-semibold">
            {profile?.firstName} {profile?.lastName}
          </h1>
          <p className="text-slate-600">
            {profile?.username} • {profile?.email}
          </p>
        </div>
      </div>

      <div className="max-w-xl bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Details</h2>

        <p>
          <strong>First Name:</strong> {profile?.firstName}
        </p>
        <p>
          <strong>Last Name:</strong> {profile?.lastName}
        </p>
        <p>
          <strong>Username:</strong> {profile?.username}
        </p>
        <p>
          <strong>Email:</strong> {profile?.email}
        </p>

        <Link
          to="/profile/edit"
          className="inline-block mt-4 bg-slate-900 text-white px-4 py-2 rounded"
        >
          Edit Profile
        </Link>
      </div>
    </PageShell>
  );
}
