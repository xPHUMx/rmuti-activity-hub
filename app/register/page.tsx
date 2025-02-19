
// "use client";

// import { useSession } from "next-auth/react";
// import { useEffect, useState } from "react";
// import { FaCheckCircle, FaTimesCircle, FaUser, FaPlusCircle, FaCalendarAlt, FaClock, FaUsers, FaTimes, FaPencilAlt, FaInfoCircle } from "react-icons/fa";
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

// export default function RegisterPage() {
//   const { data: session } = useSession();
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [registeredActivities, setRegisteredActivities] = useState<string[]>([]);
//   const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [userInfo, setUserInfo] = useState({
//     fullName: "",
//     studentId: "",
//     department: "",
//     year: "",
//     phone: "",
//   });

//   useEffect(() => {
//     async function fetchActivitiesAndRegistrations() {
//       try {
//         const activitiesRes = await fetch("/api/activities");
//         if (!activitiesRes.ok) {
//           throw new Error("Failed to fetch activities");
//         }
//         const activities = await activitiesRes.json();
//         setActivities(activities);
  
//         if (session?.user?.id) {
//           // ดึงข้อมูลผู้ใช้จาก API
//           const userRes = await fetch(`/api/users/${session.user.id}`);
//           if (!userRes.ok) {
//             throw new Error("Failed to fetch user data");
//           }
//           const userData = await userRes.json();
//           setUserInfo({
//             fullName: userData.name,
//             studentId: userData.studentId,
//             department: userData.department || "",
//             year: userData.year || "",
//             phone: userData.phone || "",
//           });

//           const registeredRes = await fetch(
//             `/api/users/registrations?userId=${session.user.id}`
//           );
//           if (!registeredRes.ok) {
//             throw new Error("Failed to fetch registered activities");
//           }
//           const registeredData = await registeredRes.json();
  
//           if (registeredData.message === "No registered activities found") {
//             setRegisteredActivities([]);
//           } else {
//             setRegisteredActivities(
//               registeredData
//                 .filter((reg: any) => reg.activityId) // ตรวจสอบว่า activityId ไม่ใช่ null
//                 .map((reg: any) => reg.activityId._id)
//             );
//           }
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

//   const handleRegister = async () => {
//     if (!selectedActivity || !session?.user?.id) {
//       Swal.fire({
//         icon: "error",
//         title: "ข้อผิดพลาด",
//         text: "ไม่สามารถลงทะเบียนได้ กรุณาลงทะเบียนกิจกรรมก่อน",
//       });
//       return;
//     }
  
//     // ตรวจสอบข้อมูลจาก session.user เพื่อสร้าง participant
//     const participant = {
//       fullName: userInfo.fullName || "",
//       studentId: userInfo.studentId || "",
//       department: userInfo.department || "",  // เพิ่ม department
//       year: userInfo.year || "",
//       phone: userInfo.phone || "",
//     };
  
//     // ตรวจสอบว่า participant มีข้อมูลครบถ้วนหรือไม่
//     if (!participant.studentId || !participant.year || !participant.phone) {
//       Swal.fire({
//         icon: "warning",
//         title: "ข้อมูลไม่ครบถ้วน",
//         text: "กรุณาตรวจสอบข้อมูลส่วนตัวของคุณให้ครบถ้วน",
//       });
//       return;
//     }
  
//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           activityId: selectedActivity._id,
//           participant: participant,
//           userId: session.user.id,
//         }),
//       });
  
//       if (!res.ok) {
//         const errorData = await res.json();
//         Swal.fire({
//           icon: "error",
//           title: "ข้อผิดพลาด",
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
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "ตกลง",
//       });
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
//         <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">
//           ลงทะเบียนกิจกรรม
//         </h1>
//         <table className="w-full bg-gray-800 rounded-lg shadow-lg">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="p-3 text-left"><FaInfoCircle className="inline-block mr-2" />ชื่อกิจกรรม</th>
//               <th className="p-3 text-left"><FaCalendarAlt className="inline-block mr-2" />เวลาเริ่ม</th>
//               <th className="p-3 text-left"><FaClock className="inline-block mr-2" />เวลาปิด</th>
//               <th className="p-3 text-left"><FaUsers className="inline-block mr-2" />จำนวนผู้เข้าร่วม/สูงสุด</th>
//               <th className="p-3 text-left"><FaCheckCircle className="inline-block mr-2" />สถานะ</th>
//               <th className="p-3 text-left"><FaPlusCircle className="inline-block mr-2" />ลงทะเบียน</th>
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
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
//               <FaPencilAlt /> ยืนยันการลงทะเบียน
//             </h2>
//             <div className="text-white mb-4">
//               <p>คุณต้องการลงทะเบียนกิจกรรม <strong>{selectedActivity?.title}</strong> หรือไม่?</p>
//             </div>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setShowPopup(false)}
//                 className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
//               >
//                 <FaTimes />
//                 ยกเลิก
//               </button>
//               <button
//                 onClick={handleRegister}
//                 className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-400"
//               >
//                 <FaCheckCircle />
//                 ยืนยัน
//               </button>
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
//   FaCheckCircle, FaTimesCircle, FaUser, FaPlusCircle, FaCalendarAlt, 
//   FaClock, FaUsers, FaTimes, FaPencilAlt, FaInfoCircle 
// } from "react-icons/fa";
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

