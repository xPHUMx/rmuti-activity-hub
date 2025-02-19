
// "use client";

// import { useEffect, useState } from "react";
// import { PencilIcon, TrashIcon, CalendarIcon, MapPinIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
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

//   function showParticipants(participants: Activity["participants"]) {
//     if (participants.length === 0) {
//       Swal.fire({
//         title: "ไม่มีผู้ลงทะเบียน",
//         text: "กิจกรรมนี้ยังไม่มีผู้ลงทะเบียน",
//         icon: "info",
//       });
//       return;
//     }

//     const participantList = participants
//       .map(
//         (p, index) =>
//           `${index + 1}. ${p.fullName} (${p.studentId}) ชั้นปี: ${p.year} เบอร์โทร: ${p.phone}`
//       )
//       .join("\n");

//     Swal.fire({
//       title: "รายชื่อผู้ลงทะเบียน",
//       text: participantList,
//       icon: "info",
//       customClass: {
//         popup: "text-left",
//       },
//     });
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
//       style={{ backgroundImage: "url('/img/PC screen 1.png')" }}
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
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <CalendarIcon className="h-5 w-5" /> ชื่อกิจกรรม
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <ClockIcon className="h-5 w-5" /> เวลาเปิด
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <ClockIcon className="h-5 w-5" /> เวลาปิด
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <MapPinIcon className="h-5 w-5" /> สถานที่
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <CheckCircleIcon className="h-5 w-5" /> สถานะ
//                 </div>
//               </th>
//               <th className="p-3 text-center">การจัดการ</th>
//             </tr>
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
//                   <button
//                     onClick={() => showParticipants(activity.participants)}
//                     className="bg-green-500 py-1 px-3 rounded text-white hover:bg-green-400 flex items-center gap-2"
//                   >
//                     <CheckCircleIcon className="h-5 w-5" /> ดูรายชื่อ
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
// import { PencilIcon, TrashIcon, CalendarIcon, MapPinIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
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

//   async function handleSubmit(formData: any) {
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
//         setEditId(null); // Reset after submit
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

//   // ฟังก์ชันเพื่อเปิด Pop-up เพิ่มกิจกรรม
//   async function showAddActivityPopup() {
//     const { value: formValues } = await Swal.fire({
//       title: editId ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม",
//       html: `
//         <input id="title" class="swal2-input" placeholder="ชื่อกิจกรรม" value="${editId ? activities.find(a => a._id === editId)?.title : ''}" />
//         <textarea id="description" class="swal2-input" placeholder="รายละเอียดกิจกรรม">${editId ? activities.find(a => a._id === editId)?.description : ''}</textarea>
//         <input type="datetime-local" id="time" class="swal2-input" placeholder="วันเวลาเริ่มกิจกรรม" value="${editId ? new Date(activities.find(a => a._id === editId)?.time || '').toISOString().slice(0, 16) : ''}" />
//         <input type="datetime-local" id="closeTime" class="swal2-input" placeholder="วันเวลาปิดกิจกรรม" value="${editId ? new Date(activities.find(a => a._id === editId)?.closeTime || '').toISOString().slice(0, 16) : ''}" />
//         <input id="location" class="swal2-input" placeholder="สถานที่" value="${editId ? activities.find(a => a._id === editId)?.location : ''}" />
//         <input type="number" id="maxParticipants" class="swal2-input" placeholder="จำนวนผู้เข้าร่วมสูงสุด" value="${editId ? activities.find(a => a._id === editId)?.maxParticipants : ''}" />
//         <select id="status" class="swal2-input">
//           <option value="open" ${editId && activities.find(a => a._id === editId)?.status === "open" ? 'selected' : ''}>เปิดลงทะเบียน</option>
//           <option value="closed" ${editId && activities.find(a => a._id === editId)?.status === "closed" ? 'selected' : ''}>ปิดลงทะเบียน</option>
//         </select>
//       `,
//       focusConfirm: false,
//       preConfirm: () => {
//         return {
//           title: (document.getElementById("title") as HTMLInputElement)?.value,
//           description: (document.getElementById("description") as HTMLTextAreaElement)?.value,
//           time: (document.getElementById("time") as HTMLInputElement)?.value,
//           closeTime: (document.getElementById("closeTime") as HTMLInputElement)?.value,
//           location: (document.getElementById("location") as HTMLInputElement)?.value,
//           maxParticipants: parseInt((document.getElementById("maxParticipants") as HTMLInputElement).value),
//           status: (document.getElementById("status") as HTMLSelectElement)?.value,
//         };
//       }
//     });
  
