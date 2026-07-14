"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loggingIn, setLoggingIn] = useState(false);

  // ฟังก์ชันเพิ่มผู้ใช้ออนไลน์ไปยัง API
  const addUserToOnlineUsers = async (userEmail: string) => {
    try {
      console.log("🚀 Sending user to onlineUsers:", userEmail);
      await fetch("/api/online-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userEmail }),
      });
    } catch (err) {
      console.error("❌ Error adding user to onlineUsers:", err);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      addUserToOnlineUsers(session.user.email);

      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard");
      } else if (!session?.user?.hasProfile) {
        router.push("/profile-setup");
      } else {
        router.push("/");
      }
    }
  }, [session, status, router]);

  const handleLogin = async () => {
    setLoggingIn(true);
    try {
      await signIn("google", { redirect: false });
    } catch (error) {
      console.error("❌ Sign-in failed", error);
      setLoggingIn(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#080808] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-white/[0.02] backdrop-blur-2xl p-10 md:p-12 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] border border-white/[0.04] flex flex-col items-center"
      >
        {/* Logo Container */}
        <div className="relative w-48 h-20 mb-8 select-none">
          <Image
            src="/img/logohaed1.png"
            alt="RMUTI Logo"
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Title */}
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-[10px] tracking-[0.3em] font-light text-orange-500 uppercase">
            RMUTI Activity Hub
          </h2>
          <p className="text-xl font-extralight text-gray-300 tracking-wide">
            เข้าสู่ระบบเพื่อใช้งานระบบกิจกรรม
          </p>
        </div>

        {/* Google Login Button */}
        <button
          onClick={handleLogin}
          disabled={loggingIn}
          className="bg-white text-black hover:bg-orange-500 hover:text-black w-full rounded-full flex justify-center items-center text-xs font-light tracking-[0.15em] py-3.5 px-6 transition duration-500 transform hover:scale-[1.02] border border-white/[0.1] hover:border-orange-500 shadow-[0_5px_15px_rgba(255,255,255,0.05)] hover:shadow-[0_10px_25px_rgba(249,115,22,0.2)] disabled:opacity-50"
        >
          {loggingIn ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent" />
          ) : (
            <>
              <Image
                src="/img/google-logo.png"
                width={18}
                height={18}
                alt="Google Logo"
                className="mr-3 object-contain"
              />
              <span>SIGN IN WITH GOOGLE</span>
            </>
          )}
        </button>

        {/* Informative Footer */}
        <div className="mt-8 border-t border-white/[0.04] pt-6 w-full text-center">
          <p className="text-[10px] tracking-wide font-light text-gray-500 uppercase">
            โปรดใช้บัญชีอีเมลมหาวิทยาลัยในการเข้าสู่ระบบ
          </p>
          <p className="text-[9px] text-orange-500/60 font-light mt-1">
            (@mail.rmuti.ac.th)
          </p>
        </div>
      </motion.div>
    </section>
  );
}