// export default function RegisterPage() {
//   const { data: session } = useSession();
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [registeredActivities, setRegisteredActivities] = useState<string[]>([]);
//   const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [userInfo, setUserInfo] = useState({
//     fullName: "",
//     studentId: "",
//     department: "",
//     year: "",
//     phone: "",
//   });

//   useEffect(() => {
//     async function fetchActivitiesAndRegistrations() {
//       try {
//         const activitiesRes = await fetch("/api/activities");
//         if (!activitiesRes.ok) {
//           throw new Error("Failed to fetch activities");
//         }
//         let activities = await activitiesRes.json();

//         // 🔹 เรียงกิจกรรมจากใหม่ไปเก่า
//         activities = activities.sort(
//           (a: Activity, b: Activity) => new Date(b.time).getTime() - new Date(a.time).getTime()
//         );

//         setActivities(activities);
  
//         if (session?.user?.id) {
//           const userRes = await fetch(`/api/users/${session.user.id}`);
//           if (!userRes.ok) {
//             throw new Error("Failed to fetch user data");
//           }
//           const userData = await userRes.json();
//           setUserInfo({
//             fullName: userData.name,
//             studentId: userData.studentId,
//             department: userData.department || "",
//             year: userData.year || "",
//             phone: userData.phone || "",
//           });

//           const registeredRes = await fetch(
//             `/api/users/registrations?userId=${session.user.id}`
//           );
//           if (!registeredRes.ok) {
//             throw new Error("Failed to fetch registered activities");
//           }
//           const registeredData = await registeredRes.json();
  
//           if (registeredData.message === "No registered activities found") {
//             setRegisteredActivities([]);
//           } else {
//             setRegisteredActivities(
//               registeredData
//                 .filter((reg: any) => reg.activityId)
//                 .map((reg: any) => reg.activityId._id)
//             );
//           }
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

//   const handleRegister = async () => {
//     if (!selectedActivity || !session?.user?.id) {
//       Swal.fire({
//         icon: "error",
//         title: "ข้อผิดพลาด",
//         text: "ไม่สามารถลงทะเบียนได้ กรุณาลงทะเบียนกิจกรรมก่อน",
//       });
//       return;
//     }
  
//     const participant = {
//       fullName: userInfo.fullName || "",
//       studentId: userInfo.studentId || "",
//       department: userInfo.department || "",
//       year: userInfo.year || "",
//       phone: userInfo.phone || "",
//     };
  
//     try {
//       const res = await fetch("/api/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           activityId: selectedActivity._id,
//           participant: participant,
//           userId: session.user.id,
//         }),
//       });
  
