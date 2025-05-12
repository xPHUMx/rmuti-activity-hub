

// "use client";

// import { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faUser,
//   faEnvelope,
//   faIdCard,
//   faUserShield,
// } from "@fortawesome/free-solid-svg-icons";

// const MySwal = withReactContent(Swal);

// export default function AdminUsersPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true); // สถานะการโหลดข้อมูล

//   // ดึงข้อมูลผู้ใช้
//   useEffect(() => {
//     fetch("/api/admin/users")
//       .then((res) => res.json())
//       .then((data) => {
//         setUsers(data);
//         setIsLoading(false); // ตั้งสถานะเป็นโหลดเสร็จแล้ว
//       })
//       .catch((error) => {
//         console.error("Error fetching users:", error);
//         setIsLoading(false); // ถ้าหากเกิดข้อผิดพลาดให้ตั้งสถานะเป็นโหลดเสร็จ
//       });
//   }, []);

//   // ฟังก์ชันแสดงรายละเอียดผู้ใช้
//   const fetchUserDetails = async (id: string) => {
//     const res = await fetch(`/api/admin/users/${id}`);
//     const user = await res.json();

//     // เปิด SweetAlert2 Popup พร้อมไอคอน
//     MySwal.fire({
//       title: `<strong>รายละเอียดนักศึกษา</strong>`,
//       html: `
//         <div style="text-align: left; font-size: 16px;">
//           <p><i class="fas fa-user"></i> <strong>ชื่อ:</strong> ${user.name}</p>
//           <p><i class="fas fa-envelope"></i> <strong>Email:</strong> ${user.email}</p>
//           <p><i class="fas fa-id-card"></i> <strong>รหัสนักศึกษา:</strong> ${user.studentId || "-"}</p>
//           <p><i class="fas fa-graduation-cap"></i> <strong>สาขา:</strong> ${user.department || "-"}</p>
//           <p><i class="fas fa-calendar-alt"></i> <strong>ปีการศึกษา:</strong> ${user.year || "-"}</p>
//           <p><i class="fas fa-phone"></i> <strong>เบอร์โทร:</strong> ${user.phone || "-"}</p>
//           <p><i class="fas fa-user-shield"></i> <strong>บทบาท:</strong> ${user.role}</p>
//         </div>
//       `,
//       icon: "info",
//       confirmButtonText: "ปิด",
//       confirmButtonColor: "#3085d6",
//       background: "#1E293B",
//       color: "#ffffff",
//     });
//   };

//   // ฟังก์ชันอัปเดตบทบาทผู้ใช้
//   const updateUserRole = async (id: string, newRole: string) => {
//     const result = await MySwal.fire({
//       title: "ยืนยันการเปลี่ยนบทบาท?",
//       text: `คุณต้องการเปลี่ยนบทบาทผู้ใช้เป็น "${newRole}" หรือไม่?`,
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "ใช่, เปลี่ยนเลย!",
//       cancelButtonText: "ยกเลิก",
//     });

//     if (result.isConfirmed) {
//       const res = await fetch("/api/admin/users", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id, role: newRole }),
//       });

//       if (res.ok) {
//         setUsers(users.map((user) => (user._id === id ? { ...user, role: newRole } : user)));
//         MySwal.fire("สำเร็จ!", "บทบาทของผู้ใช้ถูกอัปเดตแล้ว", "success");
//       } else {
//         MySwal.fire("ผิดพลาด!", "ไม่สามารถอัปเดตบทบาทได้", "error");
//       }
//     }
//   };

//   // กรณีที่กำลังโหลด
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
//         กำลังโหลดข้อมูล...
//       </div>
//     );
//   }

//   return (
//     <div
//       className="min-h-screen text-white p-10"
//       style={{
//         backgroundImage: "url('/img/PC screen 1.png')",
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <h1 className="text-2xl font-bold mb-6">จัดการผู้ใช้</h1>
//       <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
//         <thead>
//           <tr className="bg-gray-700">
//             <th className="p-3">
//               <FontAwesomeIcon icon={faUser} /> ชื่อ
//             </th>
//             <th className="p-3">
//               <FontAwesomeIcon icon={faEnvelope} /> Email
//             </th>
//             <th className="p-3">
//               <FontAwesomeIcon icon={faIdCard} /> รหัสนักศึกษา
//             </th>
//             <th className="p-3">
//               <FontAwesomeIcon icon={faUserShield} /> บทบาท
//             </th>
//             <th className="p-3">จัดการ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user._id} className="text-center border-b border-gray-600">
//               <td className="p-3">{user.name}</td>
//               <td className="p-3">{user.email}</td>
//               <td className="p-3">{user.studentId || "-"}</td>
//               <td className="p-3">
//                 <select
//                   className="bg-gray-700 p-1 rounded"
//                   value={user.role}
//                   onChange={(e) => updateUserRole(user._id, e.target.value)}
//                 >
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>
//               </td>
//               <td className="p-3">
//                 <button
//                   onClick={() => fetchUserDetails(user._id)}
//                   className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
//                 >
//                   ดูข้อมูล
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faIdCard,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";

