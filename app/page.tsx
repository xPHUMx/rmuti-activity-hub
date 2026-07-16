"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  CalendarRange, 
  Clock, 
  X, 
  ArrowUpRight, 
  Calendar, 
  QrCode, 
  MapPin, 
  BookOpen,
  Award,
  Check
} from "lucide-react";

type Activity = {
  _id: string;
  title: string;
  activityStart?: string;
  time?: string;
  participants?: { _id: string }[];
  maxParticipants?: number;
};

type News = {
  _id: string;
  title: string;
  image: string;
};

type Registration = {
  _id: string;
  activityId: {
    _id: string;
    title: string;
    description?: string;
    activityStart?: string;
    time?: string;
    location: string;
  };
  registrationDate: string;
  checkedIn?: boolean;
  checkInDate?: string;
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
  hover: { scale: 1.02, transition: { duration: 0.3 } },
};

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const newsRes = await fetch("/api/news");
        if (newsRes.ok) {
          const fetchedNews = await newsRes.json();
          setNews(fetchedNews);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      async function fetchRegistrations() {
        try {
          const res = await fetch(`/api/users/registrations?userId=${session?.user?.id}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setRegistrations(data);
            } else {
              setRegistrations([]);
            }
          }
        } catch (error) {
          console.error("Error fetching registrations:", error);
        }
      }
      fetchRegistrations();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#080808] text-white">
        <div className="luxury-loader mb-4" />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-light tracking-[0.25em] text-[#f97316]"
        >
          RMUTI ACTIVITY HUB
        </motion.p>
      </div>
    );
  }

  // Calculate Student Stats
  const completedActivitiesCount = registrations.filter((r: any) => r.checkedIn).length;

  // Find next upcoming activity location
  const nextActivity = registrations
    .map(r => r.activityId)
    .filter(act => act && (act.activityStart || act.time))
    .find(act => {
      const dateStr = act.activityStart || act.time;
      return dateStr ? new Date(dateStr).getTime() > Date.now() : false;
    });
  const nextLocation = nextActivity ? nextActivity.location : "ไม่มีกิจกรรมถัดไป";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#080808] text-white px-4 py-12 md:py-20 font-sarabun">
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
                      className="relative w-full h-[320px] md:h-[450px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/[0.03] cursor-pointer"
                    >
                      <Image
                        src={newsItem.image}
                        alt={newsItem.title}
                        fill
                        style={{ objectFit: "cover" }}
                        className="transition-transform duration-700 ease-out hover:scale-105"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050505] via-black/30 to-transparent p-6 md:p-10">
                        <motion.h2
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-base md:text-xl font-light tracking-wide text-white"
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
                  <button className="border border-orange-500/30 hover:border-orange-500 text-white hover:text-black hover:bg-orange-500 px-8 py-2.5 rounded-xl text-xs font-light tracking-widest transition-all duration-500 shadow-[0_0_15px_rgba(249,115,22,0.03)] hover:shadow-[0_0_25px_rgba(249,115,22,0.2)]">
                    ดูข่าวสารทั้งหมด
                  </button>
                </Link>
              </motion.div>
            </>
          )}
        </section>

        {/* Personalized Student Stats Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
          {/* Activity Tracker */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white/[0.02] border border-white/[0.04] p-8 rounded-3xl backdrop-blur-xl shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-orange-500/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <Award className="h-7 w-7 text-orange-500/80 p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-xl" />
              <span className="text-[9px] font-light text-orange-500 tracking-[0.2em]">ATTENDED</span>
            </div>
            <div>
              <h3 className="text-xs font-light text-gray-400 mb-1">กิจกรรมที่เข้าร่วมแล้ว</h3>
              <p className="text-4xl font-extralight text-white">{completedActivitiesCount}</p>
              <p className="text-[10px] text-gray-500 mt-4">เช็คอินเข้าร่วมกิจกรรมเรียบร้อยแล้ว</p>
            </div>
          </motion.div>

          {/* Registered Activities Count */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white/[0.02] border border-white/[0.04] p-8 rounded-3xl backdrop-blur-xl shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-orange-500/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <CalendarRange className="h-7 w-7 text-orange-500/80 p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-xl" />
              <span className="text-[9px] font-light text-orange-500 tracking-[0.2em]">REGISTERED</span>
            </div>
            <div>
              <h3 className="text-xs font-light text-gray-400 mb-1">กิจกรรมที่ลงทะเบียนไว้</h3>
              <p className="text-4xl font-extralight text-white">{registrations.length}</p>
              <p className="text-[10px] text-gray-500 mt-4">รวมกิจกรรมทั้งหมดทุกสถานะ</p>
            </div>
          </motion.div>

          {/* Next Location */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white/[0.02] border border-white/[0.04] p-8 rounded-3xl backdrop-blur-xl shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-orange-500/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <MapPin className="h-7 w-7 text-orange-500/80 p-1.5 bg-white/[0.02] border border-white/[0.04] rounded-xl" />
              <span className="text-[9px] font-light text-orange-500 tracking-[0.2em]">NEXT LOCATION</span>
            </div>
            <div>
              <h3 className="text-xs font-light text-gray-400 mb-1">สถานที่จัดกิจกรรมถัดไป</h3>
              <p className="text-base font-light text-white truncate">{nextLocation}</p>
              <p className="text-[10px] text-gray-500 mt-4">
                {nextActivity ? "จากกิจกรรมถัดไปในตารางเรียน" : "ไม่มีตารางกิจกรรมถัดไปในขณะนี้"}
              </p>
            </div>
          </motion.div>
        </section>

        {/* Quick Actions Bar */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-3.5 bg-orange-500 rounded-full" />
            <h2 className="text-xs font-light tracking-[0.2em] text-gray-400 uppercase">ทางลัดกิจกรรม / Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 select-none">
            {/* Quick Register */}
            <Link href="/register" className="group">
              <div className="bg-white/[0.01] border border-white/[0.04] group-hover:border-orange-500/20 p-6 rounded-2xl flex items-center justify-between transition-all duration-300 cursor-pointer shadow-sm">
                <div className="flex items-center gap-4">
                  <BookOpen className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  <span className="text-xs font-light text-gray-300 group-hover:text-white transition-colors">ลงทะเบียนกิจกรรมใหม่</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </Link>

            {/* Quick Calendar */}
            <Link href="/calendar" className="group">
              <div className="bg-white/[0.01] border border-white/[0.04] group-hover:border-orange-500/20 p-6 rounded-2xl flex items-center justify-between transition-all duration-300 cursor-pointer shadow-sm">
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                  <span className="text-xs font-light text-gray-300 group-hover:text-white transition-colors">ปฏิทินตารางกิจกรรม</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            </Link>

            {/* Personal QR Check-in */}
            <div 
              onClick={() => setShowQRModal(true)}
              className="group bg-white/[0.01] border border-white/[0.04] hover:border-orange-500/20 p-6 rounded-2xl flex items-center justify-between transition-all duration-300 cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-4">
                <QrCode className="h-5 w-5 text-gray-400 group-hover:text-orange-500 transition-colors" />
                <span className="text-xs font-light text-gray-300 group-hover:text-white transition-colors">แสดง QR Code เช็คอิน</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-gray-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        </section>

        {/* My Registered Activities Schedule */}
        <section className="bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          <div className="p-6 md:p-8 border-b border-white/[0.04] flex items-center gap-3">
            <Clock className="text-orange-500 text-base" />
            <h3 className="text-xs font-light tracking-[0.15em] text-gray-300 uppercase">ตารางกิจกรรมของฉัน / My Activities</h3>
          </div>
          <div className="p-6 md:p-8">
            {registrations.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <p className="text-sm font-light text-gray-500">คุณยังไม่มีกิจกรรมที่ลงทะเบียนไว้</p>
                <Link href="/register">
                  <button className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-black text-xs font-light tracking-widest rounded-xl transition duration-300">
                    ไปหน้าลงทะเบียนกิจกรรม
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {registrations.map((reg, index) => {
                  const act = reg.activityId;
                  if (!act) return null;
                  const dateStr = act.activityStart || act.time;
                  const formattedDate = dateStr 
                    ? new Date(dateStr).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "ไม่ระบุวันเวลา";

                  return (
                    <motion.div
                      key={reg._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group bg-white/[0.01] border border-white/[0.03] hover:border-orange-500/10 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-300"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-light text-gray-200 group-hover:text-white transition-colors">
                          {act.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-light text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formattedDate} น.
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {act.location}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {reg.checkedIn ? (
                          <span className="text-[10px] tracking-wider font-light text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                            <Check className="h-3 w-3" /> เช็คอินแล้ว
                          </span>
                        ) : (
                          <span className="text-[10px] tracking-wider font-light text-gray-400 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.04]">
                            ยังไม่เช็คอิน
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </motion.div>

      {/* Personal QR Code Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
            onClick={() => setShowQRModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0b0b0b] border border-white/[0.08] p-8 rounded-3xl max-w-sm w-full text-center relative shadow-[0_20px_50px_rgba(249,115,22,0.15)] flex flex-col items-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-[10px] tracking-[0.25em] font-light text-orange-500 uppercase mb-2">STUDENT ID PASS</h2>
              <p className="text-base font-light text-gray-200 mb-6">{session?.user?.name || "STUDENT"}</p>
              
              {/* Real Dynamic QR Code */}
              <div className="w-48 h-48 bg-white p-3 rounded-2xl flex items-center justify-center relative shadow-inner overflow-hidden select-none">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(session?.user?.email || "unknown")}`}
                  alt="Student QR Pass"
                  className="w-full h-full object-contain"
                />
              </div>
              
              <p className="text-[11px] font-light text-orange-500/70 tracking-widest mt-6 select-all font-mono">
                {session?.user?.email?.split("@")[0]?.toUpperCase() || "STUDENT_ID"}
              </p>
              <p className="text-[9px] font-light text-gray-500 mt-2 uppercase">
                ใช้สำหรับแสดงตัว ณ จุดเช็คอินกิจกรรม
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}