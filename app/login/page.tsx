
// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (session) {
//       if (session.user.role === "admin") {
//         router.push("/admin/dashboard");
//       } else {
//         router.push("/");
//       }
//     }
//   }, [session, router]);

//   const handleAdminLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await signIn("credentials", {
//       redirect: false,
//       username,
//       password,
//     });

//     if (res?.error) {
//       setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
//     }
//   };

//   return (
//     <section
//       className="min-h-screen flex items-center justify-center"
//       style={{
//         backgroundImage: `url('img/PC screen 2.png')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div
//         className="px-5 py-10 md:w-96 rounded-2xl shadow-lg"
//         style={{
//           backgroundColor: "rgba(255, 255, 255, 0.1)",
//           backdropFilter: "blur(30px)",
//         }}
//       >
//         <div className="px-8">
//           <div className="relative w-full h-40">
//             <Image
//               src="https://www.eng.rmuti.ac.th/2015/images/headers/logohaed1.png"
//               alt="Logo"
//               layout="fill"
//               objectFit="contain"
//               priority
//             />
//           </div>
//           <form
//             onSubmit={handleAdminLogin}
//             className="text-sm flex flex-col gap-4 mt-4"
//           >
//             <input
//               type="text"
//               placeholder="Username (Admin)"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="p-2 rounded-xl border border-gray-700 bg-gray-700 text-white"
//             />
//             <input
//               type="password"
//               placeholder="Password (Admin)"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="p-2 rounded-xl border border-gray-700 bg-gray-700 text-white"
//             />
//             <button
//               type="submit"
//               className="bg-orange-900 text-white rounded-xl py-2 hover:scale-105 duration-300"
//             >
//               เข้าสู่ระบบ (Admin)
//             </button>
//           </form>
//           {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

//           <div className="mt-6 text-gray-400 grid items-center grid-cols-3">
//             <hr className="border-gray-600" />
//             <p className="text-center text-sm text-gray-800">เข้าสู่ระบบ</p>
//             <hr className="border-gray-600" />
//           </div>

//           <button
//             onClick={() => signIn("google")}
//             className="bg-gray-700 px-2 py-2 mt-5 border border-gray-600 w-full rounded-xl 
//           flex justify-center items-center text-sm hover:scale-105 duration-300 text-white"
//           >
//             <Image
//               src="/img/google-logo.png"
//               width={30}
//               height={30}
//               alt="Google Logo"
//               priority
//             />
//             <span className="px-2">Login</span>
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import React, { useEffect } from "react";
// import Image from "next/image";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (session) {
//       if (session.user.role === "admin") {
//         router.push("/admin/dashboard");
//       } else {
//         router.push("/");
//       }
//     }
//   }, [session, router]);

//   return (
//     <section
//       className="min-h-screen flex items-center justify-center"
//       style={{
//         backgroundImage: `url('img/PC screen 2.png')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div
//         className="px-5 py-10 md:w-96 rounded-2xl shadow-lg"
//         style={{
//           backgroundColor: "rgba(255, 255, 255, 0.1)",
//           backdropFilter: "blur(30px)",
//         }}
//       >
//         <div className="px-8">
//           <div className="relative w-full h-40">
//             <Image
//               src="https://www.eng.rmuti.ac.th/2015/images/headers/logohaed1.png"
//               alt="Logo"
//               layout="fill"
//               objectFit="contain"
//               priority
//             />
//           </div>

//           <div className="mt-6 text-gray-400 grid items-center grid-cols-3">
//             <hr className="border-gray-600" />
//             <p className="text-center text-sm text-gray-800">เข้าสู่ระบบ</p>
//             <hr className="border-gray-600" />
//           </div>

