
// "use client";

// import { useEffect, useState } from "react";
// import { PencilIcon, TrashIcon, CalendarIcon, MapPinIcon, ClockIcon} from "@heroicons/react/24/outline";
// import { CheckCircleIcon } from "@heroicons/react/24/outline";

// interface Activity {
//   _id: string;
//   title: string;
//   description: string;
//   time: string;
//   closeTime: string;
//   location: string;
//   maxParticipants: number;
//   status: string;
//   participants: Array<{
//     fullName: string;
//     studentId: string;
//     year: string;
//     phone: string;
//   }>;
// }

// export default function AdminActivities() {
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     time: "",
//     closeTime: "",
//     location: "",
//     maxParticipants: 0,
//     status: "open",
//   });
//   const [editId, setEditId] = useState<string | null>(null);

//   async function fetchActivities() {
//     try {
//       const res = await fetch("/api/activities");
//       if (!res.ok) throw new Error("Failed to fetch activities");
//       const data: Activity[] = await res.json();
//       setActivities(data);
//     } catch (error) {
//       console.error("Error fetching activities:", error);
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     const method = editId ? "PUT" : "POST";
//     const body = JSON.stringify(editId ? { id: editId, updates: formData } : formData);

//     try {
//       const res = await fetch("/api/activities", {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body,
//       });

//       if (res.ok) {
//         fetchActivities();
//         resetForm();
//       } else {
//         const errorData = await res.json();
//         console.error("Error updating/creating activity:", errorData.message);
//       }
//     } catch (error) {
//       console.error("Error submitting activity:", error);
//     }
//   }

//   function loadEditData(activity: Activity) {
//     setFormData({
//       title: activity.title,
//       description: activity.description,
//       time: activity.time,
//       closeTime: activity.closeTime,
//       location: activity.location,
//       maxParticipants: activity.maxParticipants,
//       status: activity.status,
//     });
//     setEditId(activity._id);
//   }

//   async function deleteActivity(id: string) {
//     try {
//       const res = await fetch("/api/activities", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       if (res.ok) fetchActivities();
//       else console.error("Error deleting activity");
//     } catch (error) {
//       console.error("Error deleting activity:", error);
//     }
//   }

//   function resetForm() {
//     setFormData({
//       title: "",
//       description: "",
//       time: "",
//       closeTime: "",
//       location: "",
//       maxParticipants: 0,
//       status: "open",
//     });
//     setEditId(null);
//   }

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center text-white"
//       style={{ backgroundImage: "url('/img/PC screen 2.png')" }}
//     >
//       <div className="container mx-auto py-8">
//         <h1 className="text-4xl font-bold mb-8 text-center">จัดการกิจกรรม</h1>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-gray-800 bg-opacity-80 p-6 rounded-lg mb-8 shadow-lg max-w-2xl mx-auto"
//         >
//           <h2 className="text-xl font-bold mb-4 text-center">
//             {editId ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}
//           </h2>
//           <input
//             type="text"
//             placeholder="ชื่อกิจกรรม"
//             value={formData.title}
//             onChange={(e) =>
//               setFormData({ ...formData, title: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <textarea
//             placeholder="รายละเอียดกิจกรรม"
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <input
//             type="datetime-local"
//             placeholder="วันเวลาเริ่มกิจกรรม"
//             value={formData.time}
//             onChange={(e) =>
//               setFormData({ ...formData, time: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <input
//             type="datetime-local"
//             placeholder="วันเวลาปิดกิจกรรม"
//             value={formData.closeTime}
//             onChange={(e) =>
//               setFormData({ ...formData, closeTime: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <input
//             type="text"
//             placeholder="สถานที่"
//             value={formData.location}
//             onChange={(e) =>
//               setFormData({ ...formData, location: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <input
//             type="number"
//             placeholder="จำนวนผู้เข้าร่วมสูงสุด"
//             value={formData.maxParticipants}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 maxParticipants: parseInt(e.target.value, 10),
//               })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <select
//             value={formData.status}
//             onChange={(e) =>
//               setFormData({ ...formData, status: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           >
//             <option value="open">เปิดลงทะเบียน</option>
//             <option value="closed">ปิดลงทะเบียน</option>
//           </select>
//           <button
//             type="submit"
//             className="w-full bg-blue-600 py-2 rounded text-white hover:bg-blue-500"
//           >
//             {editId ? "อัปเดตกิจกรรม" : "เพิ่มกิจกรรม"}
//           </button>
//         </form>