//     if (formValues) {
//       handleSubmit(formValues);
//     }
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

//   function showParticipants(participants: Activity["participants"]) {
//     if (participants.length === 0) {
//       Swal.fire({
//         title: "ไม่มีผู้ลงทะเบียน",
//         text: "กิจกรรมนี้ยังไม่มีผู้ลงทะเบียน",
//         icon: "info",
//       });
//       return;
//     }

//     const participantList = participants
//       .map(
//         (p, index) =>
//           `${index + 1}. ${p.fullName} (${p.studentId}) ชั้นปี: ${p.year} เบอร์โทร: ${p.phone}`
//       )
//       .join("\n");

//     Swal.fire({
//       title: "รายชื่อผู้ลงทะเบียน",
//       text: participantList,
//       icon: "info",
//       customClass: {
//         popup: "text-left",
//       },
//     });
//   }

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center text-white"
//       style={{ backgroundImage: "url('/img/PC screen 1.png')" }}
//     >
//       <div className="container mx-auto py-8">
//         {/* ปุ่มเพิ่มกิจกรรม */}
//         <button
//           onClick={showAddActivityPopup}
//           className="w-full bg-green-600 py-2 rounded text-white hover:bg-blue-500 mb-8"
//         >
//           เพิ่มกิจกรรม
//         </button>

//         {/* Activity Table */}
//         <table className="w-full bg-gray-800 bg-opacity-80 rounded-lg shadow-lg text-white">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <CalendarIcon className="h-5 w-5" /> ชื่อกิจกรรม
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <ClockIcon className="h-5 w-5" /> เวลาเปิด
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <ClockIcon className="h-5 w-5" /> เวลาปิด
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <MapPinIcon className="h-5 w-5" /> สถานที่
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <CheckCircleIcon className="h-5 w-5" /> สถานะ
//                 </div>
//               </th>
//               <th className="p-3 text-center">การจัดการ</th>
//             </tr>
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
//                   <span
//                     className={`${
//                       activity.status === "open"
//                         ? "bg-green-500"
//                         : "bg-red-500"
//                     } text-white py-1 px-3 rounded-full`}
//                   >
//                     {activity.status === "open" ? "เปิดลงทะเบียน" : "ปิดลงทะเบียน"}
//                   </span>
//                 </td>
//                 <td className="p-3 flex justify-center gap-4">
//                   <button
//                     onClick={() => {
//                       setEditId(activity._id);
//                       showAddActivityPopup();
//                     }}
//                   >
//                     <PencilIcon className="h-6 w-6 text-blue-500 hover:text-blue-700" />
//                   </button>
//                   <button
//                     onClick={() => deleteActivity(activity._id)}
//                   >
//                     <TrashIcon className="h-6 w-6 text-red-500 hover:text-red-700" />
//                   </button>
//                   <button
//                     onClick={() => showParticipants(activity.participants)}
//                   >
//                     <CheckCircleIcon className="h-6 w-6 text-green-500 hover:text-green-700" />
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
// import { PencilIcon, TrashIcon, CalendarIcon, MapPinIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
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

//   async function handleSubmit(formData: any) {
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
//         setEditId(null); // Reset after submit
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

