
// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { 
//   FaCheckCircle, FaTimesCircle, FaPlusCircle, FaCalendarAlt, FaClock, FaUsers, FaInfoCircle
// } from "react-icons/fa";
// import Swal from "sweetalert2";

// interface Activity {
//   _id: string;
//   title: string;
//   registerStart: string;
//   registerEnd: string;
//   activityStart: string;
//   activityEnd: string;
//   location: string;
//   maxParticipants: number;
//   status: string;
//   participants: Array<{ fullName: string; studentId: string; department?: string; program?: string; year: string; phone: string; }>;
//   newsId?: { _id: string; title?: string; image?: string; content?: string } | string;
// }

// export default function RegisterPage() {
//   const { data: session } = useSession();
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [registeredActivities, setRegisteredActivities] = useState<string[]>([]);
//   const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [userInfo, setUserInfo] = useState({ fullName: "", studentId: "", department: "", program: "", year: "", phone: "" });

//   useEffect(() => {
//     async function fetchData() {
//       const activitiesRes = await fetch("/api/activities");
//       const activities = await activitiesRes.json();
//       setActivities(activities.sort((a: Activity, b: Activity) => new Date(b.registerStart).getTime() - new Date(a.registerStart).getTime()));

//       if (session?.user?.id) {
//         const userRes = await fetch(`/api/users/${session.user.id}`);
//         const userData = await userRes.json();
//         setUserInfo({
//           fullName: userData.name,
//           studentId: userData.studentId,
//           department: userData.department || "",
//           program: userData.program || "",
//           year: userData.year || "",
//           phone: userData.phone || "",
//         });

//         const registeredRes = await fetch(`/api/users/registrations?userId=${session.user.id}`);
//         const registeredData = await registeredRes.json();
//         if (registeredData.message !== "No registered activities found") {
//           setRegisteredActivities(registeredData.map((r: any) => r.activityId?._id));
//         }
//       }
//     }
//     fetchData();
//   }, [session]);

//   const handleRegister = async () => {
//     if (!selectedActivity || !session?.user?.id) return;

//     const res = await fetch("/api/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         activityId: selectedActivity._id,
//         participant: userInfo,
//         userId: session.user.id,
//       }),
//     });

//     if (res.ok) {
//       setRegisteredActivities(prev => [...prev, selectedActivity._id]);
//       setShowPopup(false);
//       Swal.fire("ลงทะเบียนสำเร็จ!", "คุณได้ลงทะเบียนกิจกรรมแล้ว", "success");
//     } else {
//       const err = await res.json();
//       Swal.fire("เกิดข้อผิดพลาด", err.message || "ไม่สามารถลงทะเบียนได้", "error");
//     }
//   };

//   const handleActivityInfo = (activity: Activity) => {
//     const newsLink = typeof activity.newsId === 'object' && activity.newsId._id
//       ? `/news/${activity.newsId._id}`
//       : typeof activity.newsId === 'string'
//       ? `/news/${activity.newsId}`
//       : "#";

//     Swal.fire({
//       title: activity.title,
//       html: `
//         <p><strong>สถานที่:</strong> ${activity.location}</p>
//         <p><strong>เวลาเริ่มกิจกรรม:</strong> ${new Date(activity.activityStart).toLocaleString()}</p> <!-- ✅ เพิ่ม -->
//         <p><strong>เวลาสิ้นสุดกิจกรรม:</strong> ${new Date(activity.activityEnd).toLocaleString()}</p> <!-- ✅ เพิ่ม -->
//         ${activity.newsId ? `
//           <div style="margin-top:15px;">
//             <a href="${newsLink}" target="_blank" 
//               style="
//                 display: inline-block;
//                 background-color:rgb(236, 134, 0); 
//                 color: white; 
//                 padding: 8px 16px; 
//                 border-radius: 8px; 
//                 text-decoration: none; 
//                 font-weight: bold;
//                 transition: background-color 0.3s;
//               "
//               onmouseover="this.style.backgroundColor='#1d4ed8'" 
//               onmouseout="this.style.backgroundColor='#2563eb'"
//             >
//               ข่าวสารกิจกรรม
//             </a>
//           </div>
//         ` : ''}
        
