
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
  slidesToScroll: 1,
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] to-[#121212] text-white">
        <div className="luxury-loader mb-4" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-light tracking-[0.25em] text-[#d4af37]"
        >
          RMUTI ACTIVITY HUB
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#080808] text-white px-4 py-12 md:py-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto space-y-16"
      >
        {/* News Slider */}
        <section className="relative">
          {news.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 font-light text-lg py-20"
            >
              ไม่มีข่าวสารให้แสดงในขณะนี้
            </motion.div>
          ) : (
            <>
              <Slider {...sliderSettings}>
                {news.slice(0, 5).map((newsItem) => (
                  <Link key={newsItem._id} href={`/news/${newsItem._id}`}>
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/[0.03] cursor-pointer"
                    >
                      <Image
                        src={newsItem.image}
                        alt={newsItem.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-700 ease-out hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-8">
                        <motion.h2
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-lg md:text-2xl font-light tracking-wide text-white"
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
                className="flex justify-center mt-8"
              >
                <Link href="/news">
                  <button className="border border-[#d4af37]/40 hover:border-[#d4af37] text-white hover:text-black hover:bg-[#d4af37] px-10 py-3 rounded-full text-xs font-light tracking-widest transition-all duration-500 shadow-[0_0_15px_rgba(212,175,55,0.03)] hover:shadow-[0_0_25px_rgba(212,175,55,0.2)]">
                    ดูข่าวสารทั้งหมด
                  </button>
                </Link>
              </motion.div>
            </>
          )}
        </section>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: FaUser, label: "ผู้ใช้ออนไลน์", value: onlineUsers, unit: "ONLINE" },
            { icon: FaChartBar, label: "กิจกรรมทั้งหมด", value: activities.length, unit: "ACTIVITIES" },
            {
              icon: FaPercentage,
              label: "เปอร์เซ็นผู้เข้าร่วม",
              value: `${(
                (activities.reduce((sum, a) => sum + (a.participants?.length || 0), 0) / totalUsers) *
                100
              ).toFixed(2)}%`,
              unit: "PARTICIPATION"
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white/[0.02] backdrop-blur-xl p-8 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.3)] border border-white/[0.04] flex flex-col items-center gold-glow"
            >
              <item.icon className="text-2xl text-[#d4af37]/80 mb-4" />
              <span className="text-[10px] tracking-[0.25em] font-light text-[#d4af37] mb-1">{item.unit}</span>
              <h2 className="text-xs font-light text-gray-400 mb-3">{item.label}</h2>
              <p className="text-4xl font-extralight tracking-tight text-white">{item.value}</p>
            </motion.div>
          ))}
        </section>

        {/* Activities Table */}
        <section className="bg-white/[0.02] backdrop-blur-xl rounded-2xl shadow-[0_20px_45px_rgba(0,0,0,0.4)] border border-white/[0.04] overflow-hidden">
          <div className="p-6 border-b border-white/[0.04] flex items-center gap-3">
            <FaBullhorn className="text-[#d4af37] text-lg" />
            <h3 className="text-sm font-light tracking-[0.1em] text-gray-200 uppercase">กิจกรรมล่าสุด / Recent Activities</h3>
          </div>
          <table className="w-full text-left">
            <thead className="bg-white/[0.01] border-b border-white/[0.04]">
              <tr>
                <th className="p-4 text-[10px] tracking-[0.2em] font-light text-[#d4af37] uppercase pl-6">ชื่อกิจกรรม (Activity Title)</th>
                <th className="p-4 text-[10px] tracking-[0.2em] font-light text-[#d4af37] uppercase pr-6 text-right sm:text-left">ผู้เข้าร่วม (Participation)</th>
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
                    <td colSpan={2} className="p-12 text-center text-gray-500 font-light text-sm">
                      ไม่มีข้อมูลกิจกรรมในขณะนี้
                    </td>
                  </motion.tr>
                ) : (
                  activities.map((activity, index) => (
                    <motion.tr
                      key={activity._id}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.08 }}
                      className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors duration-300"
                    >
                      <td className="p-4 pl-6 text-sm font-light text-gray-200">{activity.title}</td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end sm:justify-start gap-4">
                          <div className="w-24 sm:w-36 bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${calculateParticipationRate(activity)}%` }}
                              transition={{ duration: 1, ease: "easeOut" }}
                              className="bg-[#d4af37] h-full rounded-full"
                            />
                          </div>
                          <span className="text-xs font-light text-gray-400 w-12 text-right">
                            {calculateParticipationRate(activity).toFixed(1)}%
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