//   // ฟังก์ชันเพื่อเปิด Pop-up เพิ่มกิจกรรม
//   async function showAddActivityPopup() {
//     const { value: formValues } = await Swal.fire({
//       title: "เพิ่มกิจกรรม",
//       html: `
//         <input id="title" class="swal2-input" placeholder="ชื่อกิจกรรม" />
//         <textarea id="description" class="swal2-input" placeholder="รายละเอียดกิจกรรม"></textarea>
//         <input type="datetime-local" id="time" class="swal2-input" placeholder="วันเวลาเริ่มกิจกรรม" />
//         <input type="datetime-local" id="closeTime" class="swal2-input" placeholder="วันเวลาปิดกิจกรรม" />
//         <input id="location" class="swal2-input" placeholder="สถานที่" />
//         <input type="number" id="maxParticipants" class="swal2-input" placeholder="จำนวนผู้เข้าร่วมสูงสุด" />
//         <select id="status" class="swal2-input">
//           <option value="open">เปิดลงทะเบียน</option>
//           <option value="closed">ปิดลงทะเบียน</option>
//         </select>
//       `,
//       focusConfirm: false,
//       preConfirm: () => {
//         return {
//           title: (document.getElementById("title") as HTMLInputElement)?.value,
//           description: (document.getElementById("description") as HTMLTextAreaElement)?.value,
//           time: (document.getElementById("time") as HTMLInputElement)?.value,
//           closeTime: (document.getElementById("closeTime") as HTMLInputElement)?.value,
//           location: (document.getElementById("location") as HTMLInputElement)?.value,
//           maxParticipants: parseInt((document.getElementById("maxParticipants") as HTMLInputElement).value),
//           status: (document.getElementById("status") as HTMLSelectElement)?.value,
//         };
//       }
//     });

//     if (formValues) {
//       handleSubmit(formValues);
//     }
//   }

//   // ฟังก์ชันเพื่อเปิด Pop-up แก้ไขกิจกรรม
//   async function showEditActivityPopup(activity: Activity) {
//     const { value: formValues } = await Swal.fire({
//       title: "แก้ไขกิจกรรม",
//       html: `
//         <input id="title" class="swal2-input" placeholder="ชื่อกิจกรรม" value="${activity.title}" />
//         <textarea id="description" class="swal2-input" placeholder="รายละเอียดกิจกรรม">${activity.description}</textarea>
//         <input type="datetime-local" id="time" class="swal2-input" placeholder="วันเวลาเริ่มกิจกรรม" value="${new Date(activity.time).toISOString().slice(0, 16)}" />
//         <input type="datetime-local" id="closeTime" class="swal2-input" placeholder="วันเวลาปิดกิจกรรม" value="${new Date(activity.closeTime).toISOString().slice(0, 16)}" />
//         <input id="location" class="swal2-input" placeholder="สถานที่" value="${activity.location}" />
//         <input type="number" id="maxParticipants" class="swal2-input" placeholder="จำนวนผู้เข้าร่วมสูงสุด" value="${activity.maxParticipants}" />
//         <select id="status" class="swal2-input">
//           <option value="open" ${activity.status === "open" ? 'selected' : ''}>เปิดลงทะเบียน</option>
//           <option value="closed" ${activity.status === "closed" ? 'selected' : ''}>ปิดลงทะเบียน</option>
//         </select>
//       `,
//       focusConfirm: false,
//       preConfirm: () => {
//         return {
//           title: (document.getElementById("title") as HTMLInputElement)?.value,
//           description: (document.getElementById("description") as HTMLTextAreaElement)?.value,
//           time: (document.getElementById("time") as HTMLInputElement)?.value,
//           closeTime: (document.getElementById("closeTime") as HTMLInputElement)?.value,
//           location: (document.getElementById("location") as HTMLInputElement)?.value,
//           maxParticipants: parseInt((document.getElementById("maxParticipants") as HTMLInputElement).value),
//           status: (document.getElementById("status") as HTMLSelectElement)?.value,
//         };
//       }
//     });

//     if (formValues) {
//       setEditId(activity._id);
//       handleSubmit(formValues);
//     }
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

//   // ฟังก์ชันดาวน์โหลดรายชื่อผู้ลงทะเบียนเป็น CSV
//   function downloadParticipants(participants: Activity["participants"]) {
//     if (participants.length === 0) {
//       Swal.fire({
//         title: "ไม่มีผู้ลงทะเบียน",
//         text: "กิจกรรมนี้ยังไม่มีผู้ลงทะเบียน",
//         icon: "info",
//       });
//       return;
//     }

//     const csvHeader = "ลำดับ,ชื่อ,รหัสนักศึกษา,ชั้นปี,เบอร์โทร\n";
    
