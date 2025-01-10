

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

//   // ใช้ useEffect เพื่อตรวจสอบ session และเปลี่ยนเส้นทาง
//   useEffect(() => {
//     if (session) {
//       if (session.user.role === "admin") {
//         router.push("/admin/dashboard"); // เปลี่ยนไปหน้า Admin Dashboard
//       } else {
//         router.push("/"); // เปลี่ยนไปหน้า Dashboard ของผู้ใช้
//       }
//     }
//   }, [session, router]);

//   // จัดการล็อกอินแอดมิน
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
//     <section className="bg-gray-900 min-h-screen flex items-center justify-center">
//       <div className="bg-gray-800 px-5 py-12 md:w-96 rounded-2xl shadow-lg">
//         <div className="px-8">
//           <img
//             src="https://www.eng.rmuti.ac.th/2015/images/headers/logohaed1.png"
//             alt="Logo"
//           />
//           {/* Admin Login Form */}
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
//               className="bg-blue-600 text-white rounded-xl py-2 hover:scale-105 duration-300"
//             >
//               เข้าสู่ระบบ (Admin)
//             </button>
//           </form>
//           {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

//           {/* Divider */}
//           <div className="mt-6 text-gray-400 grid items-center grid-cols-3">
//             <hr className="border-gray-600" />
//             <p className="text-center text-sm text-gray-300">หรือ</p>
//             <hr className="border-gray-600" />
//           </div>

//           {/* Gmail Login */}
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
//             />
//             <span className="px-2">เข้าสู่ระบบ นักศึกษา</span>
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
//         className="px-6 py-12 md:w-96 rounded-2xl shadow-lg"
//         style={{
//           backgroundColor: "rgba(255, 255, 255, 0.1)",
//           backdropFilter: "blur(7px)",
//         }}
//       >
//         <div className="px-8">
//           <img
//             src="https://www.eng.rmuti.ac.th/2015/images/headers/logohaed1.png"
//             alt="Logo"
//           />
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
//               className="bg-blue-600 text-white rounded-xl py-2 hover:scale-105 duration-300"
//             >
//               เข้าสู่ระบบ (Admin)
//             </button>
//           </form>
//           {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

//           <div className="mt-6 text-gray-400 grid items-center grid-cols-3">
//             <hr className="border-gray-600" />
//             <p className="text-center text-sm text-gray-300">หรือ</p>
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
//             />
//             <span className="px-2">เข้าสู่ระบบ นักศึกษา</span>
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      if (session.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [session, router]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('img/PC screen 2.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        className="px-5 py-10 md:w-96 rounded-2xl shadow-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(15px)",
        }}
      >
        <div className="px-8">
          <div className="relative w-full h-40">
            <Image
              src="https://www.eng.rmuti.ac.th/2015/images/headers/logohaed1.png"
              alt="Logo"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
          <form
            onSubmit={handleAdminLogin}
            className="text-sm flex flex-col gap-4 mt-4"
          >
            <input
              type="text"
              placeholder="Username (Admin)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 rounded-xl border border-gray-700 bg-gray-700 text-white"
            />
            <input
              type="password"
              placeholder="Password (Admin)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 rounded-xl border border-gray-700 bg-gray-700 text-white"
            />
            <button
              type="submit"
              className="bg-orange-900 text-white rounded-xl py-2 hover:scale-105 duration-300"
            >
              เข้าสู่ระบบ (Admin)
            </button>
          </form>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

          <div className="mt-6 text-gray-400 grid items-center grid-cols-3">
            <hr className="border-gray-600" />
            <p className="text-center text-sm text-gray-800">หรือ</p>
            <hr className="border-gray-600" />
          </div>

          <button
            onClick={() => signIn("google")}
            className="bg-gray-700 px-2 py-2 mt-5 border border-gray-600 w-full rounded-xl 
          flex justify-center items-center text-sm hover:scale-105 duration-300 text-white"
          >
            <Image
              src="/img/google-logo.png"
              width={30}
              height={30}
              alt="Google Logo"
              priority
            />
            <span className="px-2">เข้าสู่ระบบ นักศึกษา</span>
          </button>
        </div>
      </div>
    </section>
  );
}
