import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      <AdminNavbar />
      <main className="pt-24">{children}</main>
    </div>
  );
}