//     const csvContent = participants
//       .map(
//         (p, index) =>
//           `${index + 1},${p.fullName},${p.studentId},${p.year},${p.phone}`
//       )
//       .join("\n");

//     const csvFile = csvHeader + csvContent;

//     const blob = new Blob([csvFile], { type: "text/csv" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "participants.csv";
//     link.click();
//   }

// function showParticipants(participants: Activity["participants"]) {
//   if (participants.length === 0) {
//     Swal.fire({
//       title: "ไม่มีผู้ลงทะเบียน",
//       text: "กิจกรรมนี้ยังไม่มีผู้ลงทะเบียน",
//       icon: "info",
//     });
//     return;
//   }

//   const participantList = participants
//     .map(
//       (p, index) =>
//         `${index + 1}. ${p.fullName} (${p.studentId}) ชั้นปี: ${p.year} เบอร์โทร: ${p.phone}`
//     )
//     .join("\n");

//   Swal.fire({
//     title: "รายชื่อผู้ลงทะเบียน",
//     text: participantList,
//     icon: "info",
//     customClass: {
//       popup: "text-left",
//     },
//   });
// }


//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center text-white"
//       style={{ backgroundImage: "url('/img/PC screen 1.png')" }}
//     >
//       <div className="container mx-auto py-8">
//         {/* ปุ่มเพิ่มกิจกรรม */}
//         <button
//           onClick={showAddActivityPopup}
//           className="w-full bg-green-600 py-2 rounded text-white hover:bg-blue-500 mb-8"
//         >
//           เพิ่มกิจกรรม
//         </button>

//         {/* Activity Table */}
//         <table className="w-full bg-gray-800 bg-opacity-80 rounded-lg shadow-lg text-white">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <CalendarIcon className="h-5 w-5" /> ชื่อกิจกรรม
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <ClockIcon className="h-5 w-5" /> เวลาเปิด
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <ClockIcon className="h-5 w-5" /> เวลาปิด
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <MapPinIcon className="h-5 w-5" /> สถานที่
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <CheckCircleIcon className="h-5 w-5" /> สถานะ
//                 </div>
//               </th>
//               <th className="p-3 text-center">การจัดการ</th>
//             </tr>
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
//                   <span
//                     className={`${
//                       activity.status === "open"
//                         ? "bg-green-500"
//                         : "bg-red-500"
//                     } text-white py-1 px-3 rounded-full`}
//                   >
//                     {activity.status === "open" ? "เปิดลงทะเบียน" : "ปิดลงทะเบียน"}
//                   </span>
//                 </td>
//                 <td className="p-3 flex justify-center gap-4">
//                   <button
//                     onClick={() => showEditActivityPopup(activity)}
//                   >
//                     <PencilIcon className="h-6 w-6 text-blue-500 hover:text-blue-700" />
//                   </button>
//                   <button
//                     onClick={() => deleteActivity(activity._id)}
//                   >
//                     <TrashIcon className="h-6 w-6 text-red-500 hover:text-red-700" />
//                   </button>
//                   <button
//                     onClick={() => showParticipants(activity.participants)}
//                   >
//                     <CheckCircleIcon className="h-6 w-6 text-green-500 hover:text-green-700" />
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
// import { PencilIcon, TrashIcon, CalendarIcon, MapPinIcon, ClockIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
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

//   async function handleSubmit(formData: any) {
//     // ตรวจสอบว่า editId มีค่าเป็นกิจกรรมที่แก้ไขอยู่หรือไม่
//     if (editId === null) {
//       Swal.fire({
//         icon: "error",
//         title: "ไม่มีการเลือกกิจกรรมที่จะแก้ไข",
//         text: "กรุณาเลือกกิจกรรมที่ต้องการแก้ไขก่อน",
//       });
//       return;
//     }
  
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
//         setEditId(null); // Reset after submit
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
  

