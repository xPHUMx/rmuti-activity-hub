
// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { FaCheckCircle, FaTimesCircle, FaUser, FaPlusCircle, FaCalendarAlt, FaClock, FaList, FaMapMarkerAlt, FaInfoCircle, FaUsers } from "react-icons/fa";
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

// interface Registration {
//   activityId: string;
// }

// export default function RegisterPage() {
//   const { data: session } = useSession();
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [registeredActivities, setRegisteredActivities] = useState<string[]>([]);
//   const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showParticipantsPopup, setShowParticipantsPopup] = useState(false);
//   const [participants, setParticipants] = useState<Activity["participants"]>([]);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     studentId: "",
//     year: "",
//     phone: "",
//   });

//   useEffect(() => {
//     async function fetchActivitiesAndRegistrations() {
//       try {
//         const res = await fetch("/api/activities");
//         if (!res.ok) {
//           throw new Error("Failed to fetch activities");
//         }
//         const activities: Activity[] = await res.json();
//         setActivities(activities);

//         if (session?.user?.id) {
//           const registeredRes = await fetch(
//             `/api/users/registrations?userId=${session.user.id}`
//           );
//           if (!registeredRes.ok) {
//             throw new Error("Failed to fetch registered activities");
//           }
//           const registeredData: Registration[] = await registeredRes.json();
//           setRegisteredActivities(registeredData.map((reg) => reg.activityId));
//         } else {
//           setRegisteredActivities([]);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }

//     fetchActivitiesAndRegistrations();
//   }, [session]);

//   const validateAndConfirm = () => {
//     if (!formData.fullName || !formData.studentId || !formData.year || !formData.phone) {
//       alert("กรุณากรอกข้อมูลให้ครบถ้วน");
//       return;
//     }
//     if (formData.studentId.length !== 12) {
//       alert("รหัสนักศึกษาต้องมี 12 หลัก");
//       return;
//     }
//     if (formData.phone.length !== 10) {
//       alert("เบอร์โทรต้องมี 10 หลัก");
//       return;
//     }
//     handleRegister();
//   };

//   const handleRegister = async () => {
//     if (!selectedActivity || !session?.user?.id) return;

//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           activityId: selectedActivity._id,
//           participant: formData,
//           userId: session.user.id,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         alert(`ลงทะเบียนล้มเหลว: ${errorData.message}`);
//         return;
//       }