//       `,
//       showConfirmButton: true,
//       confirmButtonText: "ปิด",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="container mx-auto py-10 px-4">
//         <h1 className="text-4xl font-bold mb-10 text-center">ลงทะเบียนกิจกรรม</h1>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-xl shadow-lg">
//             <thead className="bg-gray-100 dark:bg-gray-700">
//               <tr>
//                 <th className="p-3 text-left"><FaInfoCircle className="inline mr-2" />กิจกรรม</th>
//                 <th className="p-3 text-left"><FaCalendarAlt className="inline mr-2" />เปิดลงทะเบียน</th>
//                 <th className="p-3 text-left"><FaClock className="inline mr-2" />ปิดลงทะเบียน</th>
//                 <th className="p-3 text-left"><FaUsers className="inline mr-2" />ผู้เข้าร่วม</th>
//                 <th className="p-3 text-left"><FaCheckCircle className="inline mr-2" />สถานะ</th>
//                 <th className="p-3 text-left"><FaPlusCircle className="inline mr-2" />ลงทะเบียน</th>
//               </tr>
//             </thead>
//             <tbody>
//               {activities.map((a) => (
//                 <tr key={a._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
//                   <td className="p-3 text-blue-400 hover:underline" onClick={() => handleActivityInfo(a)}>{a.title}</td>
//                   <td className="p-3">{new Date(a.registerStart).toLocaleString()}</td>
//                   <td className="p-3">{new Date(a.registerEnd).toLocaleString()}</td>
//                   <td className="p-3">{a.participants.length}/{a.maxParticipants}</td>
//                   <td className="p-3">{a.status === "open" ? <span className="text-green-400">เปิด</span> : <span className="text-red-400">ปิด</span>}</td>
//                   <td className="p-3">
//                     {registeredActivities.includes(a._id) ? (
//                       <span className="text-gray-400 italic">ลงทะเบียนแล้ว</span>
//                     ) : a.participants.length >= a.maxParticipants ? (
//                       <span className="text-red-500 italic">เต็ม</span>
//                     ) : a.status === "open" ? (
//                       <button onClick={() => { setSelectedActivity(a); setShowPopup(true); }} className="bg-orange-700 hover:bg-blue-400 text-white px-4 py-2 rounded-xl">ลงทะเบียน</button>
//                     ) : (
//                       <span className="text-gray-400 italic">ปิด</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showPopup && selectedActivity && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-96">
//             <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">ยืนยันการลงทะเบียน</h2>
//             <p className="mb-6 text-center text-black">
//               คุณต้องการลงทะเบียนกิจกรรม <strong>{selectedActivity.title}</strong> ใช่ไหม?
//              </p>
//             <div className="flex justify-center gap-4">
//               <button onClick={() => setShowPopup(false)} className="bg-gray-300 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 px-4 py-2 rounded text-gray-900 dark:text-white">ยกเลิก</button>
//               <button onClick={handleRegister} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded">ยืนยัน</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { 
//   FaCheckCircle, FaTimesCircle, FaPlusCircle, FaCalendarAlt, FaClock, FaUsers, FaInfoCircle
// } from "react-icons/fa";
// import Swal from "sweetalert2";

// interface Activity {
//   _id: string;
//   title: string;
//   registerStart: string;
//   registerEnd: string;
//   activityStart: string;
//   activityEnd: string;
//   location: string;
//   maxParticipants: number;
//   status: string;
//   participants: Array<{ fullName: string; studentId: string; department?: string; program?: string; year: string; phone: string; }>;
//   newsId?: { _id: string; title?: string; image?: string; content?: string } | string;
// }

// export default function RegisterPage() {
//   const { data: session } = useSession();
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [registeredActivities, setRegisteredActivities] = useState<string[]>([]);
//   const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [userInfo, setUserInfo] = useState({ fullName: "", studentId: "", department: "", program: "", year: "", phone: "" });

//   useEffect(() => {
//     async function fetchData() {
//       const activitiesRes = await fetch("/api/activities");
//       const activities = await activitiesRes.json();
//       setActivities(activities.sort((a: Activity, b: Activity) => new Date(b.registerStart).getTime() - new Date(a.registerStart).getTime()));

