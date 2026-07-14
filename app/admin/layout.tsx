import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#080808] min-h-screen text-white">
      <AdminNavbar />
      <main className="pt-24">{children}</main>
    </div>
  );
}