//   // ฟังก์ชันเพื่อเปิด Pop-up เพิ่มกิจกรรม
//   async function showAddActivityPopup() {
//     const { value: formValues } = await Swal.fire({
//       title: "เพิ่มกิจกรรม",
//       html: `
//         <input id="title" class="swal2-input" placeholder="ชื่อกิจกรรม" />
//         <textarea id="description" class="swal2-input" placeholder="รายละเอียดกิจกรรม"></textarea>
//         <input type="datetime-local" id="time" class="swal2-input" placeholder="วันเวลาเริ่มกิจกรรม" />
//         <input type="datetime-local" id="closeTime" class="swal2-input" placeholder="วันเวลาปิดกิจกรรม" />
//         <input id="location" class="swal2-input" placeholder="สถานที่" />
//         <input type="number" id="maxParticipants" class="swal2-input" placeholder="จำนวนผู้เข้าร่วมสูงสุด" />
//         <select id="status" class="swal2-input">
//           <option value="open">เปิดลงทะเบียน</option>
//           <option value="closed">ปิดลงทะเบียน</option>
//         </select>
//       `,
//       focusConfirm: false,
//       preConfirm: () => {
//         return {
//           title: (document.getElementById("title") as HTMLInputElement)?.value,
//           description: (document.getElementById("description") as HTMLTextAreaElement)?.value,
//           time: (document.getElementById("time") as HTMLInputElement)?.value,
//           closeTime: (document.getElementById("closeTime") as HTMLInputElement)?.value,
//           location: (document.getElementById("location") as HTMLInputElement)?.value,
//           maxParticipants: parseInt((document.getElementById("maxParticipants") as HTMLInputElement).value),
//           status: (document.getElementById("status") as HTMLSelectElement)?.value,
//         };
//       }
//     });

//     if (formValues) {
//       handleSubmit(formValues);
//     }
//   }

//   // ฟังก์ชันเพื่อเปิด Pop-up แก้ไขกิจกรรม
//   async function showEditActivityPopup(activity: Activity) {
//     const { value: formValues } = await Swal.fire({
//       title: "แก้ไขกิจกรรม",
//       html: `
//         <input id="title" class="swal2-input" placeholder="ชื่อกิจกรรม" value="${activity.title}" />
//         <textarea id="description" class="swal2-input" placeholder="รายละเอียดกิจกรรม">${activity.description}</textarea>
//         <input type="datetime-local" id="time" class="swal2-input" placeholder="วันเวลาเริ่มกิจกรรม" value="${new Date(activity.time).toISOString().slice(0, 16)}" />
//         <input type="datetime-local" id="closeTime" class="swal2-input" placeholder="วันเวลาปิดกิจกรรม" value="${new Date(activity.closeTime).toISOString().slice(0, 16)}" />
//         <input id="location" class="swal2-input" placeholder="สถานที่" value="${activity.location}" />
//         <input type="number" id="maxParticipants" class="swal2-input" placeholder="จำนวนผู้เข้าร่วมสูงสุด" value="${activity.maxParticipants}" />
//         <select id="status" class="swal2-input">
//           <option value="open" ${activity.status === "open" ? 'selected' : ''}>เปิดลงทะเบียน</option>
//           <option value="closed" ${activity.status === "closed" ? 'selected' : ''}>ปิดลงทะเบียน</option>
//         </select>
//       `,
//       focusConfirm: false,
//       preConfirm: () => {
//         return {
//           title: (document.getElementById("title") as HTMLInputElement)?.value,
//           description: (document.getElementById("description") as HTMLTextAreaElement)?.value,
//           time: (document.getElementById("time") as HTMLInputElement)?.value,
//           closeTime: (document.getElementById("closeTime") as HTMLInputElement)?.value,
//           location: (document.getElementById("location") as HTMLInputElement)?.value,
//           maxParticipants: parseInt((document.getElementById("maxParticipants") as HTMLInputElement).value),
//           status: (document.getElementById("status") as HTMLSelectElement)?.value,
//         };
//       }
//     });
  
//     if (formValues) {
//       setEditId(activity._id); // Set the edit ID correctly
//       handleSubmit(formValues); // Call handleSubmit to update activity
//     }
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

//   // ฟังก์ชันดาวน์โหลดรายชื่อผู้ลงทะเบียนเป็น CSV
//   function downloadParticipants(participants: Activity["participants"]) {
//     if (participants.length === 0) {
//       Swal.fire({
//         title: "ไม่มีผู้ลงทะเบียน",
//         text: "กิจกรรมนี้ยังไม่มีผู้ลงทะเบียน",
//         icon: "info",
//       });
//       return;
//     }
  
