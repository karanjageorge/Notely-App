/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import PageShell from "../../layouts/pageshell";
import api from "../../lib/axiosAPI";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "../../components/ui/tabs";
import { useAuthStore } from "../../lib/store";

export default function EditProfile() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    avatar: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Load profile
  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/profile");
        const p = res.data.userProf ?? res.data;

        setForm({
          firstName: p.firstName || "",
          lastName: p.lastName || "",
          username: p.username || "",
          email: p.email || "",
          avatar: p.avatar || "",
        });

        setAvatarPreview(p.avatar || "");
      } catch (err: any) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Handle avatar input + preview
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Save personal info
  const handleAccountSave = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const fd = new FormData();
      fd.append("firstName", form.firstName);
      fd.append("lastName", form.lastName);
      fd.append("username", form.username);
      fd.append("email", form.email);

      if (avatarFile) {
        fd.append("file", avatarFile);
      }

      const res = await api.patch("/profile/update", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = res.data.profUpdate ?? res.data;

      // persist
      localStorage.setItem("user", JSON.stringify(updated));
      useAuthStore.setState({ user: updated });

      toast.success("Profile updated");
      nav("/profile");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Update failed");
    }
  };

  // Save password
  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error("All password fields are required");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await api.patch("/profile/password", {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });

      toast.success("Password updated — please sign in again");

      useAuthStore.getState().logout();
      nav("/login");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Password update failed");
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Edit Profile</h1>

        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          {/* ACCOUNT TAB */}
          <TabsContent value="account">
            <form onSubmit={handleAccountSave}>
              <Card>
                <CardHeader>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>
                    Update your personal information. Avatar, name, username,
                    email.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                  {/* Avatar + preview */}
                  <div className="flex flex-col items-center gap-4">
                    <img
                      src={
                        avatarPreview ||
                        "https://ui-avatars.com/api/?name=User&background=ddd"
                      }
                      className="w-24 h-24 rounded-full object-cover border"
                    />

                    <div className="w-full">
                      <Label>Change Avatar</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>

                  {/* Form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label>First name</Label>
                      <Input
                        value={form.firstName}
                        onChange={(e) =>
                          setForm({ ...form, firstName: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Last name</Label>
                      <Input
                        value={form.lastName}
                        onChange={(e) =>
                          setForm({ ...form, lastName: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Username</Label>
                      <Input
                        value={form.username}
                        onChange={(e) =>
                          setForm({ ...form, username: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => nav(-1)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save changes</Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          {/* PASSWORD TAB */}
          <TabsContent value="password">
            <form onSubmit={handlePasswordSave}>
              <Card>
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password securely.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-4">
                  <div>
                    <Label>Current password</Label>
                    <Input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>New password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label>Confirm new password</Label>
                    <Input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmNewPassword("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save password</Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
