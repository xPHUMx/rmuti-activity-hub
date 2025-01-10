
// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Image from "next/image";
// import { FaUser, FaChartBar, FaPercentage } from "react-icons/fa";

// // กำหนดประเภทของรูปภาพ
// type ImageType = {
//   _id: string;
//   title: string;
//   url: string;
// };

// // กำหนดประเภทของกิจกรรม
// type Activity = {
//   _id: string;
//   title: string;
//   time: string;
//   participants?: { _id: string }[];
//   maxParticipants?: number;
// };

// export default function HomePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [images, setImages] = useState<ImageType[]>([]);
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [onlineUsers, setOnlineUsers] = useState(0); // จำนวนผู้ใช้ออนไลน์
//   const [totalUsers, setTotalUsers] = useState(100); // ตัวอย่างจำนวนผู้ใช้ในระบบ

//   // รีไดเรกต์ไปยังหน้าล็อกอินถ้าไม่ได้ล็อกอิน
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, router]);

//   // ดึงข้อมูลรูปภาพและกิจกรรม
//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // ดึงข้อมูลรูปภาพ
//         const imageRes = await fetch("/api/upload");
//         if (!imageRes.ok) {
//           throw new Error(`Error fetching images: ${imageRes.status}`);
//         }
//         const fetchedImages: ImageType[] = await imageRes.json();
//         setImages(fetchedImages);

//         // ดึงข้อมูลกิจกรรม
//         const activityRes = await fetch("/api/activities");
//         if (!activityRes.ok) {
//           throw new Error(`Error fetching activities: ${activityRes.status}`);
//         }
//         const fetchedActivities: Activity[] = await activityRes.json();

//         setActivities(
//           fetchedActivities
//             .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
//             .slice(0, 5) // 5 กิจกรรมล่าสุด
//         );
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchData();
//   }, []);

//   // เชื่อมต่อ WebSocket สำหรับแสดงจำนวนผู้ใช้ออนไลน์
//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:8080"); // แก้ไข URL ให้ตรงกับเซิร์ฟเวอร์ WebSocket ของคุณ

//     // เมื่อเชื่อมต่อสำเร็จ
//     socket.onopen = () => {
//       console.log("WebSocket connected");
//     };

//     // เมื่อได้รับข้อความจากเซิร์ฟเวอร์
//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.onlineCount !== undefined) {
//         setOnlineUsers(data.onlineCount);
//       }
//     };

//     // เมื่อการเชื่อมต่อตัดขาด
//     socket.onclose = () => {
//       console.log("WebSocket disconnected");
//     };

//     // ทำความสะอาดเมื่อ component ถูกลบ
//     return () => {
//       socket.close();
//     };
//   }, []);

//   // คำนวณเปอร์เซ็นต์ผู้เข้าร่วมกิจกรรม
//   const calculateParticipationRate = (activity: Activity): number => {
//     if (!activity.maxParticipants) return 0;
//     return ((activity.participants?.length || 0) / activity.maxParticipants) * 100;
//   };

//   // การตั้งค่าของ Slider
//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//   };

//   return (
//     <div
//       className="min-h-screen flex flex-col items-center justify-center"
//       style={{
//         backgroundImage: `url('/img/PC screen 1.png')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//       }}
//     >
//       <div className="w-full max-w-7xl px-4 py-8 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg">
//         <h1 className="text-4xl font-bold text-center mb-6 text-white">หน้าหลัก</h1>

//         {/* Slider แสดงรูปภาพ */}
//         <div className="mb-8">
//           <Slider {...sliderSettings}>
//             {images.map((image) => (
//               <div key={image._id} className="relative w-full h-[400px]">
//                 <Image
//                   src={image.url}
//                   alt={image.title}
//                   layout="fill"
//                   objectFit="cover"
//                   className="rounded-lg shadow-md"
//                 />
//               </div>
//             ))}
//           </Slider>
//         </div>

//         {/* Cards แสดงข้อมูล */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
//             <FaUser className="text-4xl text-green-400 mb-2" />
//             <h2 className="text-lg font-bold text-white mb-2">ผู้ออนไลน์ในระบบ</h2>
//             <p className="text-3xl font-bold text-green-400">{onlineUsers}</p>
//           </div>
//           <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
//             <FaChartBar className="text-4xl text-blue-400 mb-2" />
//             <h2 className="text-lg font-bold text-white mb-2">กิจกรรมทั้งหมด</h2>
//             <p className="text-3xl font-bold text-blue-400">{activities.length}</p>
//           </div>
//           <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center">
//             <FaPercentage className="text-4xl text-yellow-400 mb-2" />
//             <h2 className="text-lg font-bold text-white mb-2">เปอร์เซ็นคนเข้าร่วมกิจกรรม</h2>
//             <p className="text-3xl font-bold text-yellow-400">
//               {(
//                 (activities.reduce(
//                   (sum, activity) => sum + (activity.participants?.length || 0),
//                   0
//                 ) /
//                   totalUsers) *
//                 100
//               ).toFixed(2)}
//               %
//             </p>
//           </div>
//         </div>