//       setRegisteredActivities((prev) => [...prev, selectedActivity._id]);
//       setShowPopup(false);
//       Swal.fire({
//         icon: "success",
//         title: "ลงทะเบียนสำเร็จ!",
//         text: "คุณได้ลงทะเบียนกิจกรรมเรียบร้อยแล้ว",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "ตกลง",
//       });
//       setFormData({ fullName: "", studentId: "", year: "", phone: "" });
//     } catch (error) {
//       console.error("Error registering:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="container mx-auto py-8">
//         <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">ลงทะเบียนกิจกรรม</h1>
//         <table className="w-full bg-gray-800 rounded-lg shadow-lg">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="p-3 text-left"><FaInfoCircle className="inline-block mr-2" />ชื่อกิจกรรม</th>
//               <th className="p-3 text-left"><FaCalendarAlt className="inline-block mr-2" />เวลาเริ่ม</th>
//               <th className="p-3 text-left"><FaClock className="inline-block mr-2" />เวลาปิด</th>
//               <th className="p-3 text-left"><FaUsers className="inline-block mr-2" />จำนวนผู้เข้าร่วม/สูงสุด</th>
//               <th className="p-3 text-left"><FaCheckCircle className="inline-block mr-2" />สถานะ</th>
//               <th className="p-3 text-left"><FaPlusCircle className="inline-block mr-2" />ลงทะเบียน</th>
//               <th className="p-3 text-left"><FaUser className="inline-block mr-2" />รายชื่อผู้เข้าร่วม</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activities.map((activity) => (
//               <tr key={activity._id} className="hover:bg-gray-600">
//                 <td className="p-3">{activity.title}</td>
//                 <td className="p-3">{new Date(activity.time).toLocaleString()}</td>
//                 <td className="p-3">{new Date(activity.closeTime).toLocaleString()}</td>
//                 <td className="p-3">
//                   {activity.participants.length}/{activity.maxParticipants}
//                 </td>
//                 <td className="p-3">
//                   {activity.status === "open" ? (
//                     <span className="flex items-center gap-2 text-green-400">
//                       <FaCheckCircle />
//                       เปิด
//                     </span>
//                   ) : (
//                     <span className="flex items-center gap-2 text-red-400">
//                       <FaTimesCircle />
//                       ปิด
//                     </span>
//                   )}
//                 </td>
//                 <td className="p-3">
//                   {registeredActivities.includes(activity._id) ? (
//                     <span className="flex items-center gap-2 text-gray-400 italic opacity-50">
//                       <FaUser />
//                       ลงทะเบียนแล้ว
//                     </span>
//                   ) : activity.participants.length >= activity.maxParticipants ? (
//                     <span className="flex items-center gap-2 text-red-400 italic">
//                       <FaTimesCircle />
//                       เต็ม
//                     </span>
//                   ) : activity.status === "open" ? (
//                     <button
//                       onClick={() => {
//                         setSelectedActivity(activity);
//                         setShowPopup(true);
//                       }}
//                       className="flex items-center gap-2 bg-blue-500 px-3 py-1 rounded hover:bg-blue-400"
//                     >
//                       <FaPlusCircle />
//                       ลงทะเบียน
//                     </button>
//                   ) : (
//                     <span className="text-gray-400">ปิด</span>
//                   )}
//                 </td>
//                 <td className="p-3">
//                   <button
//                     onClick={() => {
//                       setSelectedActivity(activity);
//                       setParticipants(activity.participants);
//                       setShowParticipantsPopup(true);
//                     }}
//                     className="flex items-center gap-2 bg-green-500 px-3 py-1 rounded hover:bg-green-400"
//                   >
//                     <FaUser />
//                     ดูรายชื่อ
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Popups */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-2xl font-bold mb-4 text-blue-400">กรอกข้อมูลลงทะเบียน</h2>
//             <input
//               type="text"
//               placeholder="ชื่อ-นามสกุล"
//               value={formData.fullName}
//               onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//               className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <input
//               type="text"
//               placeholder="รหัสนักศึกษา"
//               value={formData.studentId}
//               onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
//               className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <input
//               type="text"
//               placeholder="ชั้นปี"
//               value={formData.year}
//               onChange={(e) => setFormData({ ...formData, year: e.target.value })}
//               className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <input
//               type="text"
//               placeholder="เบอร์โทร"
//               value={formData.phone}
//               onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//               className="w-full mb-3 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//             <div className="flex justify-end gap-4">
//               <button onClick={() => setShowPopup(false)} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
//                 ยกเลิก
//               </button>
//               <button onClick={validateAndConfirm} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500">
//                 ลงทะเบียน
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showParticipantsPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-h-96 overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-4 text-blue-400">รายชื่อผู้เข้าร่วม</h2>
//             <ul className="space-y-2">
//               {participants.map((participant, index) => (
//                 <li key={index} className="text-white">
//                   {index + 1}. {participant.fullName} ({participant.studentId})
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={() => setShowParticipantsPopup(false)}
//               className="mt-4 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
//             >
//               ปิด
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// Install sweetalert2 if not installed: npm install sweetalert2

// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { FaCheckCircle, FaTimesCircle, FaUser, FaPlusCircle, FaCalendarAlt, FaClock, FaGraduationCap, FaIdCard, FaInfoCircle, FaUsers, FaClipboardList, FaPencilAlt , FaCheck , FaTimes , FaPhone} from "react-icons/fa";
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

// interface Registration {
//   activityId: string;
// }