//     const csvHeader = "ลำดับ,ชื่อ,รหัสนักศึกษา,ชั้นปี,เบอร์โทร\n";
    
//     const csvContent = participants
//       .map(
//         (p, index) =>
//           `${index + 1},${p.fullName},${p.studentId},${p.year},${p.phone}`
//       )
//       .join("\n");
  
//     const csvFile = csvHeader + csvContent;
  
//     // สร้าง Blob โดยใช้ UTF-8 BOM เพื่อรองรับภาษาไทยใน Excel
//     const bom = "\uFEFF";  // BOM สำหรับ UTF-8
//     const blob = new Blob([bom + csvFile], { type: "text/csv;charset=utf-8;" }); // ตั้งค่าให้รองรับ UTF-8
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "participants.csv";
//     link.click();
//   }

//   function showParticipants(participants: Activity["participants"]) {
//     if (participants.length === 0) {
//       Swal.fire({
//         title: "ไม่มีผู้ลงทะเบียน",
//         text: "กิจกรรมนี้ยังไม่มีผู้ลงทะเบียน",
//         icon: "info",
//       });
//       return;
//     }

//     const participantList = participants
//       .map(
//         (p, index) =>
//           `${index + 1}. ${p.fullName} (${p.studentId}) ชั้นปี: ${p.year} เบอร์โทร: ${p.phone}`
//       )
//       .join("\n");

//     Swal.fire({
//       title: "รายชื่อผู้ลงทะเบียน",
//       text: participantList,
//       icon: "info",
//       customClass: {
//         popup: "text-left",
//       },
//     });
//   }

//   useEffect(() => {
//     fetchActivities();
//   }, []);

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center text-white"
//       style={{ backgroundImage: "url('/img/PC screen 1.png')" }}
//     >
//       <div className="container mx-auto py-8">
//         {/* ปุ่มเพิ่มกิจกรรม */}
//         <button
//           onClick={showAddActivityPopup}
//           className="w-full bg-green-600 py-2 rounded text-white hover:bg-blue-500 mb-8"
//         >
//           เพิ่มกิจกรรม
//         </button>