//       if (session?.user?.id) {
//         const userRes = await fetch(`/api/users/${session.user.id}`);
//         const userData = await userRes.json();
//         setUserInfo({
//           fullName: userData.name,
//           studentId: userData.studentId,
//           department: userData.department || "",
//           program: userData.program || "",
//           year: userData.year || "",
//           phone: userData.phone || "",
//         });

//         const registeredRes = await fetch(`/api/users/registrations?userId=${session.user.id}`);
//         const registeredData = await registeredRes.json();
//         if (registeredData.message !== "No registered activities found") {
//           setRegisteredActivities(registeredData.map((r: any) => r.activityId?._id));
//         }
//       }
//     }
//     fetchData();
//   }, [session]);

//   const handleRegister = async () => {
//     if (!selectedActivity || !session?.user?.id) return;

//     const res = await fetch("/api/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         activityId: selectedActivity._id,
//         participant: userInfo,
//         userId: session.user.id,
//       }),
//     });

//     if (res.ok) {
//       setRegisteredActivities(prev => [...prev, selectedActivity._id]);
//       setShowPopup(false);
//       Swal.fire("ลงทะเบียนสำเร็จ!", "คุณได้ลงทะเบียนกิจกรรมแล้ว", "success");
//     } else {
//       const err = await res.json();
//       Swal.fire("เกิดข้อผิดพลาด", err.message || "ไม่สามารถลงทะเบียนได้", "error");
//     }
//   };

//   const handleActivityInfo = (activity: Activity) => {
//     const newsLink = typeof activity.newsId === 'object' && activity.newsId._id
//       ? `/news/${activity.newsId._id}`
//       : typeof activity.newsId === 'string'
//       ? `/news/${activity.newsId}`
//       : "#";

