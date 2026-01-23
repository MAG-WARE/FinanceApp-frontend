"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:pl-64 pt-16 lg:pt-0">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
