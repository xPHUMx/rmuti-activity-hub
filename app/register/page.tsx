
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
//         participant: userInfo, // ส่ง program ไปด้วย
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
//     Swal.fire({
//       title: activity.title,
//       html: `<p><strong>สถานที่:</strong> ${activity.location}</p>
//              <p><strong>เปิดลงทะเบียน:</strong> ${new Date(activity.registerStart).toLocaleString()}</p>
//              <p><strong>ปิดลงทะเบียน:</strong> ${new Date(activity.registerEnd).toLocaleString()}</p>
//              ${activity.newsId ? `<a href='/news/${typeof activity.newsId === 'object' ? activity.newsId._id : activity.newsId}' class='swal2-confirm swal2-styled' style='background-color:#2563eb;margin-top:10px;'>ดูข่าวสาร</a>` : ``}`,
//       showConfirmButton: true,
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
//                       <button onClick={() => { setSelectedActivity(a); setShowPopup(true); }} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded-xl">ลงทะเบียน</button>
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
//             <p className="mb-6 text-center">ยืนยันลงทะเบียนกิจกรรม <strong>{selectedActivity.title}</strong> ?</p>
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
  const [userInfo, setUserInfo] = useState({ fullName: "", studentId: "", department: "", program: "", year: "", phone: "" });

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

  const handleRegister = async () => {
    if (!selectedActivity || !session?.user?.id) return;

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
        <p><strong>เวลาเริ่มกิจกรรม:</strong> ${new Date(activity.activityStart).toLocaleString()}</p> <!-- ✅ เพิ่ม -->
        <p><strong>เวลาสิ้นสุดกิจกรรม:</strong> ${new Date(activity.activityEnd).toLocaleString()}</p> <!-- ✅ เพิ่ม -->
        ${activity.newsId ? `
          <div style="margin-top:15px;">
            <a href="${newsLink}" target="_blank" 
              style="
                display: inline-block;
                background-color:rgb(236, 134, 0); 
                color: white; 
                padding: 8px 16px; 
                border-radius: 8px; 
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
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-4xl font-bold mb-10 text-center">ลงทะเบียนกิจกรรม</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white text-gray-900 dark:bg-gray-800 dark:text-white rounded-xl shadow-lg">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left"><FaInfoCircle className="inline mr-2" />กิจกรรม</th>
                <th className="p-3 text-left"><FaCalendarAlt className="inline mr-2" />เปิดลงทะเบียน</th>
                <th className="p-3 text-left"><FaClock className="inline mr-2" />ปิดลงทะเบียน</th>
                <th className="p-3 text-left"><FaUsers className="inline mr-2" />ผู้เข้าร่วม</th>
                <th className="p-3 text-left"><FaCheckCircle className="inline mr-2" />สถานะ</th>
                <th className="p-3 text-left"><FaPlusCircle className="inline mr-2" />ลงทะเบียน</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr key={a._id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
                  <td className="p-3 text-blue-400 hover:underline" onClick={() => handleActivityInfo(a)}>{a.title}</td>
                  <td className="p-3">{new Date(a.registerStart).toLocaleString()}</td>
                  <td className="p-3">{new Date(a.registerEnd).toLocaleString()}</td>
                  <td className="p-3">{a.participants.length}/{a.maxParticipants}</td>
                  <td className="p-3">{a.status === "open" ? <span className="text-green-400">เปิด</span> : <span className="text-red-400">ปิด</span>}</td>
                  <td className="p-3">
                    {registeredActivities.includes(a._id) ? (
                      <span className="text-gray-400 italic">ลงทะเบียนแล้ว</span>
                    ) : a.participants.length >= a.maxParticipants ? (
                      <span className="text-red-500 italic">เต็ม</span>
                    ) : a.status === "open" ? (
                      <button onClick={() => { setSelectedActivity(a); setShowPopup(true); }} className="bg-orange-700 hover:bg-blue-400 text-white px-4 py-2 rounded-xl">ลงทะเบียน</button>
                    ) : (
                      <span className="text-gray-400 italic">ปิด</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPopup && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl w-96">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-500">ยืนยันการลงทะเบียน</h2>
            <p className="mb-6 text-center text-black">
              คุณต้องการลงทะเบียนกิจกรรม <strong>{selectedActivity.title}</strong> ใช่ไหม?
             </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowPopup(false)} className="bg-gray-300 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-500 px-4 py-2 rounded text-gray-900 dark:text-white">ยกเลิก</button>
              <button onClick={handleRegister} className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded">ยืนยัน</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
