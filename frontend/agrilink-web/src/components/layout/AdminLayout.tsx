"use client";

import AdminSidebar from "@/src/components/layout/AdminSidebar";
import AdminTopbar from "@/src/components/layout/AdminTopbar";

export default function AdminLayout({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#F8FAFC] lg:flex">
      <AdminSidebar />

      <section className="flex-1">
        <AdminTopbar user={user} />

        <div className="p-6">
          {children}
        </div>
      </section>
    </main>
  );
}