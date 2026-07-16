"use client";

import { usePathname } from "next/navigation";
import Chatbot from "@/components/Chatbot";
import AdminButton from "@/components/AdminButton";
import VersionBadge from "@/components/VersionBadge";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      {children}
      {pathname !== "/login" && (
        <>
          <VersionBadge />
          {/* <Chatbot /> */}
        </>
      )}
      <AdminButton />
    </>
  );
}