// export default function RegisterPage() {
//   const { data: session } = useSession();
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [registeredActivities, setRegisteredActivities] = useState<string[]>([]);
//   const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showParticipantsPopup, setShowParticipantsPopup] = useState(false);
//   const [participants, setParticipants] = useState<Activity["participants"]>([]);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     studentId: "",
//     year: "",
//     phone: "",
//   });

//   useEffect(() => {
//     async function fetchActivitiesAndRegistrations() {
//       try {
//         const res = await fetch("/api/activities");
//         if (!res.ok) {
//           throw new Error("Failed to fetch activities");
//         }
//         const activities: Activity[] = await res.json();
//         setActivities(activities);

//         if (session?.user?.id) {
//           const registeredRes = await fetch(
//             `/api/users/registrations?userId=${session.user.id}`
//           );
//           if (!registeredRes.ok) {
//             throw new Error("Failed to fetch registered activities");
//           }
//           const registeredData: Registration[] = await registeredRes.json();
//           setRegisteredActivities(registeredData.map((reg) => reg.activityId));
//         } else {
//           setRegisteredActivities([]);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }

//     fetchActivitiesAndRegistrations();
//   }, [session]);

//   const validateAndConfirm = () => {
//     if (!formData.fullName || !formData.studentId || !formData.year || !formData.phone) {
//       alert("กรุณากรอกข้อมูลให้ครบถ้วน");
//       return;
//     }
//     if (formData.studentId.length !== 12) {
//       alert("รหัสนักศึกษาต้องมี 12 หลัก");
//       return;
//     }
//     if (formData.phone.length !== 10) {
//       alert("เบอร์โทรต้องมี 10 หลัก");
//       return;
//     }
//     handleRegister();
//   };

//   const handleRegister = async () => {
//     if (!selectedActivity || !session?.user?.id) return;

//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           activityId: selectedActivity._id,
//           participant: formData,
//           userId: session.user.id,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         alert(`ลงทะเบียนล้มเหลว: ${errorData.message}`);
//         return;
//       }