//           <button
//             onClick={() => signIn("google")}
//             className="bg-gray-700 px-2 py-2 mt-5 border border-gray-600 w-full rounded-xl 
//           flex justify-center items-center text-sm hover:scale-105 duration-300 text-white"
//           >
//             <Image
//               src="/img/google-logo.png"
//               width={30}
//               height={30}
//               alt="Google Logo"
//               priority
//             />
//             <span className="px-2">Login</span>
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const { data: session } = useSession();
//   const router = useRouter();

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (session) {
//       if (session.user.role === "admin") {
//         router.push("/admin/dashboard");
//       } else {
//         router.push("/");
//       }
//     }
//   }, [session, router]);

//   const handleAdminLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const res = await signIn("credentials", {
//       redirect: false,
//       username,
//       password,
//     });

//     if (res?.error) {
//       setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
//     }
//   };

//   return (
//     <section
//       className="min-h-screen flex items-center justify-center"
//       style={{
//         backgroundImage: `url('img/PC screen 2.png')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div
//         className="px-5 py-10 md:w-96 rounded-2xl shadow-lg"
//         style={{
//           backgroundColor: "rgba(255, 255, 255, 0.1)",
//           backdropFilter: "blur(15px)",
//         }}
//       >
//         <div className="px-8">
//           <div className="relative w-full h-40">
//             <Image
//               src="https://www.eng.rmuti.ac.th/2015/images/headers/logohaed1.png"
//               alt="Logo"
//               layout="fill"
//               objectFit="contain"
//               priority
//             />
//           </div>
//           <form
//             onSubmit={handleAdminLogin}
//             className="text-sm flex flex-col gap-4 mt-4"
//           >
//             <input
//               type="text"
//               placeholder="Username (Admin)"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               className="p-2 rounded-xl border border-gray-700 bg-gray-700 text-white"
//             />
//             <input
//               type="password"
//               placeholder="Password (Admin)"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="p-2 rounded-xl border border-gray-700 bg-gray-700 text-white"
//             />
//             <button
//               type="submit"
//               className="bg-orange-900 text-white rounded-xl py-2 hover:scale-105 duration-300"
//             >
//               เข้าสู่ระบบ (Admin)
//             </button>
//           </form>
//           {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

//           <div className="mt-6 text-gray-400 grid items-center grid-cols-3">
//             <hr className="border-gray-600" />
//             <p className="text-center text-sm text-gray-800">หรือ</p>
//             <hr className="border-gray-600" />
//           </div>

//           <button
//             onClick={() => signIn("google")}
//             className="bg-gray-700 px-2 py-2 mt-5 border border-gray-600 w-full rounded-xl 
//           flex justify-center items-center text-sm hover:scale-105 duration-300 text-white"
//           >
//             <Image
//               src="/img/google-logo.png"
//               width={30}
//               height={30}
//               alt="Google Logo"
//               priority
//             />
//             <span className="px-2">เข้าสู่ระบบ นักศึกษา</span>
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import React, { useEffect } from "react";
// import Image from "next/image";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "authenticated") {
//       if (session?.user?.role === "admin") {
//         router.push("/admin/dashboard"); // ✅ ถ้าเป็น Admin → ไปหน้า Admin Dashboard
//       } else if (!session?.user?.hasProfile) {
//         router.push("/profile-setup"); // ✅ ถ้ายังไม่มีข้อมูล → ไปกรอกข้อมูลก่อน
//       } else {
//         router.push("/"); // ✅ ถ้ามีข้อมูลแล้ว → ไป Dashboard
//       }
//     }
//   }, [session, status, router]);

//   return (
//     <section
//       className="min-h-screen flex items-center justify-center"
//       style={{
//         backgroundImage: `url('img/PC screen 2.png')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div
//         className="px-5 py-10 md:w-96 rounded-2xl shadow-lg"
//         style={{
//           backgroundColor: "rgba(255, 255, 255, 0.1)",
//           backdropFilter: "blur(33px)",
//         }}
//       >
//         <div className="px-8">
//           <div className="relative w-full h-40">
//             <Image
//               src="https://www.eng.rmuti.ac.th/2015/images/headers/logohaed1.png"
//               alt="Logo"
//               layout="fill"
//               objectFit="contain"
//               priority
//             />
//           </div>

//           <button
//             onClick={() => signIn("google")}
//             className="bg-gray-700 px-2 py-2 mt-5 border border-gray-600 w-full rounded-xl 
//           flex justify-center items-center text-sm hover:scale-105 duration-300 text-white"
//           >
//             <Image
//               src="/img/google-logo.png"
//               width={30}
//               height={30}
//               alt="Google Logo"
//               priority
//             />
//             <span className="px-2">เข้าสู่ระบบด้วย Google</span>
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }

// "use client";

// import React, { useEffect } from "react";
// import Image from "next/image";
// import { signIn, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

// export default function LoginPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   useEffect(() => {
//     if (status === "authenticated") {
//       if (session?.user?.role === "admin") {
//         router.push("/admin/dashboard"); // ✅ ถ้าเป็น Admin → ไปหน้า Admin Dashboard
//       } else if (!session?.user?.hasProfile) {
//         router.push("/profile-setup"); // ✅ ถ้ายังไม่มีข้อมูล → ไปกรอกข้อมูลก่อน
//       } else {
//         router.push("/"); // ✅ ถ้ามีข้อมูลแล้ว → ไป Dashboard
//       }
//     }
//   }, [session, status, router]);

