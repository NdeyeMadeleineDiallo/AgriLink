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
    <main className="min-h-screen w-full overflow-x-hidden bg-[#F8FAFC]">
      <AdminSidebar />

      <section className="min-h-screen min-w-0 w-full lg:pl-72">
        <AdminTopbar user={user} />

        <div className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-7">
          <div className="w-full min-w-0">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}