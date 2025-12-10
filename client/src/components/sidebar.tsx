// src/components/AppSidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "../components/ui/sidebar";

import {
  FileText,
  PlusSquare,
  Trash2,
  User2,
  ChevronUp,
  NotebookPen,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { useAuthStore } from "../lib/store";
import api from "../lib/axiosAPI";
import { toast } from "sonner";

export function AppSidebar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  // menu items — simple array of items
  const items = [
    { title: "My Notes", url: "/dashboard", icon: FileText },
    { title: "New Note", url: "/createnote", icon: PlusSquare },
    { title: "Trash", url: "/trash", icon: Trash2 },
  ];

  // username fallback safely
  const username =
    (typeof user === "object" &&
      user !== null &&
      (user.username || user.firstName || user.email)) ||
    (() => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        const u = JSON.parse(raw);
        return u?.username || u?.firstName || u?.email || null;
      } catch {
        return null;
      }
    })() ||
    "User";

  const avatar =
    (user && user.avatar) ||
    (() => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) return null;
        const u = JSON.parse(raw);
        return u?.avatar ?? null;
      } catch {
        return null;
      }
    })();

  const handleSignOut = async () => {
    try {
      // call backend logout (clears cookie server-side if implemented)
      await api.post("/auth/logout");
    } catch {
      // continue — even if backend logout fails, clear local state
    } finally {
      logout();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      toast.success("Signed out");
      navigate("/");
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3 font-bold text-lg">
          <NotebookPen className="w-5 h-5" />
          <span>Notely</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <User2 className="w-4 h-4" />
                  )}

                  <span className="truncate max-w-[8rem] ml-2">{username}</span>
                  <ChevronUp className="ml-auto w-4 h-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600"
                >
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
