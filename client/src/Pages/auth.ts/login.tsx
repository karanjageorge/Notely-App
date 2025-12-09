/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import api from "../../lib/axiosAPI";
import { toast } from "sonner";
import { useAuthStore } from "../../lib/store";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      toast.success("Logged in!");

      setToken(res.data.token);

      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* NAVBAR */}
      <div className="w-full bg-white shadow px-6 py-4">
        <Link to="/" className="text-2xl font-bold hover:opacity-80 transition">
          Notely
        </Link>
      </div>

      {/* LOGIN CARD */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Login to Notely</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Email or Username"
                type="email"
                value={form.identifier}
                onChange={(e) =>
                  setForm({ ...form, identifier: e.target.value })
                }
                required
              />

              <Input
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

              <Button className="w-full bg-slate-900 hover:bg-slate-700">
                Login
              </Button>

              <p className="text-sm text-center text-slate-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-slate-900 hover:underline">
                  Register
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