//       if (!res.ok) {
//         const errorData = await res.json();
//         Swal.fire({
//           icon: "error",
//           title: "ข้อผิดพลาด",
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
//         confirmButtonColor: "#3085d6",
//         confirmButtonText: "ตกลง",
//       });
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
//         <h1 className="text-4xl font-bold mb-6 text-center text-blue-400">
//           ลงทะเบียนกิจกรรม
//         </h1>
//         <table className="w-full bg-gray-800 rounded-lg shadow-lg">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="p-3 text-left"><FaInfoCircle className="inline-block mr-2" />ชื่อกิจกรรม</th>
//               <th className="p-3 text-left"><FaCalendarAlt className="inline-block mr-2" />เวลาเริ่ม</th>
//               <th className="p-3 text-left"><FaClock className="inline-block mr-2" />เวลาปิด</th>
//               <th className="p-3 text-left"><FaUsers className="inline-block mr-2" />จำนวนผู้เข้าร่วม/สูงสุด</th>
//               <th className="p-3 text-left"><FaCheckCircle className="inline-block mr-2" />สถานะ</th>
//               <th className="p-3 text-left"><FaPlusCircle className="inline-block mr-2" />ลงทะเบียน</th>
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
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-2xl font-bold mb-4 text-blue-400 flex items-center gap-2">
//               <FaPencilAlt /> ยืนยันการลงทะเบียน
//             </h2>
//             <div className="text-white mb-4">
//               <p>คุณต้องการลงทะเบียนกิจกรรม <strong>{selectedActivity?.title}</strong> หรือไม่?</p>
//             </div>
//             <div className="flex justify-end gap-4">
//               <button
//                 onClick={() => setShowPopup(false)}
//                 className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
//               >
//                 <FaTimes />
//                 ยกเลิก
//               </button>
//               <button
//                 onClick={handleRegister}
//                 className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-400"
//               >
//                 <FaCheckCircle />
//                 ยืนยัน
//               </button>
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
  FaCheckCircle, FaTimesCircle, FaUser, FaPlusCircle, FaCalendarAlt, 
  FaClock, FaUsers, FaTimes, FaPencilAlt, FaInfoCircle 
} from "react-icons/fa";
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
    year: "",
    phone: "",
  });

  useEffect(() => {
    async function fetchActivitiesAndRegistrations() {
      try {
        const activitiesRes = await fetch("/api/activities");
        if (!activitiesRes.ok) {
          throw new Error("Failed to fetch activities");
        }
        let activities = await activitiesRes.json();

        // 🔹 เรียงกิจกรรมจากใหม่ไปเก่า
        activities = activities.sort(
          (a: Activity, b: Activity) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );

        setActivities(activities);

        if (session?.user?.id) {
          const userRes = await fetch(`/api/users/${session.user.id}`);
          if (!userRes.ok) {
            throw new Error("Failed to fetch user data");
          }
          const userData = await userRes.json();
          setUserInfo({
            fullName: userData.name,
            studentId: userData.studentId,
            department: userData.department || "",
            year: userData.year || "",
            phone: userData.phone || "",
          });

          const registeredRes = await fetch(
            `/api/users/registrations?userId=${session.user.id}`
          );
          if (!registeredRes.ok) {
            throw new Error("Failed to fetch registered activities");
          }
          const registeredData = await registeredRes.json();

          if (registeredData.message === "No registered activities found") {
            setRegisteredActivities([]);
          } else {
            setRegisteredActivities(
              registeredData
                .filter((reg: any) => reg.activityId)
                .map((reg: any) => reg.activityId._id)
            );
          }
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

  const handleRegister = async () => {
    if (!selectedActivity || !session?.user?.id) {
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถลงทะเบียนได้ กรุณาลงทะเบียนกิจกรรมก่อน",
      });
      return;
    }

    const participant = {
      fullName: userInfo.fullName || "",
      studentId: userInfo.studentId || "",
      department: userInfo.department || "",
      year: userInfo.year || "",
      phone: userInfo.phone || "",
    };

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId: selectedActivity._id,
          participant: participant,
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
    } catch (error) {
      console.error("Error registering:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถลงทะเบียนได้ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  const handleActivityInfo = (activity: Activity) => {
    Swal.fire({
      title: activity.title,
      html: `<p><strong>รายละเอียด:</strong> ${activity.description}</p>
             <p><strong>สถานที่:</strong> ${activity.location}</p>
             <p><strong>เวลาเปิดลงทะเบียน:</strong> ${new Date(activity.time).toLocaleString()}</p>
             <p><strong>เวลาปิดลงทะเบียน:</strong> ${new Date(activity.closeTime).toLocaleString()}</p>
             <p><strong>จำนวนผู้เข้าร่วม:</strong> ${activity.participants.length}/${activity.maxParticipants}</p>`,
      icon: "info",
      confirmButtonText: "ปิด"
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-white-400">
          ลงทะเบียนกิจกรรม
        </h1>
        <table className="w-full bg-gray-800 rounded-lg shadow-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 text-left"><FaInfoCircle className="inline-block mr-2" />ชื่อกิจกรรม</th>
              <th className="p-3 text-left"><FaCalendarAlt className="inline-block mr-2" />เวลาเปิดลงทะเบียน</th>
              <th className="p-3 text-left"><FaClock className="inline-block mr-2" />เวลาปิดลงทะเบียน</th>
              <th className="p-3 text-left"><FaUsers className="inline-block mr-2" />จำนวนผู้เข้าร่วม/สูงสุด</th>
              <th className="p-3 text-left"><FaCheckCircle className="inline-block mr-2" />สถานะ</th>
              <th className="p-3 text-left"><FaPlusCircle className="inline-block mr-2" />ลงทะเบียน</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id} className="hover:bg-gray-600">
                <td className="p-3 cursor-pointer text-blue-400" onClick={() => handleActivityInfo(activity)}>
                  {activity.title}
                </td>
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
              <FaPencilAlt /> ยืนยันการลงทะเบียน
            </h2>
            <div className="text-white mb-4">
              <p>คุณต้องการลงทะเบียนกิจกรรม <strong>{selectedActivity?.title}</strong> หรือไม่?</p>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded text-white hover:bg-gray-600"
              >
                <FaTimes />
                ยกเลิก
              </button>
              <button
                onClick={handleRegister}
                className="flex items-center gap-2 bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-400"
              >
                <FaCheckCircle />
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}