//         {/* Activity Table */}
//         <table className="w-full bg-gray-800 bg-opacity-80 rounded-lg shadow-lg text-white">
//         <thead className="bg-gray-700">
//   <tr>
//     <th className="p-3 text-center">
//       <div className="flex items-center justify-center gap-2">
//         <CalendarIcon className="h-5 w-5" /> ชื่อกิจกรรม
//       </div>
//     </th>
//     <th className="p-3 text-center">
//       <div className="flex items-center justify-center gap-2">
//         <ClockIcon className="h-5 w-5" /> เวลาเริ่ม
//       </div>
//     </th>
//     <th className="p-3 text-center">
//       <div className="flex items-center justify-center gap-2">
//         <ClockIcon className="h-5 w-5" /> เวลาปิด
//       </div>
//     </th>
//     <th className="p-3 text-center">
//       <div className="flex items-center justify-center gap-2">
//         <MapPinIcon className="h-5 w-5" /> สถานที่
//       </div>
//     </th>
//     <th className="p-3 text-center">
//       <div className="flex items-center justify-center gap-2">
//         <CheckCircleIcon className="h-5 w-5" /> สถานะ
//       </div>
//     </th>
//     <th className="p-3 text-center">การจัดการ</th>
//   </tr>
//           </thead>
//           <tbody>
//             {activities.map((activity) => (
//               <tr
//                 key={activity._id}
//                 className="border-b border-gray-600 hover:bg-gray-700 transition"
//               >
//                 <td className="p-3">{activity.title}</td>
//                 <td className="p-3">
//                   {new Date(activity.time).toLocaleString()}
//                 </td>
//                 <td className="p-3">
//                   {new Date(activity.closeTime).toLocaleString()}
//                 </td>
//                 <td className="p-3">{activity.location}</td>
//                 <td className="p-3">
//                   {activity.status === "open" ? (
//                     <span className="text-green-400">เปิด</span>
//                   ) : (
//                     <span className="text-red-400">ปิด</span>
//                   )}
//                 </td>
//                 <td className="p-3 flex gap-2">
//                   <button
//                     onClick={() => loadEditData(activity)}
//                     className="bg-blue-500 py-1 px-3 rounded text-white hover:bg-blue-400 flex items-center gap-2"
//                   >
//                     <PencilIcon className="h-5 w-5" /> แก้ไข
//                   </button>
//                   <button
//                     onClick={() => deleteActivity(activity._id)}
//                     className="bg-red-500 py-1 px-3 rounded text-white hover:bg-red-400 flex items-center gap-2"
//                   >
//                     <TrashIcon className="h-5 w-5" /> ลบ
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { PencilIcon, TrashIcon, CalendarIcon, MapPinIcon, ClockIcon} from "@heroicons/react/24/outline";
// import { CheckCircleIcon } from "@heroicons/react/24/outline";
// import Swal from "sweetalert2";

// interface Activity {
//   _id: string;
//   title: string;
//   description: string;
//   time: string;
//   closeTime: string;
//   location: string;
//   maxParticipants: number;
//   status: string;
//   participants: Array<{
//     fullName: string;
//     studentId: string;
//     year: string;
//     phone: string;
//   }>;
// }

// export default function AdminActivities() {
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     time: "",
//     closeTime: "",
//     location: "",
//     maxParticipants: 0,
//     status: "open",
//   });
//   const [editId, setEditId] = useState<string | null>(null);

//   async function fetchActivities() {
//     try {
//       const res = await fetch("/api/activities");
//       if (!res.ok) throw new Error("Failed to fetch activities");
//       const data: Activity[] = await res.json();
//       setActivities(data);
//     } catch (error) {
//       console.error("Error fetching activities:", error);
//     }
//   }

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     const method = editId ? "PUT" : "POST";
//     const body = JSON.stringify(editId ? { id: editId, updates: formData } : formData);

//     try {
//       const res = await fetch("/api/activities", {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body,
//       });