//   return (
//     <section
//       className="min-h-screen flex items-center justify-center bg-cover bg-center"
//       style={{
//         backgroundImage: "url('/img/PC screen 2.png')",
//       }}
//     >
//       <div
//         className="px-8 py-12 md:w-96 rounded-2xl shadow-lg bg-white bg-opacity-20 backdrop-blur-lg"
//       >
//         <div className="relative w-full h-40 mb-8">
//           <Image
//             src="https://www.eng.rmuti.ac.th/2015/images/headers/logohaed1.png"
//             alt="Logo"
//             layout="fill"
//             objectFit="contain"
//             priority
//           />
//         </div>

//         <button
//           onClick={() => signIn("google")}
//           className="bg-gray-800 hover:bg-orange-900 mt-5  w-full rounded-xl flex justify-center items-center text-sm text-white py-3 font-medium transition duration-300 transform hover:scale-105"
//         >
//           <Image
//             src="/img/google-logo.png"
//             width={30}
//             height={30}
//             alt="Google Logo"
//             className="mr-2"
//           />
//           <span>เข้าสู่ระบบ</span>
//         </button>

//         {/* ข้อความเพิ่มเติมที่ให้เข้าสู่ระบบด้วยอีเมลมหาวิทยาลัย */}
//         <p className="text-center text-gray text-xs mt-4">
//           โปรดเข้าสู่ระบบด้วยอีเมลมหาวิทยาลัย!
//         </p>
//       </div>
//     </section>
//   );
// }


"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ ฟังก์ชันเพิ่มผู้ใช้ออนไลน์ไปยัง API
  const addUserToOnlineUsers = async (userEmail: string) => {
    try {
      console.log("🚀 Sending user to onlineUsers:", userEmail); // ✅ Debug ที่นี่
  
      const response = await fetch("/api/online-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userEmail }),
      });
  
      const data = await response.json();
      console.log("✅ User added to onlineUsers:", data);
    } catch (err) {
      console.error("❌ Error adding user to onlineUsers:", err);
    }
  };

  // ✅ อัปเดตผู้ใช้ออนไลน์หลังจากเข้าสู่ระบบสำเร็จ
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      addUserToOnlineUsers(session.user.email);

      // ✅ ตรวจสอบสิทธิ์ของผู้ใช้และเปลี่ยนเส้นทาง
      if (session?.user?.role === "admin") {
        router.push("/admin/dashboard"); // ไปที่หน้า Admin Dashboard
      } else if (!session?.user?.hasProfile) {
        router.push("/profile-setup"); // ไปตั้งค่าข้อมูลโปรไฟล์
      } else {
        router.push("/"); // ไปที่หน้า Home
      }
    }
  }, [session, status, router]);

  // ✅ ฟังก์ชันจัดการ Login
  const handleLogin = async () => {
    const result = await signIn("google", { redirect: false });

    if (result?.ok) {
      console.log("✅ Sign-in successful");
    } else {
      console.error("❌ Sign-in failed", result?.error);
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/img/PC screen 2.png')",
      }}
    >
      <div className="px-8 py-12 md:w-96 rounded-2xl shadow-lg bg-white bg-opacity-20 backdrop-blur-lg">
        <div className="relative w-full h-40 mb-8">
          <Image
            src="https://www.eng.rmuti.ac.th/2015/images/headers/logohaed1.png"
            alt="Logo"
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>

        <button
          onClick={handleLogin} // ✅ ใช้ฟังก์ชัน handleLogin
          className="bg-gray-800 hover:bg-orange-900 mt-5 w-full rounded-xl flex justify-center items-center text-sm text-white py-3 font-medium transition duration-300 transform hover:scale-105"
        >
          <Image
            src="/img/google-logo.png"
            width={30}
            height={30}
            alt="Google Logo"
            className="mr-2"
          />
          <span>เข้าสู่ระบบ</span>
        </button>

        {/* ข้อความเพิ่มเติมที่ให้เข้าสู่ระบบด้วยอีเมลมหาวิทยาลัย */}
        <p className="text-center text-gray text-xs mt-4">
          โปรดเข้าสู่ระบบด้วยอีเมลมหาวิทยาลัย!
        </p>
      </div>
    </section>
  );
}