//     Swal.fire({
//       title: activity.title,
//       html: `
//         <p><strong>สถานที่:</strong> ${activity.location}</p>
//         <p><strong>เวลาเริ่มกิจกรรม:</strong> ${new Date(activity.activityStart).toLocaleString()}</p>
//         <p><strong>เวลาสิ้นสุดกิจกรรม:</strong> ${new Date(activity.activityEnd).toLocaleString()}</p>
//         ${activity.newsId ? `
//           <div style="margin-top:15px;">
//             <a href="${newsLink}" target="_blank" 
//               style="
//                 display: inline-block;
//                 background-color: rgb(236, 134, 0); 
//                 color: white; 
//                 padding: 8px 16px; 
//                 border-radius: 8px; 
//                 text-decoration: none; 
//                 font-weight: bold;
//                 transition: background-color 0.3s;
//               "
//               onmouseover="this.style.backgroundColor='#1d4ed8'" 
//               onmouseout="this.style.backgroundColor='#2563eb'"
//             >
//               ข่าวสารกิจกรรม
//             </a>
//           </div>
//         ` : ''}
//       `,
//       showConfirmButton: true,
//       confirmButtonText: "ปิด",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white">
//       <div className="container mx-auto py-10 px-4">
//         <h1 className="text-4xl font-bold mb-10 text-center">ลงทะเบียนกิจกรรม</h1>
//         <div className="overflow-x-auto">
//           <table className="min-w-full bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-xl shadow-lg">
//             <thead className="bg-gray-100 dark:bg-gray-700">
//               <tr>
//                 <th className="p-3 text-left"><FaInfoCircle className="inline mr-2" />กิจกรรม</th>
//                 <th className="p-3 text-left"><FaCalendarAlt className="inline mr-2" />เปิดลงทะเบียน</th>
//                 <th className="p-3 text-left"><FaCalendarAlt className="inline mr-2" />ปิดลงทะเบียน</th>
//                 <th className="p-3 text-left"><FaClock className="inline mr-2" />เวลาเริ่มกิจกรรม</th>
//                 <th className="p-3 text-left"><FaClock className="inline mr-2" />เวลาสิ้นสุดกิจกรรม</th>
//                 <th className="p-3 text-left"><FaUsers className="inline mr-2" />ผู้เข้าร่วม</th>
//                 <th className="p-3 text-left"><FaCheckCircle className="inline mr-2" />สถานะ</th>
//                 <th className="p-3 text-left"><FaPlusCircle className="inline mr-2" />ลงทะเบียน</th>
//               </tr>
//             </thead>
//             <tbody>
//               {activities.map((a) => (
//                 <tr key={a._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
//                   <td className="p-3 text-blue-400 hover:underline" onClick={() => handleActivityInfo(a)}>{a.title}</td>
//                   <td className="p-3">{new Date(a.registerStart).toLocaleString()}</td>
//                   <td className="p-3">{new Date(a.registerEnd).toLocaleString()}</td>
//                   <td className="p-3">{new Date(a.activityStart).toLocaleString()}</td>
//                   <td className="p-3">{new Date(a.activityEnd).toLocaleString()}</td>
//                   <td className="p-3">{a.participants.length}/{a.maxParticipants}</td>
//                   <td className="p-3">{a.status === "open" ? <span className="text-green-400">เปิด</span> : <span className="text-red-400">ปิด</span>}</td>
//                   <td className="p-3">
//                     {registeredActivities.includes(a._id) ? (
//                       <span className="text-gray-400 italic">ลงทะเบียนแล้ว</span>
//                     ) : a.participants.length >= a.maxParticipants ? (
//                       <span className="text-red-500 italic">เต็ม</span>
//                     ) : a.status === "open" ? (
//                       <button onClick={() => { setSelectedActivity(a); setShowPopup(true); }} className="bg-orange-700 hover:bg-blue-400 text-white px-4 py-2 rounded-xl">ลงทะเบียน</button>
//                     ) : (
//                       <span className="text-gray-400 italic">ปิด</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {showPopup && selectedActivity && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-96">
//             <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">ยืนยันการลงทะเบียน</h2>
//             <p className="mb-6 text-center text-black">
//               คุณต้องการลงทะเบียนกิจกรรม <strong>{selectedActivity.title}</strong> ใช่ไหม?
//              </p>
//             <div className="flex justify-center gap-4">
//               <button onClick={() => setShowPopup(false)} className="bg-gray-300 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 px-4 py-2 rounded text-gray-900 dark:text-white">ยกเลิก</button>
//               <button onClick={handleRegister} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded">ยืนยัน</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { 
  FaCheckCircle, FaTimesCircle, FaPlusCircle, FaCalendarAlt, FaClock, FaUsers, FaInfoCircle
} from "react-icons/fa";
import Swal from "sweetalert2";
import { MapPin, Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface Activity {
  _id: string;
  title: string;
  registerStart: string;
  registerEnd: string;
  activityStart: string;
  activityEnd: string;
  location: string;
  maxParticipants: number;
  status: string;
  participants: Array<{ fullName: string; studentId: string; department?: string; program?: string; year: string; phone: string; }>;
  newsId?: { _id: string; title?: string; image?: string; content?: string } | string;
}

export default function RegisterPage() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [registeredActivities, setRegisteredActivities] = useState<string[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [userInfo, setUserInfo] = useState({ 
    fullName: "", 
    studentId: "", 
    department: "", 
    program: "", 
    year: "", 
    phone: "" 
  });

  useEffect(() => {
    async function fetchData() {
      const activitiesRes = await fetch("/api/activities");
      const activities = await activitiesRes.json();
      setActivities(activities.sort((a: Activity, b: Activity) => new Date(b.registerStart).getTime() - new Date(a.registerStart).getTime()));

      if (session?.user?.id) {
        const userRes = await fetch(`/api/users/${session.user.id}`);
        const userData = await userRes.json();
        setUserInfo({
          fullName: userData.name,
          studentId: userData.studentId,
          department: userData.department || "",
          program: userData.program || "",
          year: userData.year || "",
          phone: userData.phone || "",
        });

        const registeredRes = await fetch(`/api/users/registrations?userId=${session.user.id}`);
        const registeredData = await registeredRes.json();
        if (registeredData.message !== "No registered activities found") {
          setRegisteredActivities(registeredData.map((r: any) => r.activityId?._id));
        }
      }
    }
    fetchData();
  }, [session]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleRegister = async () => {
    if (!selectedActivity || !session?.user?.id) return;

    // Update user profile with year (containing study group value)
    const updateUserRes = await fetch("/api/users/update-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        year: userInfo.year.trim(),
      }),
    });

    if (!updateUserRes.ok) {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้", "error");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        activityId: selectedActivity._id,
        participant: userInfo,
        userId: session.user.id,
      }),
    });

    if (res.ok) {
      setRegisteredActivities(prev => [...prev, selectedActivity._id]);
      setShowPopup(false);
      Swal.fire("ลงทะเบียนสำเร็จ!", "คุณได้ลงทะเบียนกิจกรรมแล้ว", "success");
    } else {
      const err = await res.json();
      Swal.fire("เกิดข้อผิดพลาด", err.message || "ไม่สามารถลงทะเบียนได้", "error");
    }
  };

  const handleActivityInfo = (activity: Activity) => {
    const newsLink = typeof activity.newsId === 'object' && activity.newsId._id
      ? `/news/${activity.newsId._id}`
      : typeof activity.newsId === 'string'
      ? `/news/${activity.newsId}`
      : "#";

    Swal.fire({
      title: activity.title,
      html: `
        <p><strong>สถานที่:</strong> ${activity.location}</p>
        <p><strong>เวลาเริ่มกิจกรรม:</strong> ${new Date(activity.activityStart).toLocaleString()}</p>
        <p><strong>เวลาสิ้นสุดกิจกรรม:</strong> ${new Date(activity.activityEnd).toLocaleString()}</p>
        ${activity.newsId ? `
          <div style="margin-top:15px;">
            <a href="${newsLink}" target="_blank" 
              style="
                display: inline-block;
                background-color: rgb(236, 134, 0); 
                color: white; 
                padding: 8px 16px; 
                border-radius: 4px; 
                text-decoration: none; 
                font-weight: bold;
                transition: background-color 0.3s;
              "
              onmouseover="this.style.backgroundColor='#1d4ed8'" 
              onmouseout="this.style.backgroundColor='#2563eb'"
            >
              ข่าวสารกิจกรรม
            </a>
          </div>
        ` : ''}
      `,
      showConfirmButton: true,
      confirmButtonText: "ปิด",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] text-gray-900 dark:text-white px-4 py-12 md:py-20 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        {/* Title */}
        <div className="text-center mb-16 space-y-3 select-none">
          <h2 className="text-[10px] tracking-[0.3em] font-light text-orange-500 uppercase">
            Available Activities
          </h2>
          <h1 className="text-3xl font-extralight text-gray-800 dark:text-gray-200 tracking-wide">
            ลงทะเบียนเข้าร่วมกิจกรรม
          </h1>
        </div>

        {activities.length === 0 ? (
          <div className="p-16 text-center text-gray-600 dark:text-gray-500 font-light text-sm bg-white dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.03] rounded-3xl shadow-sm dark:shadow-none">
            ไม่มีกิจกรรมที่เปิดให้ลงทะเบียนในขณะนี้
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((a) => {
              const isRegistered = registeredActivities.includes(a._id);
              const isFull = a.participants.length >= a.maxParticipants;
              const isOpen = a.status === "open";
              
              // Calculate progress percentage
              const percent = Math.min((a.participants.length / a.maxParticipants) * 100, 100);

              return (
                <motion.div
                  key={a._id}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] backdrop-blur-xl p-6 rounded-3xl flex flex-col justify-between hover:border-orange-500/30 transition-all duration-300 shadow-[0_15px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.4)] relative group"
                >
                  {/* Header Status */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] tracking-widest text-gray-650 dark:text-gray-500 uppercase font-light">
                      ACTIVITY
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                      <span className={`text-[10px] font-light tracking-wide ${isOpen ? "text-green-400" : "text-red-400"}`}>
                        {isOpen ? "เปิดลงทะเบียน" : "ปิดแล้ว"}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="mb-5">
                    <h3 
                      onClick={() => handleActivityInfo(a)}
                      className="text-lg font-extralight text-gray-800 dark:text-gray-200 tracking-wide hover:text-orange-500 transition-colors cursor-pointer line-clamp-2"
                    >
                      {a.title}
                    </h3>
                  </div>

                  {/* Details list */}
                  <div className="space-y-4 text-xs text-gray-600 dark:text-gray-400 font-light mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-orange-500/60" />
                      <span className="truncate">{a.location}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-550 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-gray-600 dark:text-gray-500 uppercase tracking-wider mb-0.5">ช่วงเวลาจัดกิจกรรม</p>
                        <p className="text-gray-800 dark:text-gray-300">
                          {new Date(a.activityStart).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })} - {new Date(a.activityEnd).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-gray-550 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-gray-600 dark:text-gray-500 uppercase tracking-wider mb-0.5">ช่วงเวลาลงทะเบียน</p>
                        <p className="text-gray-800 dark:text-gray-300">
                          {new Date(a.registerStart).toLocaleDateString("th-TH")} - {new Date(a.registerEnd).toLocaleDateString("th-TH")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress and Action Footer */}
                  <div className="space-y-4 border-t border-gray-200 dark:border-white/[0.04] pt-4 mt-auto">
                    {/* Participation bar */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-gray-650 dark:text-gray-400 mb-1.5 font-light">
                        <span>ความจุผู้เข้าร่วม</span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{a.participants.length} / {a.maxParticipants} คน</span>
                      </div>
                      <div className="w-full h-1 bg-gray-100 dark:bg-white/[0.04] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleActivityInfo(a)}
                        className="flex-1 bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.06] text-xs font-light tracking-wider py-2.5 px-3 rounded-xl border border-gray-200 dark:border-white/[0.06] text-gray-750 dark:text-gray-300 transition-colors"
                      >
                        รายละเอียด
                      </button>

                      {isRegistered ? (
                        <div className="flex-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-light tracking-wider py-2.5 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 select-none">
                          <FaCheckCircle className="h-3.5 w-3.5" />
                          <span>ลงทะเบียนแล้ว</span>
                        </div>
                      ) : isFull ? (
                        <div className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-light tracking-wider py-2.5 px-3 rounded-xl text-center flex items-center justify-center gap-1.5 select-none">
                          <FaTimesCircle className="h-3.5 w-3.5" />
                          <span>เต็มแล้ว</span>
                        </div>
                      ) : isOpen ? (
                        <button
                          onClick={() => { setSelectedActivity(a); setShowPopup(true); }}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 text-black text-xs font-medium tracking-wider py-2.5 px-3 rounded-xl shadow-[0_5px_15px_rgba(249,115,22,0.15)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition-all duration-300"
                        >
                          ลงทะเบียน
                        </button>
                      ) : (
                        <div className="flex-1 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] text-gray-400 dark:text-gray-500 text-xs font-light tracking-wider py-2.5 px-3 rounded-xl text-center select-none">
                          ปิดแล้ว
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {showPopup && selectedActivity && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#0a0a0b] border border-gray-200 dark:border-white/[0.05] p-8 rounded-3xl shadow-[0_30px_70px_rgba(0,0,0,0.05)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.8)] w-full max-w-sm flex flex-col transition-all duration-300"
          >
            <h2 className="text-lg font-light text-center text-orange-500 tracking-wider mb-6">
              ยืนยันการลงทะเบียน
            </h2>
            <p className="mb-6 text-center text-sm font-light text-gray-650 dark:text-gray-300">
              คุณต้องการลงทะเบียนเข้าร่วมกิจกรรม <strong className="text-gray-900 dark:text-white font-normal">{selectedActivity.title}</strong> ใช่หรือไม่?
            </p>
            
            <div className="mb-8">
              <label className="block text-[10px] tracking-wider font-light text-gray-600 dark:text-gray-500 uppercase mb-2">
                ชั้นปี / กลุ่มเรียน
              </label>
              <input
                type="text"
                name="year"
                value={userInfo.year}
                onChange={handleTextChange}
                className="block w-full rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.08] text-sm text-gray-900 dark:text-white px-4 py-3 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 placeholder-gray-400 dark:placeholder-gray-600 transition-all font-light"
                placeholder="เช่น ECP4N"
                required
              />
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setShowPopup(false)} 
                className="flex-1 border border-gray-200 dark:border-white/[0.08] hover:bg-gray-100 dark:hover:bg-white/[0.03] text-gray-750 dark:text-gray-300 text-xs font-light tracking-wider py-3 rounded-xl transition-colors"
              >
                ยกเลิก
              </button>
              <button 
                onClick={handleRegister} 
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-black text-xs font-medium tracking-wider py-3 rounded-xl transition-all shadow-[0_5px_15px_rgba(249,115,22,0.1)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.25)]"
              >
                ยืนยัน
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}