//       if (res.ok) {
//         Swal.fire({
//           icon: "success",
//           title: editId ? "อัปเดตกิจกรรมสำเร็จ!" : "สร้างกิจกรรมสำเร็จ!",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//         fetchActivities();
//         resetForm();
//       } else {
//         const errorData = await res.json();
//         Swal.fire({
//           icon: "error",
//           title: "เกิดข้อผิดพลาด",
//           text: errorData.message || "ไม่สามารถดำเนินการได้",
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "เกิดข้อผิดพลาด",
//         text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
//       });
//       console.error("Error submitting activity:", error);
//     }
//   }

//   function loadEditData(activity: Activity) {
//     setFormData({
//       title: activity.title,
//       description: activity.description,
//       time: activity.time,
//       closeTime: activity.closeTime,
//       location: activity.location,
//       maxParticipants: activity.maxParticipants,
//       status: activity.status,
//     });
//     setEditId(activity._id);
//   }

//   async function deleteActivity(id: string) {
//     const confirmDelete = await Swal.fire({
//       title: "คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "ลบ",
//       cancelButtonText: "ยกเลิก",
//     });

//     if (!confirmDelete.isConfirmed) return;

//     try {
//       const res = await fetch("/api/activities", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });

//       if (res.ok) {
//         Swal.fire({
//           icon: "success",
//           title: "ลบกิจกรรมสำเร็จ!",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//         fetchActivities();
//       } else {
//         Swal.fire({
//           icon: "error",
//           title: "เกิดข้อผิดพลาด",
//           text: "ไม่สามารถลบกิจกรรมได้",
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "เกิดข้อผิดพลาด",
//         text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
//       });
//       console.error("Error deleting activity:", error);
//     }
//   }

//   function resetForm() {
//     setFormData({
//       title: "",
//       description: "",
//       time: "",
//       closeTime: "",
//       location: "",
//       maxParticipants: 0,
//       status: "open",
//     });
//     setEditId(null);
//   }

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center text-white"
//       style={{ backgroundImage: "url('/img/PC screen 2.png')" }}
//     >
//       <div className="container mx-auto py-8">
    

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="bg-gray-800 bg-opacity-80 p-6 rounded-lg mb-8 shadow-lg max-w-2xl mx-auto"
//         >
//           <h2 className="text-xl font-bold mb-4 text-center">
//             {editId ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}
//           </h2>
//           <input
//             type="text"
//             placeholder="ชื่อกิจกรรม"
//             value={formData.title}
//             onChange={(e) =>
//               setFormData({ ...formData, title: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <textarea
//             placeholder="รายละเอียดกิจกรรม"
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <input
//             type="datetime-local"
//             placeholder="วันเวลาเริ่มกิจกรรม"
//             value={formData.time}
//             onChange={(e) =>
//               setFormData({ ...formData, time: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <input
//             type="datetime-local"
//             placeholder="วันเวลาปิดกิจกรรม"
//             value={formData.closeTime}
//             onChange={(e) =>
//               setFormData({ ...formData, closeTime: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <input
//             type="text"
//             placeholder="สถานที่"
//             value={formData.location}
//             onChange={(e) =>
//               setFormData({ ...formData, location: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <input
//             type="number"
//             placeholder="จำนวนผู้เข้าร่วมสูงสุด"
//             value={formData.maxParticipants}
//             onChange={(e) =>
//               setFormData({
//                 ...formData,
//                 maxParticipants: parseInt(e.target.value, 10),
//               })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           />
//           <select
//             value={formData.status}
//             onChange={(e) =>
//               setFormData({ ...formData, status: e.target.value })
//             }
//             className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
//           >
//             <option value="open">เปิดลงทะเบียน</option>
//             <option value="closed">ปิดลงทะเบียน</option>
//           </select>
//           <button
//             type="submit"
//             className="w-full bg-orange-700 py-2 rounded text-white hover:bg-blue-500"
//           >
//             {editId ? "อัปเดตกิจกรรม" : "เพิ่มกิจกรรม"}
//           </button>
//         </form>

