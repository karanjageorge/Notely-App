// src/layouts/PageShell.tsx
import React from "react";
import { SidebarProvider } from "../components/ui/sidebar";
import AppSidebar from "../components/sidebar";

export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Left Sidebar */}
        <AppSidebar />

        {/* Main Content — takes full width, no blank nav bar */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