//       setRegisteredActivities((prev) => [...prev, selectedActivity._id]);
//       setShowPopup(false);
//       Swal.fire({
//         icon: "success",
//         title: "ลงทะเบียนสำเร็จ!",
//         text: "คุณได้ลงทะเบียนกิจกรรมเรียบร้อยแล้ว",
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "ตกลง",
//       });
//       setFormData({ fullName: "", studentId: "", year: "", phone: "" });
//     } catch (error) {
//       console.error("Error registering:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="container mx-auto py-8">
//         <h1 className="text-4xl font-bold mb-6 text-center text-white-400">ลงทะเบียนกิจกรรม</h1>
//         <table className="w-full bg-gray-800 rounded-lg shadow-lg">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="p-3 text-left"><FaInfoCircle className="inline-block mr-2" />ชื่อกิจกรรม</th>
//               <th className="p-3 text-left"><FaCalendarAlt className="inline-block mr-2" />เวลาเริ่ม</th>
//               <th className="p-3 text-left"><FaClock className="inline-block mr-2" />เวลาปิด</th>
//               <th className="p-3 text-left"><FaUsers className="inline-block mr-2" />จำนวนผู้เข้าร่วม/สูงสุด</th>
//               <th className="p-3 text-left"><FaCheckCircle className="inline-block mr-2" />สถานะ</th>
//               <th className="p-3 text-left"><FaPlusCircle className="inline-block mr-2" />ลงทะเบียน</th>
//               <th className="p-3 text-left"><FaUser className="inline-block mr-2" />รายชื่อผู้เข้าร่วม</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activities.map((activity) => (
//               <tr key={activity._id} className="hover:bg-gray-600">
//                 <td className="p-3">{activity.title}</td>
//                 <td className="p-3">{new Date(activity.time).toLocaleString()}</td>
//                 <td className="p-3">{new Date(activity.closeTime).toLocaleString()}</td>
//                 <td className="p-3">
//                   {activity.participants.length}/{activity.maxParticipants}
//                 </td>
//                 <td className="p-3">
//                   {activity.status === "open" ? (
//                     <span className="flex items-center gap-2 text-green-400">
//                       <FaCheckCircle />
//                       เปิด
//                     </span>
//                   ) : (
//                     <span className="flex items-center gap-2 text-red-400">
//                       <FaTimesCircle />
//                       ปิด
//                     </span>
//                   )}
//                 </td>
//                 <td className="p-3">
//                   {registeredActivities.includes(activity._id) ? (
//                     <span className="flex items-center gap-2 text-gray-400 italic opacity-50">
//                       <FaUser />
//                       ลงทะเบียนแล้ว
//                     </span>
//                   ) : activity.participants.length >= activity.maxParticipants ? (
//                     <span className="flex items-center gap-2 text-red-400 italic">
//                       <FaTimesCircle />
//                       เต็ม
//                     </span>
//                   ) : activity.status === "open" ? (
//                     <button
//                       onClick={() => {
//                         setSelectedActivity(activity);
//                         setShowPopup(true);
//                       }}
//                       className="flex items-center gap-2 bg-blue-500 px-3 py-1 rounded hover:bg-blue-400"
//                     >
//                       <FaPlusCircle />
//                       ลงทะเบียน
//                     </button>
//                   ) : (
//                     <span className="text-gray-400">ปิด</span>
//                   )}
//                 </td>
//                 <td className="p-3">
//                   <button
//                     onClick={() => {
//                       setSelectedActivity(activity);
//                       setParticipants(activity.participants);
//                       setShowParticipantsPopup(true);
//                     }}
//                     className="flex items-center gap-2 bg-green-500 px-3 py-1 rounded hover:bg-green-400"
//                   >
//                     <FaUser />
//                     ดูรายชื่อ
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Popups */}
//  {showPopup && (
//   <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//     <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
//       <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
//         <FaPencilAlt /> กรอกข้อมูลลงทะเบียน
//       </h2>
//       <div className="relative mb-3">
//         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//           <FaUser className="h-5 w-5 text-gray-400" />
//         </div>
//         <input
//           type="text"
//           placeholder="ชื่อ-นามสกุล"
//           value={formData.fullName}
//           onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
//           className="w-full p-2 pl-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>
//       <div className="relative mb-3">
//         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//           <FaIdCard className="h-5 w-5 text-gray-400" />
//         </div>
//         <input
//           type="text"
//           placeholder="รหัสนักศึกษา"
//           value={formData.studentId}
//           onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
//           className="w-full p-2 pl-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>
//       <div className="relative mb-3">
//         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//           <FaGraduationCap className="h-5 w-5 text-gray-400" />
//         </div>
//         <input
//           type="text"
//           placeholder="ชั้นปี"
//           value={formData.year}
//           onChange={(e) => setFormData({ ...formData, year: e.target.value })}
//           className="w-full p-2 pl-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>
//       <div className="relative mb-3">
//         <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//           <FaPhone className="h-5 w-5 text-gray-400" />
//         </div>
//         <input
//           type="text"
//           placeholder="เบอร์โทร"
//           value={formData.phone}
//           onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//           className="w-full p-2 pl-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>
//       <div className="flex justify-end gap-4">
//         <button
//           onClick={() => setShowPopup(false)}
//           className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
//         >
//           <FaTimes className="h-5 w-5" /> ยกเลิก
//         </button>
//         <button
//           onClick={validateAndConfirm}
//           className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-500"
//         >
//           <FaCheck className="h-5 w-5" /> ลงทะเบียน
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//       {showParticipantsPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-h-96 overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2"><FaClipboardList />รายชื่อผู้เข้าร่วม</h2>
//             <ul className="space-y-2">
//               {participants.map((participant, index) => (
//                 <li key={index} className="text-white">
//                   {index + 1}. {participant.fullName} ({participant.studentId})
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={() => setShowParticipantsPopup(false)}
//               className="mt-4 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
//             >
//               ปิด
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import {
//   FaCheckCircle,
//   FaTimesCircle,
//   FaUser,
//   FaPlusCircle,
//   FaCalendarAlt,
//   FaClock,
//   FaGraduationCap,
//   FaIdCard,
//   FaInfoCircle,
//   FaUsers,
//   FaClipboardList,
//   FaPencilAlt,
//   FaCheck,
//   FaTimes,
//   FaPhone,
// } from "react-icons/fa";

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

// interface Registration {
//   activityId: string;
// }

// export default function RegisterPage() {
//   const { data: session } = useSession();
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [registeredActivities, setRegisteredActivities] = useState<string[]>([]);
//   const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [showParticipantsPopup, setShowParticipantsPopup] = useState(false);
//   const [participants, setParticipants] = useState<Activity["participants"]>([]);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     studentId: "",
//     year: "",
//     phone: "",
//   });

//   // Fetch activities and registered activities
//   useEffect(() => {
//     async function fetchActivitiesAndRegistrations() {
//       try {
//         const res = await fetch("/api/activities");
//         if (!res.ok) throw new Error("Failed to fetch activities");

//         const activities: Activity[] = await res.json();
//         setActivities(activities);

//         if (session?.user?.id) {
//           const registeredRes = await fetch(
//             `/api/users/registrations?userId=${session.user.id}`
//           );
//           if (!registeredRes.ok) throw new Error("Failed to fetch registered activities");

//           const registeredData: Registration[] = await registeredRes.json();
//           setRegisteredActivities(registeredData.map((reg) => reg.activityId));
//         } else {
//           setRegisteredActivities([]);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         Swal.fire({
//           icon: "error",
//           title: "เกิดข้อผิดพลาด",
//           text: "ไม่สามารถโหลดข้อมูลกิจกรรมได้ กรุณาลองใหม่อีกครั้ง",
//         });
//       }
//     }

//     fetchActivitiesAndRegistrations();
//   }, [session]);

//   // Validate and confirm form data
//   const validateAndConfirm = () => {
//     if (!formData.fullName || !formData.studentId || !formData.year || !formData.phone) {
//       Swal.fire({
//         icon: "warning",
//         title: "ข้อมูลไม่ครบถ้วน",
//         text: "กรุณากรอกข้อมูลให้ครบถ้วน",
//       });
//       return;
//     }

//     if (formData.studentId.length !== 12) {
//       Swal.fire({
//         icon: "warning",
//         title: "รหัสนักศึกษาไม่ถูกต้อง",
//         text: "รหัสนักศึกษาต้องมี 12 หลัก",
//       });
//       return;
//     }

//     if (formData.phone.length !== 10) {
//       Swal.fire({
//         icon: "warning",
//         title: "เบอร์โทรไม่ถูกต้อง",
//         text: "เบอร์โทรต้องมี 10 หลัก",
//       });
//       return;
//     }

//     handleRegister();
//   };

//   // Handle registration
//   const handleRegister = async () => {
//     if (!selectedActivity || !session?.user?.id) {
//       Swal.fire({
//         icon: "error",
//         title: "ข้อผิดพลาด",
//         text: "ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง",
//       });
//       return;
//     }

//     // ตรวจสอบ userId ว่าเป็น ObjectId รูปแบบถูกต้อง
//     if (session.user.id.length !== 24) {
//       Swal.fire({
//         icon: "error",
//         title: "รหัสผู้ใช้งานไม่ถูกต้อง",
//         text: "กรุณาล็อกอินใหม่อีกครั้ง",
//       });
//       return;
//     }

//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           activityId: selectedActivity._id,
//           participant: formData,
//           userId: session.user.id,
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         Swal.fire({
//           icon: "error",
//           title: "ลงทะเบียนล้มเหลว",
//           text: errorData.message || "ไม่สามารถลงทะเบียนได้",
//         });
//         return;
//       }

//       setRegisteredActivities((prev) => [...prev, selectedActivity._id]);
//       setShowPopup(false);

//       Swal.fire({
//         icon: "success",
//         title: "ลงทะเบียนสำเร็จ!",
//         text: "คุณได้ลงทะเบียนกิจกรรมเรียบร้อยแล้ว",
//       });

//       setFormData({ fullName: "", studentId: "", year: "", phone: "" });
//     } catch (error) {
//       console.error("Error registering:", error);
//       Swal.fire({
//         icon: "error",
//         title: "เกิดข้อผิดพลาด",
//         text: "ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="container mx-auto py-8">
//         <h1 className="text-4xl font-bold mb-6 text-center text-white-400">
//           ลงทะเบียนกิจกรรม
//         </h1>
//         <table className="w-full bg-gray-800 rounded-lg shadow-lg">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="p-3 text-left">ชื่อกิจกรรม</th>
//               <th className="p-3 text-left">เวลาเริ่ม</th>
//               <th className="p-3 text-left">เวลาปิด</th>
//               <th className="p-3 text-left">จำนวนผู้เข้าร่วม/สูงสุด</th>
//               <th className="p-3 text-left">สถานะ</th>
//               <th className="p-3 text-left">ลงทะเบียน</th>
//               <th className="p-3 text-left">รายชื่อผู้เข้าร่วม</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activities.map((activity) => (
//               <tr key={activity._id} className="hover:bg-gray-600">
//                 <td className="p-3">{activity.title}</td>
//                 <td className="p-3">{new Date(activity.time).toLocaleString()}</td>
//                 <td className="p-3">{new Date(activity.closeTime).toLocaleString()}</td>
//                 <td className="p-3">
//                   {activity.participants.length}/{activity.maxParticipants}
//                 </td>
//                 <td className="p-3">
//                   {activity.status === "open" ? (
//                     <span className="flex items-center gap-2 text-green-400">
//                       <FaCheckCircle />
//                       เปิด
//                     </span>
//                   ) : (
//                     <span className="flex items-center gap-2 text-red-400">
//                       <FaTimesCircle />
//                       ปิด
//                     </span>
//                   )}
//                 </td>
//                 <td className="p-3">
//                   {registeredActivities.includes(activity._id) ? (
//                     <span className="text-gray-400 italic">ลงทะเบียนแล้ว</span>
//                   ) : (
//                     <button
//                       onClick={() => {
//                         setSelectedActivity(activity);
//                         setShowPopup(true);
//                       }}
//                       className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-400"
//                     >
//                       ลงทะเบียน
//                     </button>
//                   )}
//                 </td>
//                 <td className="p-3">
//                   <button
//                     onClick={() => {
//                       setParticipants(activity.participants);
//                       setShowParticipantsPopup(true);
//                     }}
//                     className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-400"
//                   >
//                     ดูรายชื่อ
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Popup สำหรับการลงทะเบียน */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
//               <FaPencilAlt /> กรอกข้อมูลลงทะเบียน
//             </h2>
//             <div className="relative mb-3">
//               <FaUser className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="ชื่อ-นามสกุล"
//                 value={formData.fullName}
//                 onChange={(e) =>
//                   setFormData({ ...formData, fullName: e.target.value })
//                 }
//                 className="w-full pl-10 p-2 rounded bg-gray-700 text-white"
//               />
//             </div>
//             <div className="relative mb-3">
//               <FaIdCard className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="รหัสนักศึกษา"
//                 value={formData.studentId}
//                 onChange={(e) =>
//                   setFormData({ ...formData, studentId: e.target.value })
//                 }
//                 className="w-full pl-10 p-2 rounded bg-gray-700 text-white"
//               />
//             </div>
//             <div className="relative mb-3">
//               <FaGraduationCap className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="ชั้นปี"
//                 value={formData.year}
//                 onChange={(e) =>
//                   setFormData({ ...formData, year: e.target.value })
//                 }
//                 className="w-full pl-10 p-2 rounded bg-gray-700 text-white"
//               />
//             </div>
//             <div className="relative mb-3">
//               <FaPhone className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="เบอร์โทร"
//                 value={formData.phone}
//                 onChange={(e) =>
//                   setFormData({ ...formData, phone: e.target.value })
//                 }
//                 className="w-full pl-10 p-2 rounded bg-gray-700 text-white"
//               />
//             </div>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setShowPopup(false)}
//                 className="bg-gray-600 text-white px-4 py-2 rounded"
//               >
//                 <FaTimes /> ยกเลิก
//               </button>
//               <button
//                 onClick={validateAndConfirm}
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//               >
//                 <FaCheck /> ลงทะเบียน
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Popup สำหรับรายชื่อผู้เข้าร่วม */}
//       {showParticipantsPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-h-96 overflow-y-auto">
//             <h2 className="text-2xl font-bold mb-4 text-blue-400">
//               <FaClipboardList /> รายชื่อผู้เข้าร่วม
//             </h2>
//             <ul className="space-y-2">
//               {participants.map((participant, index) => (
//                 <li key={index} className="text-white">
//                   {index + 1}. {participant.fullName} ({participant.studentId})
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={() => setShowParticipantsPopup(false)}
//               className="mt-4 bg-gray-600 px-4 py-2 rounded text-white"
//             >
//               ปิด
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle, FaUser, FaPlusCircle, FaCalendarAlt, FaClock, FaGraduationCap, FaIdCard, FaInfoCircle, FaUsers, FaClipboardList, FaPencilAlt, FaCheck, FaTimes, FaPhone } from "react-icons/fa";
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

interface Registration {
  activityId: string;
}

export default function RegisterPage() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [registeredActivities, setRegisteredActivities] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showParticipantsPopup, setShowParticipantsPopup] = useState(false);
  const [participants, setParticipants] = useState<Activity["participants"]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    year: "",
    phone: "",
  });

  useEffect(() => {
    async function fetchActivitiesAndRegistrations() {
      try {
        const res = await fetch("/api/activities");
        if (!res.ok) {
          throw new Error("Failed to fetch activities");
        }
        const activities: Activity[] = await res.json();
        setActivities(activities);

        if (session?.user?.id) {
          const registeredRes = await fetch(
            `/api/users/registrations?userId=${session.user.id}`
          );
          if (!registeredRes.ok) {
            throw new Error("Failed to fetch registered activities");
          }
          const registeredData: Registration[] = await registeredRes.json();
          setRegisteredActivities(registeredData.map((reg) => reg.activityId));
        } else {
          setRegisteredActivities([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถโหลดข้อมูลกิจกรรมได้ กรุณาลองใหม่อีกครั้ง",
        });
      }
    }

    fetchActivitiesAndRegistrations();
  }, [session]);

  const validateAndConfirm = () => {
    if (!formData.fullName || !formData.studentId || !formData.year || !formData.phone) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบถ้วน",
        text: "กรุณากรอกข้อมูลให้ครบถ้วน",
      });
      return;
    }
    if (formData.studentId.length !== 12) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ถูกต้อง",
        text: "รหัสนักศึกษาต้องมี 12 หลัก",
      });
      return;
    }
    if (formData.phone.length !== 10) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ถูกต้อง",
        text: "เบอร์โทรต้องมี 10 หลัก",
      });
      return;
    }
    handleRegister();
  };

  const handleRegister = async () => {
    if (!selectedActivity || !session?.user?.id) {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง",
      });
      return;
    }

    // ตรวจสอบว่า userId อยู่ในรูปแบบ ObjectId (24-character Hexadecimal)
    if (session.user.id.length !== 24) {
      Swal.fire({
        icon: "error",
        title: "รหัสผู้ใช้งานไม่ถูกต้อง",
        text: "กรุณาล็อกอินใหม่อีกครั้ง",
      });
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: selectedActivity._id,
          participant: formData,
          userId: session.user.id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: errorData.message || "ไม่สามารถลงทะเบียนได้",
        });
        return;
      }

      setRegisteredActivities((prev) => [...prev, selectedActivity._id]);
      setShowPopup(false);
      Swal.fire({
        icon: "success",
        title: "ลงทะเบียนสำเร็จ!",
        text: "คุณได้ลงทะเบียนกิจกรรมเรียบร้อยแล้ว",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
      });

      setFormData({ fullName: "", studentId: "", year: "", phone: "" });
    } catch (error) {
      console.error("Error registering:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">
          ลงทะเบียนกิจกรรม
        </h1>
        <table className="w-full bg-gray-800 rounded-lg shadow-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left"><FaInfoCircle className="inline-block mr-2" />ชื่อกิจกรรม</th>
              <th className="p-3 text-left"><FaCalendarAlt className="inline-block mr-2" />เวลาเริ่ม</th>
              <th className="p-3 text-left"><FaClock className="inline-block mr-2" />เวลาปิด</th>
              <th className="p-3 text-left"><FaUsers className="inline-block mr-2" />จำนวนผู้เข้าร่วม/สูงสุด</th>
              <th className="p-3 text-left"><FaCheckCircle className="inline-block mr-2" />สถานะ</th>
              <th className="p-3 text-left"><FaPlusCircle className="inline-block mr-2" />ลงทะเบียน</th>
              <th className="p-3 text-left"><FaUser className="inline-block mr-2" />รายชื่อผู้เข้าร่วม</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id} className="hover:bg-gray-600">
                <td className="p-3">{activity.title}</td>
                <td className="p-3">{new Date(activity.time).toLocaleString()}</td>
                <td className="p-3">{new Date(activity.closeTime).toLocaleString()}</td>
                <td className="p-3">
                  {activity.participants.length}/{activity.maxParticipants}
                </td>
                <td className="p-3">
                  {activity.status === "open" ? (
                    <span className="flex items-center gap-2 text-green-400">
                      <FaCheckCircle />
                      เปิด
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-400">
                      <FaTimesCircle />
                      ปิด
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {registeredActivities.includes(activity._id) ? (
                    <span className="flex items-center gap-2 text-gray-400 italic opacity-50">
                      <FaUser />
                      ลงทะเบียนแล้ว
                    </span>
                  ) : activity.participants.length >= activity.maxParticipants ? (
                    <span className="flex items-center gap-2 text-red-400 italic">
                      <FaTimesCircle />
                      เต็ม
                    </span>
                  ) : activity.status === "open" ? (
                    <button
                      onClick={() => {
                        setSelectedActivity(activity);
                        setShowPopup(true);
                      }}
                      className="flex items-center gap-2 bg-blue-500 px-3 py-1 rounded hover:bg-blue-400"
                    >
                      <FaPlusCircle />
                      ลงทะเบียน
                    </button>
                  ) : (
                    <span className="text-gray-400">ปิด</span>
                  )}
                </td>
                <td className="p-3">
                  <button
                    onClick={() => {
                      setSelectedActivity(activity);
                      setParticipants(activity.participants);
                      setShowParticipantsPopup(true);
                    }}
                    className="flex items-center gap-2 bg-green-500 px-3 py-1 rounded hover:bg-green-400"
                  >
                    <FaUser />
                    ดูรายชื่อ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
              <FaPencilAlt /> กรอกข้อมูลลงทะเบียน
            </h2>
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ชื่อ-นามสกุล"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full p-2 pl-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaIdCard className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="รหัสนักศึกษา"
                value={formData.studentId}
                onChange={(e) =>
                  setFormData({ ...formData, studentId: e.target.value })
                }
                className="w-full p-2 pl-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaGraduationCap className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="ชั้นปี"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
                className="w-full p-2 pl-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="เบอร์โทร"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-2 pl-10 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
              >
                <FaTimes className="h-5 w-5" /> ยกเลิก
              </button>
              <button
                onClick={validateAndConfirm}
                className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-500"
              >
                <FaCheck className="h-5 w-5" /> ลงทะเบียน
              </button>
            </div>
          </div>
        </div>
      )}

      {showParticipantsPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
              <FaClipboardList /> รายชื่อผู้เข้าร่วม
            </h2>
            <ul className="space-y-2">
              {participants.map((participant, index) => (
                <li key={index} className="text-white">
                  {index + 1}. {participant.fullName} ({participant.studentId})
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowParticipantsPopup(false)}
              className="mt-4 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