//         {/* Activity Table */}
//         <table className="w-full bg-gray-800 bg-opacity-80 rounded-lg shadow-lg text-white">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <CalendarIcon className="h-5 w-5" /> ชื่อกิจกรรม
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <ClockIcon className="h-5 w-5" /> เวลาเปิด
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <ClockIcon className="h-5 w-5" /> เวลาปิด
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <MapPinIcon className="h-5 w-5" /> สถานที่
//                 </div>
//               </th>
//               <th className="p-3 text-center">
//                 <div className="flex items-center justify-center gap-2">
//                   <CheckCircleIcon className="h-5 w-5" /> สถานะ
//                 </div>
//               </th>
//               <th className="p-3 text-center">การจัดการ</th>
//             </tr>
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
//                   <span
//                     className={`${
//                       activity.status === "open"
//                         ? "bg-green-500"
//                         : "bg-red-500"
//                     } text-white py-1 px-3 rounded-full`}
//                   >
//                     {activity.status === "open" ? "เปิดลงทะเบียน" : "ปิดลงทะเบียน"}
//                   </span>
//                 </td>
//                 <td className="p-3 flex justify-center gap-4">
//                   <button
//                     onClick={() => showEditActivityPopup(activity)}
//                   >
//                     <PencilIcon className="h-6 w-6 text-blue-500 hover:text-blue-700" />
//                   </button>
//                   <button
//                     onClick={() => deleteActivity(activity._id)}
//                   >
//                     <TrashIcon className="h-6 w-6 text-red-500 hover:text-red-700" />
//                   </button>
//                   <button
//                     onClick={() => showParticipants(activity.participants)}
//                   >
//                     <CheckCircleIcon className="h-6 w-6 text-green-500 hover:text-green-700" />
//                   </button>
//                   <button
//                     onClick={() => downloadParticipants(activity.participants)}
//                   >
//                     ดาวน์โหลดรายชื่อ
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

  // ฟังก์ชันสำหรับการสร้างกิจกรรมใหม่
  async function handleCreateActivity(formData: any) {
    const body = JSON.stringify(formData);

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "สร้างกิจกรรมสำเร็จ!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchActivities();
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

  // ฟังก์ชันสำหรับการแก้ไขกิจกรรม
  async function handleEditActivity(formData: any) {
    if (editId === null) {
      Swal.fire({
        icon: "error",
        title: "ไม่มีการเลือกกิจกรรมที่จะแก้ไข",
        text: "กรุณาเลือกกิจกรรมที่ต้องการแก้ไขก่อน",
      });
      return;
    }

    const body = JSON.stringify({ id: editId, updates: formData });

    try {
      const res = await fetch("/api/activities", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (res.ok) {
        Swal.fire({
          icon: "success",
          title: "อัปเดตกิจกรรมสำเร็จ!",
          showConfirmButton: false,
          timer: 1500,
        });
        fetchActivities();
        setEditId(null); // Reset after submit
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

  // ฟังก์ชันเพื่อเปิด Pop-up เพิ่มกิจกรรม
  async function showAddActivityPopup() {
    const { value: formValues } = await Swal.fire({
      title: "เพิ่มกิจกรรม",
      html: 
        `<input id="title" class="swal2-input" placeholder="ชื่อกิจกรรม" />
        <textarea id="description" class="swal2-input" placeholder="รายละเอียดกิจกรรม"></textarea>
        <input type="datetime-local" id="time" class="swal2-input" placeholder="วันเวลาเริ่มกิจกรรม" />
        <input type="datetime-local" id="closeTime" class="swal2-input" placeholder="วันเวลาปิดกิจกรรม" />
        <input id="location" class="swal2-input" placeholder="สถานที่" />
        <input type="number" id="maxParticipants" class="swal2-input" placeholder="จำนวนผู้เข้าร่วมสูงสุด" />
        <select id="status" class="swal2-input">
          <option value="open">เปิดลงทะเบียน</option>
          <option value="closed">ปิดลงทะเบียน</option>
        </select>`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          title: (document.getElementById("title") as HTMLInputElement)?.value,
          description: (document.getElementById("description") as HTMLTextAreaElement)?.value,
          time: (document.getElementById("time") as HTMLInputElement)?.value,
          closeTime: (document.getElementById("closeTime") as HTMLInputElement)?.value,
          location: (document.getElementById("location") as HTMLInputElement)?.value,
          maxParticipants: parseInt((document.getElementById("maxParticipants") as HTMLInputElement).value),
          status: (document.getElementById("status") as HTMLSelectElement)?.value,
        };
      }
    });

    if (formValues) {
      handleCreateActivity(formValues);
    }
  }

  // ฟังก์ชันเพื่อเปิด Pop-up แก้ไขกิจกรรม
  async function showEditActivityPopup(activity: Activity) {
    const { value: formValues } = await Swal.fire({
      title: "แก้ไขกิจกรรม",
      html: 
        `<input id="title" class="swal2-input" placeholder="ชื่อกิจกรรม" value="${activity.title}" />
        <textarea id="description" class="swal2-input" placeholder="รายละเอียดกิจกรรม">${activity.description}</textarea>
        <input type="datetime-local" id="time" class="swal2-input" placeholder="วันเวลาเริ่มกิจกรรม" value="${new Date(activity.time).toISOString().slice(0, 16)}" />
        <input type="datetime-local" id="closeTime" class="swal2-input" placeholder="วันเวลาปิดกิจกรรม" value="${new Date(activity.closeTime).toISOString().slice(0, 16)}" />
        <input id="location" class="swal2-input" placeholder="สถานที่" value="${activity.location}" />
        <input type="number" id="maxParticipants" class="swal2-input" placeholder="จำนวนผู้เข้าร่วมสูงสุด" value="${activity.maxParticipants}" />
        <select id="status" class="swal2-input">
          <option value="open" ${activity.status === "open" ? 'selected' : ''}>เปิดลงทะเบียน</option>
          <option value="closed" ${activity.status === "closed" ? 'selected' : ''}>ปิดลงทะเบียน</option>
        </select>`,
      focusConfirm: false,
      preConfirm: () => {
        return {
          title: (document.getElementById("title") as HTMLInputElement)?.value,
          description: (document.getElementById("description") as HTMLTextAreaElement)?.value,
          time: (document.getElementById("time") as HTMLInputElement)?.value,
          closeTime: (document.getElementById("closeTime") as HTMLInputElement)?.value,
          location: (document.getElementById("location") as HTMLInputElement)?.value,
          maxParticipants: parseInt((document.getElementById("maxParticipants") as HTMLInputElement).value),
          status: (document.getElementById("status") as HTMLSelectElement)?.value,
        };
      }
    });

    if (formValues) {
      setEditId(activity._id); // Set the edit ID correctly
      handleEditActivity(formValues); // Call handleEditActivity to update activity
    }
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

  // ฟังก์ชันดาวน์โหลดรายชื่อผู้ลงทะเบียนเป็น CSV
  function downloadParticipants(participants: Activity["participants"], activity: Activity) {
    console.log("ชื่อกิจกรรมที่เลือก: ", activity.title); // ตรวจสอบชื่อกิจกรรมในฟังก์ชัน
  
    if (participants.length === 0) {
      Swal.fire({
        title: "ไม่มีผู้ลงทะเบียน",
        text: "กิจกรรมนี้ยังไม่มีผู้ลงทะเบียน",
        icon: "info",
      });
      return;
    }
  
    const csvHeader = "ลำดับ,ชื่อ,รหัสนักศึกษา,ชั้นปี,เบอร์โทร\n";
       
    const csvContent = participants
      .map(
        (p, index) =>
          `${index + 1},${p.fullName},${p.studentId},${p.year},${p.phone}`
      )
      .join("\n");
  
    const csvFile = csvHeader + csvContent;
  
    // สร้าง Blob โดยใช้ UTF-8 BOM เพื่อรองรับภาษาไทยใน Excel
    const bom = "\uFEFF";  // BOM สำหรับ UTF-8
    const blob = new Blob([bom + csvFile], { type: "text/csv;charset=utf-8;" }); // ตั้งค่าให้รองรับ UTF-8
    const link = document.createElement("a");
    
    // ใช้ชื่อกิจกรรมในการตั้งชื่อไฟล์
    const fileName = `${activity.title}_รายชื่อผู้ลงทะเบียน.csv`.replace(/\s+/g, '_'); // แทนที่ช่องว่างด้วย _
    console.log("ชื่อไฟล์ที่กำลังจะดาวน์โหลด: ", fileName); // ตรวจสอบชื่อไฟล์ในคอนโซล
    
    link.href = URL.createObjectURL(blob);
    link.download = fileName; // ตั้งชื่อไฟล์ให้เป็นชื่อกิจกรรม
    link.click();
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

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/img/PC screen 1.png')" }}
    >
      <div className="container mx-auto py-8">
        <button
          onClick={showAddActivityPopup}
          className="w-full bg-green-600 py-2 rounded text-white hover:bg-blue-500 mb-8"
        >
          เพิ่มกิจกรรม
        </button>

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
                  <span
                    className={`${
                      activity.status === "open"
                        ? "bg-green-500"
                        : "bg-red-500"
                    } text-white py-1 px-3 rounded-full`}
                  >
                    {activity.status === "open" ? "เปิดลงทะเบียน" : "ปิดลงทะเบียน"}
                  </span>
                </td>
                <td className="p-3 flex justify-center gap-4">
                  <button
                    onClick={() => showEditActivityPopup(activity)}
                  >
                    <PencilIcon className="h-6 w-6 text-blue-500 hover:text-blue-700" />
                  </button>
                  <button
                    onClick={() => deleteActivity(activity._id)}
                  >
                    <TrashIcon className="h-6 w-6 text-red-500 hover:text-red-700" />
                  </button>
                  <button
                    onClick={() => showParticipants(activity.participants)}
                  >
                    <CheckCircleIcon className="h-6 w-6 text-green-500 hover:text-green-700" />
                  </button>
                  <button onClick={() => downloadParticipants(activity.participants, activity)}>
                    ดาวน์โหลดรายชื่อ
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