const MySwal = withReactContent(Swal);

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true); // สถานะการโหลดข้อมูล

  // ดึงข้อมูลผู้ใช้
  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setIsLoading(false); // ตั้งสถานะเป็นโหลดเสร็จแล้ว
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setIsLoading(false); // ถ้าหากเกิดข้อผิดพลาดให้ตั้งสถานะเป็นโหลดเสร็จ
      });
  }, []);

  // ฟังก์ชันแสดงรายละเอียดผู้ใช้
  const fetchUserDetails = async (id: string) => {
    const res = await fetch(`/api/admin/users/${id}`);
    const user = await res.json();
  
    MySwal.fire({
      title: `<strong>รายละเอียดนักศึกษา</strong>`,
      html: `
        <div style="text-align: left; font-size: 15px; color: #1E293B;">
          <p><i class="fas fa-user"></i> <strong>ชื่อ:</strong> ${user.name}</p>
          <p><i class="fas fa-envelope"></i> <strong>Email:</strong> ${user.email}</p>
          <p><i class="fas fa-id-card"></i> <strong>รหัสนักศึกษา:</strong> ${user.studentId || "-"}</p>
          <p><i class="fas fa-graduation-cap"></i> <strong>สาขา:</strong> ${user.department || "-"}</p>
          <p><i class="fas fa-clipboard-list"></i> <strong>ภาค:</strong> ${user.program || "-"}</p>
          <p><i class="fas fa-calendar-alt"></i> <strong>ปีการศึกษา:</strong> ${user.year || "-"}</p>
          <p><i class="fas fa-phone"></i> <strong>เบอร์โทร:</strong> ${user.phone || "-"}</p>
          <p><i class="fas fa-user-shield"></i> <strong>บทบาท:</strong> ${user.role}</p>
        </div>
      `,
      icon: "info",
      confirmButtonText: "ปิด",
      confirmButtonColor: "#3085d6",
      background: "#ffffff", // พื้นหลังขาว
      color: "#1E293B",        // ฟ้อนสีเทาเข้ม
    });
  };

  // ฟังก์ชันอัปเดตบทบาทผู้ใช้
  const updateUserRole = async (id: string, newRole: string) => {
    const result = await MySwal.fire({
      title: "ยืนยันการเปลี่ยนบทบาท?",
      text: `คุณต้องการเปลี่ยนบทบาทผู้ใช้เป็น "${newRole}" หรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ใช่, เปลี่ยนเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole }),
      });

      if (res.ok) {
        setUsers(users.map((user) => (user._id === id ? { ...user, role: newRole } : user)));
        MySwal.fire("สำเร็จ!", "บทบาทของผู้ใช้ถูกอัปเดตแล้ว", "success");
      } else {
        MySwal.fire("ผิดพลาด!", "ไม่สามารถอัปเดตบทบาทได้", "error");
      }
    }
  };

  // กรณีที่กำลังโหลด
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white p-10"
      style={{
        backgroundImage: "url('/img/PC screen 1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-3">
              <FontAwesomeIcon icon={faUser} /> ชื่อ
            </th>
            <th className="p-3">
              <FontAwesomeIcon icon={faEnvelope} /> Email
            </th>
            <th className="p-3">
              <FontAwesomeIcon icon={faIdCard} /> รหัสนักศึกษา
            </th>
            <th className="p-3">
              <FontAwesomeIcon icon={faUserShield} /> บทบาท
            </th>
            <th className="p-3">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center border-b border-gray-600">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.studentId || "-"}</td>
              <td className="p-3">
                <select
                  className="bg-gray-700 p-1 rounded"
                  value={user.role}
                  onChange={(e) => updateUserRole(user._id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-3">
                <button
                  onClick={() => fetchUserDetails(user._id)}
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                >
                  ดูข้อมูล
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

