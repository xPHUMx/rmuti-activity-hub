
// "use client";
// import { useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Swal from "sweetalert2";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faIdCard,
//   faBuildingColumns,
//   faCalendarAlt,
//   faPhone,
// } from "@fortawesome/free-solid-svg-icons";

// export default function ProfileSetup() {
//   const { data: session } = useSession();
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     studentId: "",
//     department: "",
//     year: "",
//     phone: "",
//   });

//   // ฟังก์ชันจัดรูปแบบรหัสนักศึกษา (12 ตัว: xxxxxxxxxxx-x)
//   const formatStudentId = (value: string) => {
//     value = value.replace(/\D/g, ""); // เอาตัวอักษรที่ไม่ใช่ตัวเลขออก
//     if (value.length > 11) {
//       return value.slice(0, 11) + "-" + value.slice(11, 12);
//     }
//     return value;
//   };

//   // ฟังก์ชันจัดรูปแบบเบอร์โทร (10 ตัว: xxx-xxx-xxxx)
//   const formatPhone = (value: string) => {
//     value = value.replace(/\D/g, ""); // เอาตัวอักษรที่ไม่ใช่ตัวเลขออก
//     if (value.length > 6) {
//       return value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 10);
//     }
//     return value;
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (name === "studentId") {
//       setFormData({ ...formData, studentId: formatStudentId(value) });
//     } else if (name === "phone") {
//       setFormData({ ...formData, phone: formatPhone(value) });
//     } else {
//       setFormData({ ...formData, [name]: value });
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // ตรวจสอบว่ามีการเข้าสู่ระบบหรือไม่
//     if (!session?.user?.email) {
//       Swal.fire("กรุณาล็อกอินใหม่", "คุณต้องล็อกอินเพื่อบันทึกข้อมูล", "error");
//       return;
//     }

//     const response = await fetch("/api/users/update-profile", {
//       method: "PATCH", // ใช้ PATCH แทน POST
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: session?.user?.email,
//         fullName: formData.fullName.trim(),
//         studentId: formData.studentId.trim(),
//         department: formData.department.trim(),
//         year: formData.year.trim(),
//         phone: formData.phone.trim(),
//       }),
//     });

//     if (response.ok) {
//       // ✅ แสดง SweetAlert2 แจ้งว่าบันทึกข้อมูลสำเร็จ
//       Swal.fire({
//         title: "บันทึกข้อมูลสำเร็จ!",
//         text: "ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว",
//         icon: "success",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "กรุณาเข้าสู่ระบบอีกครั้ง",
//         background: "#ffffff",
//         color: "#1E293",
//       }).then(() => {
//         router.push("/");
//       });
//     } else {
//       // ❌ แสดง SweetAlert2 แจ้งข้อผิดพลาด
//       Swal.fire({
//         title: "❌ เกิดข้อผิดพลาด!",
//         text: "กรุณาลองใหม่อีกครั้ง",
//         icon: "error",
//         confirmButtonColor: "#d33",
//         confirmButtonText: "ตกลง",
//         background: "#ffffff",
//         color: "#1E293",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
//       <div className="max-w-md w-full p-6 bg-gray-800 rounded-xl shadow-lg">
//         <h2 className="text-xl font-semibold mb-4 text-center">กรอกข้อมูลนักศึกษา</h2>
//         <form onSubmit={handleSubmit}>
//           <label className="block mb-2">
//             <FontAwesomeIcon icon={faUser} className="mr-2" /> ชื่อ-นามสกุล
//           </label>
//           <input
//             name="fullName"
//             className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
//             onChange={handleChange}
//             required
//           />

//           <label className="block mt-4 mb-2">
//             <FontAwesomeIcon icon={faIdCard} className="mr-2" /> รหัสนักศึกษา
//           </label>
//           <input
//             name="studentId"
//             maxLength={13} // ✅ 12 ตัว + ขีด
//             className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
//             value={formData.studentId}
//             onChange={handleChange}
//             required
//           />

//           <label className="block mt-4 mb-2">
//             <FontAwesomeIcon icon={faBuildingColumns} className="mr-2" /> สาขา
//           </label>
//           <input
//             name="department"
//             className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
//             onChange={handleChange}
//             required
//           />

//           <label className="block mt-4 mb-2">
//             <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> ปีการศึกษา
//           </label>
//           <input
//             name="year"
//             className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
//             onChange={handleChange}
//             required
//           />

//           <label className="block mt-4 mb-2">
//             <FontAwesomeIcon icon={faPhone} className="mr-2" /> เบอร์โทร
//           </label>
//           <input
//             name="phone"
//             maxLength={12} // ✅ 10 ตัว + ขีด
//             className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//           />

//           <button
//             type="submit"
//             className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-300"
//           >
//             บันทึกข้อมูล
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { signOut } from "next-auth/react"; // ✅ เพิ่มสำหรับการรีเฟรช session
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faIdCard,
  faBuildingColumns,
  faCalendarAlt,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

export default function ProfileSetup() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    department: "",
    year: "",
    phone: "",
  });

  // ฟังก์ชันจัดรูปแบบรหัสนักศึกษา
  const formatStudentId = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length > 11) {
      return value.slice(0, 11) + "-" + value.slice(11, 12);
    }
    return value;
  };

  // ฟังก์ชันจัดรูปแบบเบอร์โทร
  const formatPhone = (value: string) => {
    value = value.replace(/\D/g, "");
    if (value.length > 6) {
      return value.slice(0, 3) + "-" + value.slice(3, 6) + "-" + value.slice(6, 10);
    }
    return value;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "studentId") {
      setFormData({ ...formData, studentId: formatStudentId(value) });
    } else if (name === "phone") {
      setFormData({ ...formData, phone: formatPhone(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ตรวจสอบว่ามีการเข้าสู่ระบบหรือไม่
    if (!session?.user?.email) {
      Swal.fire("กรุณาล็อกอินใหม่", "คุณต้องล็อกอินเพื่อบันทึกข้อมูล", "error");
      return;
    }

    const response = await fetch("/api/users/update-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session?.user?.email,
        fullName: formData.fullName.trim(),
        studentId: formData.studentId.trim(),
        department: formData.department.trim(),
        year: formData.year.trim(),
        phone: formData.phone.trim(),
      }),
    });

    if (response.ok) {
      Swal.fire({
        title: "บันทึกข้อมูลสำเร็จ!",
        text: "ข้อมูลของคุณถูกบันทึกเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่เพื่ออัปเดตข้อมูล",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
        background: "#fffff",
        color: "#1E293",
      }).then(() => {
        signOut({ callbackUrl: "/login" }); // ✅ หลังจากออกจากระบบ ให้เปลี่ยนไปหน้า /login ทันที
      });
    } else {
      // ❌ แสดง SweetAlert2 แจ้งข้อผิดพลาด
      Swal.fire({
        title: "❌ เกิดข้อผิดพลาด!",
        text: "กรุณาลองใหม่อีกครั้ง",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ตกลง",
        background: "#ffffff",
        color: "#1E293",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="max-w-md w-full p-6 bg-gray-800 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">กรอกข้อมูลนักศึกษา</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <FontAwesomeIcon icon={faUser} className="mr-2" /> ชื่อ-นามสกุล
          </label>
          <input
            name="fullName"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          <label className="block mt-4 mb-2">
            <FontAwesomeIcon icon={faIdCard} className="mr-2" /> รหัสนักศึกษา
          </label>
          <input
            name="studentId"
            maxLength={13}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
            value={formData.studentId}
            onChange={handleChange}
            required
          />

          <label className="block mt-4 mb-2">
            <FontAwesomeIcon icon={faBuildingColumns} className="mr-2" /> สาขา
          </label>
          <input
            name="department"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          <label className="block mt-4 mb-2">
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> ปีการศึกษา
          </label>
          <input
            name="year"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
            required
          />

          <label className="block mt-4 mb-2">
            <FontAwesomeIcon icon={faPhone} className="mr-2" /> เบอร์โทร
          </label>
          <input
            name="phone"
            maxLength={12}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition duration-300"
          >
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
}

