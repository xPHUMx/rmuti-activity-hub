"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Users, 
  Newspaper, 
  CalendarRange, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X,
  User,
  QrCode,
  Sun,
  Moon
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const navigation = [
  { name: "หน้าหลัก", href: "/admin/dashboard", icon: Home },
  { name: "จัดการผู้ใช้", href: "/admin/users", icon: Users },
  { name: "แก้ไขข่าวสาร", href: "/admin/news", icon: Newspaper },
  { name: "แก้ไขกิจกรรม", href: "/admin/activities", icon: CalendarRange },
  { name: "สแกนเช็คชื่อ", href: "/admin/scan", icon: QrCode },
];

export default function AdminNavbar() {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close dropdowns on route change
  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Navbar visibility logic
  const hideNavbarRoutes = ["/admin/login"];
  if (hideNavbarRoutes.includes(pathname)) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 select-none font-sarabun transition-colors duration-300">
      <div className="max-w-6xl mx-auto bg-white/90 dark:bg-[#0a0a0af0] backdrop-blur-xl border border-gray-200 dark:border-white/[0.04] px-6 py-3 rounded-2xl flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300">
        
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-2 cursor-pointer">
          <div className="relative w-16 h-8">
            <Image
              src="/img/logohaed1.png"
              alt="RMUTI Logo"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div className="h-4 w-[1px] bg-gray-200 dark:bg-white/10 hidden sm:block" />
          <span className="text-[10px] tracking-[0.25em] font-light text-orange-500 uppercase hidden sm:block">
            Admin Panel
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href} className="relative px-4 py-2">
                <span className={`relative z-10 flex items-center gap-2 text-xs font-light tracking-wide transition-colors duration-300 ${isActive ? 'text-orange-500' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}>
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </span>
                
                {/* Tubelight underglow active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="admin-active-tab"
                    className="absolute inset-0 bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  >
                    {/* Tiny glowing bar at the bottom */}
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_1px_8px_rgba(249,115,22,0.6)]" />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Dropdown Profile */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-[58px] h-7 rounded-full p-0.5 bg-gray-200 dark:bg-[#2c2d30] border border-gray-300/40 dark:border-white/[0.04] transition-colors duration-300 relative flex items-center cursor-pointer focus:outline-none shadow-inner"
            aria-label="สลับโหมดสี"
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-6 h-6 rounded-full flex items-center justify-center bg-black dark:bg-white shadow-md z-10"
              style={{
                marginLeft: theme === "dark" ? "0" : "auto",
              }}
            >
              {theme === "dark" ? (
                <Sun className="h-3.5 w-3.5 text-black" />
              ) : (
                <Moon className="h-3.5 w-3.5 text-white" />
              )}
            </motion.div>
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/[0.04] bg-gray-50 dark:bg-white/[0.01] hover:bg-gray-100 dark:hover:bg-white/[0.03] transition duration-300 text-xs font-light text-gray-700 dark:text-gray-300"
            >
              <User className="h-3.5 w-3.5 text-orange-500/80" />
              <span className="hidden sm:block max-w-[100px] truncate">{session?.user?.name || "Admin"}</span>
              <ChevronDown className={`h-3 w-3 text-gray-500 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <>
                  {/* Overlay to close on outside click */}
                  <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0a0a0b] border border-gray-200 dark:border-white/[0.08] backdrop-blur-xl p-2 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-20 transition-colors duration-300"
                  >
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 text-xs font-light transition duration-300"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>ออกจากระบบ</span>
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-gray-200 dark:border-white/[0.04] bg-gray-50 dark:bg-white/[0.01] text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-64 bg-white/95 dark:bg-[#0a0a0bf8] border-l border-gray-200 dark:border-white/[0.04] backdrop-blur-xl p-6 flex flex-col gap-6 z-40 md:hidden pt-24 transition-colors duration-300"
            >
              <div className="flex flex-col gap-2">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition duration-300 text-xs font-light ${
                        isActive
                          ? "bg-orange-500/10 border-orange-500/20 text-orange-500"
                          : "bg-gray-50 dark:bg-white/[0.01] border-gray-100 dark:border-white/[0.02] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