//         {/* ตารางกิจกรรมล่าสุด */}
//         <h2 className="text-2xl font-bold mb-4 text-white">กิจกรรมล่าสุด</h2>
//         <table className="w-full bg-gray-800 rounded-lg overflow-hidden text-white">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="p-4 text-left">ชื่อกิจกรรม</th>
//               <th className="p-4 text-left">เปอร์เซ็นผู้เข้าร่วม</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activities.map((activity) => (
//               <tr key={activity._id} className="hover:bg-gray-600 transition">
//                 <td className="p-4">{activity.title}</td>
//                 <td className="p-4">
//                   <div className="flex items-center">
//                     <div className="w-full bg-gray-700 rounded-full h-2">
//                       <div
//                         className="bg-blue-500 h-2 rounded-full"
//                         style={{
//                           width: `${calculateParticipationRate(activity)}%`,
//                         }}
//                       ></div>
//                     </div>
//                     <span className="ml-2">
//                       {calculateParticipationRate(activity).toFixed(2)}%
//                     </span>
//                   </div>
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
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Image from "next/image";
// import { FaUser, FaChartBar, FaPercentage } from "react-icons/fa";

// type ImageType = {
//   _id: string;
//   title: string;
//   url: string;
// };

// type Activity = {
//   _id: string;
//   title: string;
//   time: string;
//   participants?: { _id: string }[];
//   maxParticipants?: number;
// };

// export default function HomePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [images, setImages] = useState<ImageType[]>([]);
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [onlineUsers, setOnlineUsers] = useState(0);
//   const [totalUsers, setTotalUsers] = useState(100);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, router]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const imageRes = await fetch("/api/upload");
//         if (!imageRes.ok) throw new Error(`Error fetching images: ${imageRes.status}`);
//         const fetchedImages: ImageType[] = await imageRes.json();
//         setImages(fetchedImages);

//         const activityRes = await fetch("/api/activities");
//         if (!activityRes.ok) throw new Error(`Error fetching activities: ${activityRes.status}`);
//         const fetchedActivities: Activity[] = await activityRes.json();
//         setActivities(
//           fetchedActivities
//             .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
//             .slice(0, 5)
//         );
//       } catch (error) {
//         console.error(error);
//       }
//     }
//     fetchData();
//   }, []);

//   useEffect(() => {
//     const socket = new WebSocket("ws://localhost:8080");

//     socket.onopen = () => console.log("WebSocket connected");
//     socket.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (data.onlineCount !== undefined) setOnlineUsers(data.onlineCount);
//     };
//     socket.onclose = () => console.log("WebSocket disconnected");

//     return () => {
//       socket.close();
//     };
//   }, []);

//   const calculateParticipationRate = (activity: Activity): number => {
//     if (!activity.maxParticipants) return 0;
//     return ((activity.participants?.length || 0) / activity.maxParticipants) * 100;
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
//       <div className="w-full max-w-5xl px-6 py-8 bg-gray-800 rounded-lg shadow-lg">
//         <h1 className="text-3 font-semibold text-center mb-6 text-white"> Rmuti KKC | Activity Hub</h1>

//         {/* Slider */}
//         <div className="mb-8">
//           <Slider {...sliderSettings}>
//             {images.map((image) => (
//               <div key={image._id} className="relative w-full h-[450px]">
//                 <Image
//                   src={image.url}
//                   alt={image.title}
//                   layout="fill"
//                   objectFit="cover"
//                   className="rounded-lg"
//                 />
//               </div>
//             ))}
//           </Slider>
//         </div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <div className="bg-gray-700 p-6 rounded-lg text-center shadow">
//             <FaUser className="text-4xl text-green-400 mb-3" />
//             <h2 className="text-lg font-semibold text-white mb-2">ผู้ใช้ออนไลน์</h2>
//             <p className="text-3xl font-bold text-green-400">{onlineUsers}</p>
//           </div>
//           <div className="bg-gray-700 p-6 rounded-lg text-center shadow">
//             <FaChartBar className="text-4xl text-blue-400 mb-3" />
//             <h2 className="text-lg font-semibold text-white mb-2">กิจกรรมทั้งหมด</h2>
//             <p className="text-3xl font-bold text-blue-400">{activities.length}</p>
//           </div>
//           <div className="bg-gray-700 p-6 rounded-lg text-center shadow">
//             <FaPercentage className="text-4xl text-yellow-400 mb-3" />
//             <h2 className="text-lg font-semibold text-white mb-2">เปอร์เซ็นผู้เข้าร่วม</h2>
//             <p className="text-3xl font-bold text-yellow-400">
//               {(
//                 (activities.reduce(
//                   (sum, activity) => sum + (activity.participants?.length || 0),
//                   0
//                 ) /
//                   totalUsers) *
//                 100
//               ).toFixed(2)}
//               %
//             </p>
//           </div>
//         </div>

