
// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Image from "next/image";
// import Link from "next/link";
// import { FaUser, FaChartBar, FaPercentage, FaSpinner, FaBullhorn } from "react-icons/fa";
// import { motion } from "framer-motion";

// type Activity = {
//   _id: string;
//   title: string;
//   time: string;
//   participants?: { _id: string }[];
//   maxParticipants?: number;
// };

// type News = {
//   _id: string;
//   title: string;
//   image: string;
//   content: string;
// };

// export default function HomePage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [news, setNews] = useState<News[]>([]);
//   const [onlineUsers, setOnlineUsers] = useState(0);
//   const [totalUsers, setTotalUsers] = useState(100);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, router]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const activityRes = await fetch("/api/activities");
//         const fetchedActivities: Activity[] = await activityRes.json();
//         setActivities(
//           fetchedActivities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5)
//         );

//         const newsRes = await fetch("/api/news");
//         const fetchedNews: News[] = await newsRes.json();
//         setNews(fetchedNews);

//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   useEffect(() => {
//     async function fetchOnlineUsers() {
//       try {
//         const response = await fetch("/api/online-users", { cache: "no-store" });
//         const data = await response.json();
//         setOnlineUsers(data.count || 0);
//       } catch (error) {
//         console.error("Error fetching online users:", error);
//       }
//     }
//     fetchOnlineUsers();
//     const interval = setInterval(fetchOnlineUsers, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   const calculateParticipationRate = (activity: Activity): number => {
//     if (!activity.maxParticipants) return 0;
//     return ((activity.participants?.length || 0) / activity.maxParticipants) * 100;
//   };

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 800,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 4000,
//     cssEase: "ease-in-out",
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white animate-pulse">
//         <FaSpinner className="animate-spin text-4xl text-orange-400 mb-4" />
//         กำลังโหลดข้อมูล...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white px-4 py-8 animate-fade-in">
//       <div className="w-full max-w-6xl px-6 py-8 bg-gray-800 rounded-lg shadow-lg mx-auto">
//         {/* Slider - Display news images */}
//         <div className="mb-8">
//           {news.length === 0 ? (
//             <div className="text-center">ไม่มีข่าวสารให้แสดง</div>
//           ) : (
//             <>
//               <Slider {...sliderSettings}>
//                 {news.slice(0, 5).map((newsItem) => (
//                   <Link key={newsItem._id} href={`/news/${newsItem._id}`}>
//                     <div className="relative w-full h-[450px] overflow-hidden rounded-lg group cursor-pointer">
//                       <Image
//                         src={newsItem.image}
//                         alt={newsItem.title}
//                         layout="fill"
//                         objectFit="cover"
//                         className="group-hover:scale-105 transition-transform duration-300"
//                       />
//                       <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-sm text-center">
//                         {newsItem.title}
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </Slider>
//               <div className="flex justify-center mt-4">
//                 <Link href="/news">
//                   <button className="bg-orange-900 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-sm">ดูข่าวทั้งหมด</button>
//                 </Link>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
//           {[
//             { icon: FaUser, label: "ผู้ใช้ออนไลน์", value: onlineUsers },
//             { icon: FaChartBar, label: "กิจกรรมทั้งหมด", value: activities.length },
//             { icon: FaPercentage, label: "เปอร์เซ็นผู้เข้าร่วมกิจกรรม", value: `${(
//                 (activities.reduce((sum, a) => sum + (a.participants?.length || 0), 0) / totalUsers) * 100
//               ).toFixed(2)}%` },
//           ].map((item, index) => (
//             <motion.div
//               key={index}
//               whileHover={{ scale: 1.05 }}
//               className="bg-gray-700 p-6 rounded-lg text-center shadow-md"
//             >
//               <item.icon className="text-4xl text-orange-400 mb-3" />
//               <h2 className="text-lg font-semibold mb-2">{item.label}</h2>
//               <p className="text-3xl font-bold text-orange-400">{item.value}</p>
//             </motion.div>
//           ))}
//         </div>

//         {/* ตารางกิจกรรม */}
//         <table className="w-full bg-gray-700 rounded-lg overflow-hidden text-white">
//           <thead className="bg-gray-600">
//             <tr>
//               <th className="p-4 text-left flex items-center gap-2"><FaBullhorn />กิจก รรม</th>
//               <th className="p-4 text-left"> ผู้เข้าร่วมกิจกรรม</th>
//             </tr>
//           </thead>
//           <tbody>
//             {activities.length === 0 ? (
//               <tr>
//                 <td colSpan={2} className="p-4 text-center">
//                   ไม่มีข้อมูลกิจกรรม
//                 </td>
//               </tr>
//             ) : (
//               activities.map((activity) => (
//                 <tr key={activity._id} className="hover:bg-gray-600 transition">
//                   <td className="p-4">{activity.title}</td>
//                   <td className="p-4">
//                     <div className="flex items-center">
//                       <div className="w-full bg-gray-500 rounded-full h-2">
//                         <div
//                           className="bg-orange-400 h-2 rounded-full"
//                           style={{ width: `${calculateParticipationRate(activity)}%` }}
//                         ></div>
//                       </div>
//                       <span className="ml-2">{calculateParticipationRate(activity).toFixed(2)}%</span>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }



// app/page.tsx (หรือไฟล์ component ที่มึงใช้)

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";
import { FaUser, FaChartBar, FaPercentage, FaSpinner, FaBullhorn } from "react-icons/fa";
import { motion } from "framer-motion";

type Activity = {
  _id: string;
  title: string;
  time: string;
  participants?: { _id: string }[];
  maxParticipants?: number;
};

type News = {
  _id: string;
  title: string;
  image: string;
  content: string;
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const activityRes = await fetch("/api/activities");
        const fetchedActivities: Activity[] = await activityRes.json();
        setActivities(
          fetchedActivities
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, 5)
        );

        const newsRes = await fetch("/api/news");
        const fetchedNews: News[] = await newsRes.json();
        setNews(fetchedNews);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchOnlineUsers() {
      try {
        const response = await fetch("/api/online-users", { cache: "no-store" });
        const data = await response.json();
        setOnlineUsers(data.count || 0);
      } catch (error) {
        console.error("Error fetching online users:", error);
      }
    }
    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  const calculateParticipationRate = (activity: Activity): number => {
    if (!activity.maxParticipants) return 0;
    return ((activity.participants?.length || 0) / activity.maxParticipants) * 100;
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
  };

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="text-orange-400 text-6xl"
      >
        <FaSpinner />
      </motion.div>
      <span className="ml-4 text-xl">กำลังโหลดข้อมูล...</span>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-900 text-white px-4 py-8 animate-fade-in">
      <div className="w-full max-w-6xl px-6 py-8 bg-gray-800 rounded-lg shadow-lg mx-auto">
        {/* Slider - Display news images */}
        <div className="mb-8">
          {news.length === 0 ? (
            <div className="text-center">ไม่มีข่าวสารให้แสดง</div>
          ) : (
            <>
              <Slider {...sliderSettings}>
                {news.slice(0, 5).map((newsItem) => (
                  <Link key={newsItem._id} href={`/news/${newsItem._id}`}>
                    <div className="relative w-full h-[450px] overflow-hidden rounded-lg group cursor-pointer">
                      <Image
                        src={newsItem.image}
                        alt={newsItem.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-sm text-center">
                        {newsItem.title}
                      </div>
                    </div>
                  </Link>
                ))}
              </Slider>
              <div className="flex justify-center mt-4">
                <Link href="/news">
                  <button className="bg-orange-900 hover:bg-blue-500 text-white px-6 py-2 rounded-full text-sm">ดูข่าวทั้งหมด</button>
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {[
            { icon: FaUser, label: "ผู้ใช้ออนไลน์", value: onlineUsers },
            { icon: FaChartBar, label: "กิจกรรมทั้งหมด", value: activities.length },
            {
              icon: FaPercentage,
              label: "เปอร์เซ็นผู้เข้าร่วมกิจกรรม",
              value: `${(
                (activities.reduce((sum, a) => sum + (a.participants?.length || 0), 0) / totalUsers) *
                100
              ).toFixed(2)}%`,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-700 p-6 rounded-lg text-center shadow-md"
            >
              <item.icon className="text-4xl text-orange-400 mb-3" />
              <h2 className="text-lg font-semibold mb-2">{item.label}</h2>
              <p className="text-3xl font-bold text-orange-400">{item.value}</p>
            </motion.div>
          ))}
        </div>

        {/* ตารางกิจกรรม */}
        <table className="w-full bg-gray-700 rounded-lg overflow-hidden text-white">
          <thead className="bg-gray-600">
            <tr>
              <th className="p-4 text-left flex items-center gap-2">
                <FaBullhorn />
                กิจกรรม
              </th>
              <th className="p-4 text-left">ผู้เข้าร่วมกิจกรรม</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-4 text-center">
                  ไม่มีข้อมูลกิจกรรม
                </td>
              </tr>
            ) : (
              activities.map((activity) => (
                <tr key={activity._id} className="hover:bg-gray-600 transition">
                  <td className="p-4">{activity.title}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-500 rounded-full h-2">
                        <div
                          className="bg-orange-400 h-2 rounded-full"
                          style={{ width: `${calculateParticipationRate(activity)}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{calculateParticipationRate(activity).toFixed(2)}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