//         {/* Activity Table */}
//         <table className="w-full bg-gray-800 bg-opacity-80 rounded-lg shadow-lg text-white">
//         <thead className="bg-gray-700">
//   <tr>
//     <th className="p-3 text-center">
//       <div className="flex items-center justify-center gap-2">
//         <CalendarIcon className="h-5 w-5" /> ชื่อกิจกรรม
//       </div>
//     </th>
//     <th className="p-3 text-center">
//       <div className="flex items-center justify-center gap-2">
//         <ClockIcon className="h-5 w-5" /> เวลาเปิด
//       </div>
//     </th>
//     <th className="p-3 text-center">
//       <div className="flex items-center justify-center gap-2">
//         <ClockIcon className="h-5 w-5" /> เวลาปิด
//       </div>
//     </th>
//     <th className="p-3 text-center">
//       <div className="flex items-center justify-center gap-2">
//         <MapPinIcon className="h-5 w-5" /> สถานที่
//       </div>
//     </th>
//     <th className="p-3 text-center">
//       <div className="flex items-center justify-center gap-2">
//         <CheckCircleIcon className="h-5 w-5" /> สถานะ
//       </div>
//     </th>
//     <th className="p-3 text-center">การจัดการ</th>
//   </tr>
//           </thead>
//           <tbody>
//             {activities.map((activity) => (
//               <tr
//                 key={activity._id}
//                 className="border-b border-gray-600 hover:bg-gray-700 transition"
//               >
//                 <td className="p-3">{activity.title}</td>
//                 <td className="p-3">
//                   {new Date(activity.time).toLocaleString()}
//                 </td>
//                 <td className="p-3">
//                   {new Date(activity.closeTime).toLocaleString()}
//                 </td>
//                 <td className="p-3">{activity.location}</td>
//                 <td className="p-3">
//                   {activity.status === "open" ? (
//                     <span className="text-green-400">เปิด</span>
//                   ) : (
//                     <span className="text-red-400">ปิด</span>
//                   )}
//                 </td>
//                 <td className="p-3 flex gap-2">
//                   <button
//                     onClick={() => loadEditData(activity)}
//                     className="bg-blue-500 py-1 px-3 rounded text-white hover:bg-blue-400 flex items-center gap-2"
//                   >
//                     <PencilIcon className="h-5 w-5" /> แก้ไข
//                   </button>
//                   <button
//                     onClick={() => deleteActivity(activity._id)}
//                     className="bg-red-500 py-1 px-3 rounded text-white hover:bg-red-400 flex items-center gap-2"
//                   >
//                     <TrashIcon className="h-5 w-5" /> ลบ
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, CalendarIcon, MapPinIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

interface Activity {
  _id: string;
  title: string;
  description: string;
  time: string;
  closeTime: string;
  location: string;
  maxParticipants: number;
  status: string;
  participants: Array<{
    fullName: string;
    studentId: string;
    year: string;
    phone: string;
  }>;
}