//         {/* ตารางกิจกรรม */}
//         <table className="w-full bg-gray-700 rounded-lg overflow-hidden text-white">
//           <thead className="bg-gray-600">
//             <tr>
//               <th className="p-4 text-left">ชื่อกิจกรรม</th>
//               <th className="p-4 text-left">เปอร์เซ็นผู้เข้าร่วม</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activities.map((activity) => (
//               <tr key={activity._id} className="hover:bg-gray-600 transition">
//                 <td className="p-4">{activity.title}</td>
//                 <td className="p-4">
//                   <div className="flex items-center">
//                     <div className="w-full bg-gray-500 rounded-full h-2">
//                       <div
//                         className="bg-orange-400 h-2 rounded-full"
//                         style={{
//                           width: `${calculateParticipationRate(activity)}%`,
//                         }}
//                       ></div>
//                     </div>
//                     <span className="ml-2">
//                       {calculateParticipationRate(activity).toFixed(2)}%
//                     </span>
//                   </div>
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { FaUser, FaChartBar, FaPercentage } from "react-icons/fa";

type ImageType = {
  _id: string;
  title: string;
  url: string;
};

type Activity = {
  _id: string;
  title: string;
  time: string;
  participants?: { _id: string }[];
  maxParticipants?: number;
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [images, setImages] = useState<ImageType[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(100);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const imageRes = await fetch("/api/upload");
        if (!imageRes.ok) throw new Error(`Error fetching images: ${imageRes.status}`);
        const fetchedImages: ImageType[] = await imageRes.json();
        setImages(fetchedImages);

        const activityRes = await fetch("/api/activities");
        if (!activityRes.ok) throw new Error(`Error fetching activities: ${activityRes.status}`);
        const fetchedActivities: Activity[] = await activityRes.json();
        setActivities(
          fetchedActivities
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, 5)
        );
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchOnlineUsers() {
      try {
        const response = await fetch("/api/online-users");
        if (!response.ok) throw new Error(`Error fetching online users: ${response.status}`);
        const data = await response.json();
        setOnlineUsers(data.count || 0); // อัปเดตจำนวนผู้ใช้ออนไลน์
      } catch (error) {
        console.error(error);
      }
    }

    fetchOnlineUsers(); // ดึงข้อมูลผู้ใช้ออนไลน์ครั้งแรก
    const interval = setInterval(fetchOnlineUsers, 10000); // อัปเดตทุก 10 วินาที

    return () => clearInterval(interval); // ลบ Interval เมื่อ Component ถูก unmount
  }, []);

  const calculateParticipationRate = (activity: Activity): number => {
    if (!activity.maxParticipants) return 0;
    return ((activity.participants?.length || 0) / activity.maxParticipants) * 100;
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      <div className="w-full max-w-5xl px-6 py-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3 font-semibold text-center mb-6 text-white"> Rmuti KKC | Activity Hub</h1>

        {/* Slider */}
        <div className="mb-8">
          <Slider {...sliderSettings}>
            {images.map((image) => (
              <div key={image._id} className="relative w-full h-[450px]">
                <Image
                  src={image.url}
                  alt={image.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-700 p-6 rounded-lg text-center shadow">
            <FaUser className="text-4xl text-green-400 mb-3" />
            <h2 className="text-lg font-semibold text-white mb-2">ผู้ใช้ออนไลน์</h2>
            <p className="text-3xl font-bold text-green-400">{onlineUsers}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg text-center shadow">
            <FaChartBar className="text-4xl text-blue-400 mb-3" />
            <h2 className="text-lg font-semibold text-white mb-2">กิจกรรมทั้งหมด</h2>
            <p className="text-3xl font-bold text-blue-400">{activities.length}</p>
          </div>
          <div className="bg-gray-700 p-6 rounded-lg text-center shadow">
            <FaPercentage className="text-4xl text-yellow-400 mb-3" />
            <h2 className="text-lg font-semibold text-white mb-2">เปอร์เซ็นผู้เข้าร่วม</h2>
            <p className="text-3xl font-bold text-yellow-400">
              {(
                (activities.reduce(
                  (sum, activity) => sum + (activity.participants?.length || 0),
                  0
                ) /
                  totalUsers) *
                100
              ).toFixed(2)}
              %
            </p>
          </div>
        </div>

        {/* ตารางกิจกรรม */}
        <table className="w-full bg-gray-700 rounded-lg overflow-hidden text-white">
          <thead className="bg-gray-600">
            <tr>
              <th className="p-4 text-left">ชื่อกิจกรรม</th>
              <th className="p-4 text-left">เปอร์เซ็นผู้เข้าร่วม</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity._id} className="hover:bg-gray-600 transition">
                <td className="p-4">{activity.title}</td>
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="w-full bg-gray-500 rounded-full h-2">
                      <div
                        className="bg-orange-400 h-2 rounded-full"
                        style={{
                          width: `${calculateParticipationRate(activity)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="ml-2">
                      {calculateParticipationRate(activity).toFixed(2)}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
