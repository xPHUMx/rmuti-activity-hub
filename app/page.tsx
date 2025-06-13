
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
//           fetchedActivities
//             .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
//             .slice(0, 5)
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

// if (loading) {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
//       <motion.div
//         animate={{ rotate: 360 }}
//         transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//         className="text-orange-400 text-6xl"
//       >
//         <FaSpinner />
//       </motion.div>
//     </div>
//   );
// }


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
//                         fill
//                         style={{ objectFit: "cover" }}
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
//             {
//               icon: FaPercentage,
//               label: "เปอร์เซ็นผู้เข้าร่วมกิจกรรม",
//               value: `${(
//                 (activities.reduce((sum, a) => sum + (a.participants?.length || 0), 0) / totalUsers) *
//                 100
//               ).toFixed(2)}%`,
//             },
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
//               <th className="p-4 text-left flex items-center gap-2">
//                 <FaBullhorn />
//                 กิจกรรม
//               </th>
//               <th className="p-4 text-left">ผู้เข้าร่วมกิจกรรม</th>
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


"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image.js";
import Link from "next/link";
import { FaUser, FaChartBar, FaPercentage, FaSpinner, FaBullhorn } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
};

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 800,
  slidesToShow: 1,
  slidesTo: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  cssEase: "ease-in-out",
  arrows: true,
  dotsClass: "custom-dots slick-dots",
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: { scale: 1.03, transition: { duration: 0.3 } },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
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
        const [activityRes, newsRes] = await Promise.all([
          fetch("/api/activities"),
          fetch("/api/news"),
        ]);
        const [fetchedActivities, fetchedNews]: [Activity[], News[]] = await Promise.all([
          activityRes.json(),
          newsRes.json(),
        ]);
        setActivities(
          fetchedActivities
            .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
            .slice(0, 5)
        );
        setNews(fetchedNews);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
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



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        {/* News Slider */}
        <section className="relative">
          {news.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 text-lg"
            >
              ไม่มีข่าวสารให้แสดง
            </motion.div>
          ) : (
            <>
              <Slider {...sliderSettings}>
                {news.slice(0, 5).map((newsItem) => (
                  <Link key={newsItem._id} href={`/news/${newsItem._id}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
                    >
                      <Image
                        src={newsItem.image}
                        alt={newsItem.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-500 hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                        <motion.h2
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-xl font-semibold"
                        >
                          {newsItem.title}
                        </motion.h2>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </Slider>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center mt-6"
              >
                <Link href="/news">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-md">
                    ดูข่าวทั้งหมด
                  </button>
                </Link>
              </motion.div>
            </>
          )}
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: FaUser, label: "ผู้ใช้ออนไลน์", value: onlineUsers },
            { icon: FaChartBar, label: "กิจกรรมทั้งหมด", value: activities.length },
            {
              icon: FaPercentage,
              label: "เปอร์เซ็นผู้เข้าร่วม",
              value: `${(
                (activities.reduce((sum, a) => sum + (a.participants?.length || 0), 0) / totalUsers) *
                100
              ).toFixed(2)}%`,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center"
            >
              <item.icon className="text-4xl text-orange-400 mb-4" />
              <h2 className="text-lg font-medium text-gray-200">{item.label}</h2>
              <p className="text-3xl font-bold text-orange-400">{item.value}</p>
            </motion.div>
          ))}
        </section>

        {/* Activities Table */}
        <section className="bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4 flex items-center gap-2 font-medium">
                  <FaBullhorn className="text-orange-400" />
                  กิจกรรม
                </th>
                <th className="p-4 font-medium">ผู้เข้าร่วม</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {activities.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={2} className="p-4 text-center text-gray-400">
                      ไม่มีข้อมูลกิจกรรม
                    </td>
                  </motion.tr>
                ) : (
                  activities.map((activity, index) => (
                    <motion.tr
                      key={activity._id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gray-700 transition-colors"
                    >
                      <td className="p-4">{activity.title}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-600 rounded-full h-2.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${calculateParticipationRate(activity)}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="bg-orange-400 h-full rounded-full"
                            />
                          </div>
                          <span className="text-sm text-gray-300">
                            {calculateParticipationRate(activity).toFixed(2)}%
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </section>
      </motion.div>

    </div>
  );
}