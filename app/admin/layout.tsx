import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 min-h-screen text-white">
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}