export default function AdminActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    time: "",
    closeTime: "",
    location: "",
    maxParticipants: 0,
    status: "open",
  });
  const [editId, setEditId] = useState<string | null>(null);

  async function fetchActivities() {
    try {
      const res = await fetch("/api/activities");
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data: Activity[] = await res.json();
      setActivities(data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const method = editId ? "PUT" : "POST";
    const body = JSON.stringify(editId ? { id: editId, updates: formData } : formData);

    try {
      const res = await fetch("/api/activities", {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: editId ? "อัปเดตกิจกรรมสำเร็จ!" : "สร้างกิจกรรมสำเร็จ!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchActivities();
        resetForm();
      } else {
        const errorData = await res.json();
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: errorData.message || "ไม่สามารถดำเนินการได้",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
      });
      console.error("Error submitting activity:", error);
    }
  }

  function loadEditData(activity: Activity) {
    setFormData({
      title: activity.title,
      description: activity.description,
      time: activity.time,
      closeTime: activity.closeTime,
      location: activity.location,
      maxParticipants: activity.maxParticipants,
      status: activity.status,
    });
    setEditId(activity._id);
  }

  async function deleteActivity(id: string) {
    const confirmDelete = await Swal.fire({
      title: "คุณต้องการลบกิจกรรมนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirmDelete.isConfirmed) return;

    try {
      const res = await fetch("/api/activities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "ลบกิจกรรมสำเร็จ!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchActivities();
      } else {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถลบกิจกรรมได้",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์",
      });
      console.error("Error deleting activity:", error);
    }
  }

  function showParticipants(participants: Activity["participants"]) {
    if (participants.length === 0) {
      Swal.fire({
        title: "ไม่มีผู้ลงทะเบียน",
        text: "กิจกรรมนี้ยังไม่มีผู้ลงทะเบียน",
        icon: "info",
      });
      return;
    }

    const participantList = participants
      .map(
        (p, index) =>
          `${index + 1}. ${p.fullName} (${p.studentId}) ชั้นปี: ${p.year} เบอร์โทร: ${p.phone}`
      )
      .join("\n");

    Swal.fire({
      title: "รายชื่อผู้ลงทะเบียน",
      text: participantList,
      icon: "info",
      customClass: {
        popup: "text-left",
      },
    });
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      time: "",
      closeTime: "",
      location: "",
      maxParticipants: 0,
      status: "open",
    });
    setEditId(null);
  }

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/img/PC screen 2.png')" }}
    >
      <div className="container mx-auto py-8">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 bg-opacity-80 p-6 rounded-lg mb-8 shadow-lg max-w-2xl mx-auto"
        >
          <h2 className="text-xl font-bold mb-4 text-center">
            {editId ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}
          </h2>
          <input
            type="text"
            placeholder="ชื่อกิจกรรม"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          />
          <textarea
            placeholder="รายละเอียดกิจกรรม"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="datetime-local"
            placeholder="วันเวลาเริ่มกิจกรรม"
            value={formData.time}
            onChange={(e) =>
              setFormData({ ...formData, time: e.target.value })
            }
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="datetime-local"
            placeholder="วันเวลาปิดกิจกรรม"
            value={formData.closeTime}
            onChange={(e) =>
              setFormData({ ...formData, closeTime: e.target.value })
            }
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="สถานที่"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          />
          <input
            type="number"
            placeholder="จำนวนผู้เข้าร่วมสูงสุด"
            value={formData.maxParticipants}
            onChange={(e) =>
              setFormData({
                ...formData,
                maxParticipants: parseInt(e.target.value, 10),
              })
            }
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          />
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          >
            <option value="open">เปิดลงทะเบียน</option>
            <option value="closed">ปิดลงทะเบียน</option>
          </select>
          <button
            type="submit"
            className="w-full bg-orange-700 py-2 rounded text-white hover:bg-blue-500"
          >
            {editId ? "อัปเดตกิจกรรม" : "เพิ่มกิจกรรม"}
          </button>
        </form>

        {/* Activity Table */}
        <table className="w-full bg-gray-800 bg-opacity-80 rounded-lg shadow-lg text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <CalendarIcon className="h-5 w-5" /> ชื่อกิจกรรม
                </div>
              </th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <ClockIcon className="h-5 w-5" /> เวลาเปิด
                </div>
              </th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <ClockIcon className="h-5 w-5" /> เวลาปิด
                </div>
              </th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <MapPinIcon className="h-5 w-5" /> สถานที่
                </div>
              </th>
              <th className="p-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" /> สถานะ
                </div>
              </th>
              <th className="p-3 text-center">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr
                key={activity._id}
                className="border-b border-gray-600 hover:bg-gray-700 transition"
              >
                <td className="p-3">{activity.title}</td>
                <td className="p-3">
                  {new Date(activity.time).toLocaleString()}
                </td>
                <td className="p-3">
                  {new Date(activity.closeTime).toLocaleString()}
                </td>
                <td className="p-3">{activity.location}</td>
                <td className="p-3">
                  {activity.status === "open" ? (
                    <span className="text-green-400">เปิด</span>
                  ) : (
                    <span className="text-red-400">ปิด</span>
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => loadEditData(activity)}
                    className="bg-blue-500 py-1 px-3 rounded text-white hover:bg-blue-400 flex items-center gap-2"
                  >
                    <PencilIcon className="h-5 w-5" /> แก้ไข
                  </button>
                  <button
                    onClick={() => deleteActivity(activity._id)}
                    className="bg-red-500 py-1 px-3 rounded text-white hover:bg-red-400 flex items-center gap-2"
                  >
                    <TrashIcon className="h-5 w-5" /> ลบ
                  </button>
                  <button
                    onClick={() => showParticipants(activity.participants)}
                    className="bg-green-500 py-1 px-3 rounded text-white hover:bg-green-400 flex items-center gap-2"
                  >
                    <CheckCircleIcon className="h-5 w-5" /> ดูรายชื่อ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
