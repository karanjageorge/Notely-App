/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import api from "../../lib/axiosAPI";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const checks = {
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    symbol: /[!@#$%^&*]/.test(form.password),
    length: form.password.length >= 8,
  };

  const allValid =
    checks.upper &&
    checks.lower &&
    checks.number &&
    checks.symbol &&
    checks.length;

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!allValid)
      return toast.error("Your password does not meet all requirements.");

    try {
      await api.post("/auth/register", form);
      toast.success("Registered Successfully!");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* HEADER */}
      <div className="w-full bg-white shadow px-6 py-3">
        <Link to="/" className="text-2xl font-bold hover:opacity-80 transition">
          Notely
        </Link>
      </div>

      {/* CONTENT */}
      <div className="flex items-center justify-center flex-grow px-4 py-4">
        <Card className="w-full max-w-lg shadow-lg hover:shadow-xl transition">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-2xl">
              Create an Account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              {/* First + Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Username */}
              <Input
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />

              {/* Email */}
              <Input
                placeholder="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              {/* PASSWORD */}
              <div className="relative">
                <Input
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  className={`${allValid ? "border-green-500" : ""}`}
                />

                {/* Show/Hide Icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Popup */}
              {form.password.length > 0 && !allValid && (
                <div className="mt-1 text-xs border p-2 rounded-lg transition-all duration-300 bg-red-50 border-red-300 text-red-700">
                  <p className="font-semibold">Password must include:</p>
                  <ul className="list-disc ml-4 space-y-0.5">
                    <li className={checks.length ? "text-green-600" : ""}>
                      ✔ At least 8 characters
                    </li>
                    <li className={checks.upper ? "text-green-600" : ""}>
                      ✔ Uppercase letter
                    </li>
                    <li className={checks.lower ? "text-green-600" : ""}>
                      ✔ Lowercase letter
                    </li>
                    <li className={checks.number ? "text-green-600" : ""}>
                      ✔ At least one number
                    </li>
                    <li className={checks.symbol ? "text-green-600" : ""}>
                      ✔ At least one symbol (!@#$%^&*)
                    </li>
                  </ul>
                </div>
              )}

              {/* Submit */}
              <Button className="w-full bg-slate-900 hover:bg-slate-700">
                Register
              </Button>

              {/* Link */}
              <p className="text-sm text-center text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-slate-900 font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
