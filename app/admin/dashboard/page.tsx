
// "use client";

// import React, { useEffect, useState } from "react";
// import { FaClipboardList, FaRegFileAlt } from "react-icons/fa";
// import { Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
// } from "chart.js";

// // Register the components required for Pie Chart
// ChartJS.register(Title, Tooltip, ArcElement, CategoryScale, LinearScale);

// export default function AdminDashboard() {
//   const [activities, setActivities] = useState<any[]>([]);
//   const [newsCount, setNewsCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const activityRes = await fetch("/api/activities");
//         if (!activityRes.ok) throw new Error(`Error fetching activities: ${activityRes.status}`);
//         const fetchedActivities = await activityRes.json();
//         setActivities(fetchedActivities);

//         const newsRes = await fetch("/api/news");
//         if (!newsRes.ok) throw new Error(`Error fetching news: ${newsRes.status}`);
//         const fetchedNews = await newsRes.json();
//         setNewsCount(fetchedNews.length);

//         setLoading(false); // Data Loaded
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   // คำนวณเปอร์เซ็นต์ผู้เข้าร่วมกิจกรรม
//   const calculateParticipationRate = (): number => {
//     const totalParticipants = activities.reduce(
//       (sum, activity) => sum + (activity.participants?.length || 0),
//       0
//     );
//     const maxParticipants = activities.reduce(
//       (sum, activity) => sum + (activity.maxParticipants || 0),
//       0
//     );
//     if (maxParticipants === 0) return 0;
//     return (totalParticipants / maxParticipants) * 100;
//   };

//   // Minimal Pie Chart Options
//   const pieOptions = {
//     plugins: {
//       legend: {
//         display: false, // ❌ เอา Legend ออก
//       },
//     },
//     responsive: true,
//     maintainAspectRatio: false,
//   };

//   // กราฟวงกลมแบบ Minimal
//   const participationData = {
//     datasets: [
//       {
//         data: [calculateParticipationRate(), 100 - calculateParticipationRate()],
//         backgroundColor: ["#3B82F6", "#D1D5DB"],
//         borderWidth: 0, // ❌ เอาเส้นขอบออก
//       },
//     ],
//   };

//   const newsData = {
//     datasets: [
//       {
//         data: [newsCount, 100 - newsCount],
//         backgroundColor: ["#FACC15", "#D1D5DB"],
//         borderWidth: 0,
//       },
//     ],
//   };

//   const activitiesData = {
//     datasets: [
//       {
//         data: [activities.length, 100 - activities.length],
//         backgroundColor: ["#10B981", "#D1D5DB"],
//         borderWidth: 0,
//       },
//     ],
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
//         กำลังโหลดข้อมูล...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
//           <FaRegFileAlt className="text-4xl text-blue-400 mb-3" />
//           <h2 className="text-lg font-semibold text-white mb-2">เปอร์เซ็นผู้เข้าร่วมกิจกรรม</h2>
//           <p className="text-3xl font-bold text-blue-400">{calculateParticipationRate().toFixed(2)}%</p>
//         </div>
//         <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
//           <FaClipboardList className="text-4xl text-green-400 mb-3" />
//           <h2 className="text-lg font-semibold text-white mb-2">กิจกรรมทั้งหมด</h2>
//           <p className="text-3xl font-bold text-green-400">{activities.length}</p>
//         </div>
//         <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
//           <FaRegFileAlt className="text-4xl text-yellow-400 mb-3" />
//           <h2 className="text-lg font-semibold text-white mb-2">ข่าวสารทั้งหมด</h2>
//           <p className="text-3xl font-bold text-yellow-400">{newsCount}</p>
//         </div>
//       </div>

//       {/* Pie Charts - Minimal Style */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
//         <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
//           <h3 className="text-white font-semibold mb-2">เปอร์เซ็นผู้เข้าร่วม</h3>
//           <div className="h-40">
//             <Pie data={participationData} options={pieOptions} />
//           </div>
//         </div>
//         <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
//           <h3 className="text-white font-semibold mb-2">กิจกรรมทั้งหมด</h3>
//           <div className="h-40">
//             <Pie data={activitiesData} options={pieOptions} />
//           </div>
//         </div>
//         <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
//           <h3 className="text-white font-semibold mb-2">ข่าวสารทั้งหมด</h3>
//           <div className="h-40">
//             <Pie data={newsData} options={pieOptions} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React, { useEffect, useState } from "react";
// import { FaClipboardList, FaRegFileAlt } from "react-icons/fa";
// import { Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   ChartOptions,
//   ChartData,
// } from "chart.js";

// // ลงทะเบียนคอมโพเนนต์ Chart.js
// ChartJS.register(Title, Tooltip, ArcElement, CategoryScale, LinearScale);

// // อินเตอร์เฟซสำหรับข้อมูลกิจกรรม
// interface Activity {
//   participants?: string[];
//   maxParticipants?: number;
// }

// // คอมโพเนนต์การ์ดสรุป
// const SummaryCard: React.FC<{
//   title: string;
//   value: string | number;
//   icon: React.ReactNode;
//   color: string;
// }> = ({ title, value, icon, color }) => (
//   <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//     <div className="flex items-center justify-center mb-4">{icon}</div>
//     <h2 className="text-lg font-medium text-gray-300 text-center">{title}</h2>
//     <p className={`text-3xl font-bold text-center ${color}`}>{value}</p>
//   </div>
// );

// // คอมโพเนนต์กราฟ Doughnut
// const DoughnutChartCard: React.FC<{
//   title: string;
//   data: ChartData<"doughnut">;
//   options: ChartOptions<"doughnut">;
// }> = ({ title, data, options }) => (
//   <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
//     <h3 className="text-lg font-medium text-gray-300 text-center mb-4">{title}</h3>
//     <div className="h-48">
//       <Doughnut data={data} options={options} />
//     </div>
//   </div>
// );

// export default function AdminDashboard() {
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [newsCount, setNewsCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const activityRes = await fetch("/api/activities");
//         if (!activityRes.ok) throw new Error(`เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม: ${activityRes.status}`);
//         const fetchedActivities = await activityRes.json();
//         setActivities(fetchedActivities);

//         const newsRes = await fetch("/api/news");
//         if (!newsRes.ok) throw new Error(`เกิดข้อผิดพลาดในการดึงข้อมูลข่าวสาร: ${newsRes.status}`);
//         const fetchedNews = await newsRes.json();
//         setNewsCount(fetchedNews.length);

//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     }
//     fetchData();
//   }, []);

//   // คำนวณเปอร์เซ็นต์ผู้เข้าร่วม
//   const calculateParticipationRate = (): number => {
//     const totalParticipants = activities.reduce(
//       (sum, activity) => sum + (activity.participants?.length || 0),
//       0
//     );
//     const maxParticipants = activities.reduce(
//       (sum, activity) => sum + (activity.maxParticipants || 0),
//       0
//     );
//     return maxParticipants === 0 ? 0 : (totalParticipants / maxParticipants) * 100;
//   };

//   // การตั้งค่ากราฟ Doughnut
//   const doughnutOptions: ChartOptions<"doughnut"> = {
//     plugins: {
//       legend: { display: false },
//       tooltip: {
//         enabled: true,
//         callbacks: {
//           label: (context) => `${context.parsed.toFixed(2)}%`,
//         },
//       },
//     },
//     responsive: true,
//     maintainAspectRatio: false,
//     cutout: "70%", // ทำให้เป็น Doughnut
//     animation: {
//       animateScale: true,
//       animateRotate: true,
//     },
//   };

//   // ข้อมูลกราฟ
//   const participationData: ChartData<"doughnut"> = {
//     datasets: [
//       {
//         data: [calculateParticipationRate(), 100 - calculateParticipationRate()],
//         backgroundColor: ["#3B82F6", "#4B5563"],
//         borderWidth: 0,
//         hoverOffset: 20,
//       },
//     ],
//   };

//   const activitiesData: ChartData<"doughnut"> = {
//     datasets: [
//       {
//         data: [activities.length, 100 - activities.length],
//         backgroundColor: ["#10B981", "#4B5563"],
//         borderWidth: 0,
//         hoverOffset: 20,
//       },
//     ],
//   };

//   const newsData: ChartData<"doughnut"> = {
//     datasets: [
//       {
//         data: [newsCount, 100 - newsCount],
//         backgroundColor: ["#FACC15", "#4B5563"],
//         borderWidth: 0,
//         hoverOffset: 20,
//       },
//     ],
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
//         <div className="flex flex-col items-center gap-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           <p className="text-lg font-medium">กำลังโหลดข้อมูล...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
//       <h1 className="text-3xl font-bold text-center mb-8">แดชบอร์ดผู้ดูแลระบบ</h1>

//       {/* การ์ดสรุป */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         <SummaryCard
//           title="เปอร์เซ็นต์ผู้เข้าร่วม"
//           value={`${calculateParticipationRate().toFixed(2)}%`}
//           icon={<FaRegFileAlt className="text-4xl text-blue-400" />}
//           color="text-blue-400"
//         />
//         <SummaryCard
//           title="จำนวนกิจกรรมทั้งหมด"
//           value={activities.length}
//           icon={<FaClipboardList className="text-4xl text-green-400" />}
//           color="text-green-400"
//         />
//         <SummaryCard
//           title="จำนวนข่าวสารทั้งหมด"
//           value={newsCount}
//           icon={<FaRegFileAlt className="text-4xl text-yellow-400" />}
//           color="text-yellow-400"
//         />
//       </div>

//       {/* กราฟ Doughnut */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         <DoughnutChartCard
//           title="เปอร์เซ็นต์ผู้เข้าร่วม"
//           data={participationData}
//           options={doughnutOptions}
//         />
//         <DoughnutChartCard
//           title="จำนวนกิจกรรมทั้งหมด"
//           data={activitiesData}
//           options={doughnutOptions}
//         />
//         <DoughnutChartCard
//           title="จำนวนข่าวสารทั้งหมด"
//           data={newsData}
//           options={doughnutOptions}
//         />
//       </div>
//     </div>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  ArcElement,
  CategoryScale,
  LinearScale,
  ChartOptions,
  ChartData,
  DoughnutController,
  Chart,
} from "chart.js";
import { Users, CalendarRange, Newspaper } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

// ลงทะเบียนคอมโพเนนต์ Chart.js
ChartJS.register(Title, Tooltip, ArcElement, CategoryScale, LinearScale, DoughnutController);

// Plugin สำหรับเพิ่ม Shadow Effect
const shadowPlugin = {
  id: "shadow",
  beforeDraw(chart: Chart) {
    const { ctx } = chart;
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
  },
};

// ลงทะเบียน Shadow Plugin
ChartJS.register(shadowPlugin);

// อินเตอร์เฟซสำหรับข้อมูลกิจกรรม
interface Activity {
  participants?: string[];
  maxParticipants?: number;
}

// คอมโพเนนต์การ์ดสรุป (Glassmorphism)
const SummaryCard: React.FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}> = ({ title, value, icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4 }}
    className="relative bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] backdrop-blur-xl p-8 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-orange-500/30 transition-all duration-300 flex flex-col items-center"
  >
    <div className="flex items-center justify-center mb-4 text-3xl p-3 bg-gray-100 dark:bg-white/[0.02] rounded-2xl border border-gray-200 dark:border-white/[0.04]">
      {icon}
    </div>
    <h2 className="text-xs font-light text-gray-600 dark:text-gray-400 tracking-wider text-center uppercase mb-2">{title}</h2>
    <p className={`text-4xl font-extralight tracking-tight text-center ${color}`}>{value}</p>
  </motion.div>
);

// คอมโพเนนต์กราฟ Doughnut
const DoughnutChartCard: React.FC<{
  title: string;
  data: ChartData<"doughnut">;
  options: ChartOptions<"doughnut">;
  delay: number;
}> = ({ title, data, options, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -4 }}
    className="relative bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.04] backdrop-blur-xl p-8 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_15px_30px_rgba(0,0,0,0.3)] hover:border-orange-500/30 transition-all duration-300 flex flex-col items-center justify-between"
  >
    <h3 className="text-xs font-light text-gray-600 dark:text-gray-400 tracking-wider text-center uppercase mb-6">{title}</h3>
    <div className="h-48 w-full max-w-[200px] flex items-center justify-center relative">
      <Doughnut data={data} options={options} />
    </div>
  </motion.div>
);

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newsCount, setNewsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    async function fetchData() {
      try {
        const activityRes = await fetch("/api/activities");
        if (!activityRes.ok) throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรม");
        const fetchedActivities = await activityRes.json();
        setActivities(fetchedActivities);

        const newsRes = await fetch("/api/news");
        if (!newsRes.ok) throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลข่าวสาร");
        const fetchedNews = await newsRes.json();
        setNewsCount(fetchedNews.length);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // คำนวณเปอร์เซ็นต์ผู้เข้าร่วม
  const calculateParticipationRate = (): number => {
    const totalParticipants = activities.reduce(
      (sum, activity) => sum + (activity.participants?.length || 0),
      0
    );
    const maxParticipants = activities.reduce(
      (sum, activity) => sum + (activity.maxParticipants || 0),
      0
    );
    return maxParticipants === 0 ? 0 : (totalParticipants / maxParticipants) * 100;
  };

  // การตั้งค่ากราฟ Doughnut
  const doughnutOptions: ChartOptions<"doughnut"> = {
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        titleFont: { family: "'IBM Plex Sans Thai', sans-serif", size: 12, weight: "normal" },
        bodyFont: { family: "'IBM Plex Sans Thai', sans-serif", size: 12, weight: "normal" },
        borderColor: "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          label: (context) => ` ${context.parsed.toFixed(2)}%`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    cutout: "82%", // Thinner doughnut cutout looks extremely premium
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1200,
    },
  };

  const trackColor = theme === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)";

  // ข้อมูลกราฟ
  const participationData: ChartData<"doughnut"> = {
    datasets: [
      {
        data: [calculateParticipationRate(), 100 - calculateParticipationRate()],
        backgroundColor: ["#f97316", trackColor],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const activitiesData: ChartData<"doughnut"> = {
    datasets: [
      {
        data: [activities.length, Math.max(100 - activities.length, 0)],
        backgroundColor: ["#fb923c", trackColor],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const newsData: ChartData<"doughnut"> = {
    datasets: [
      {
        data: [newsCount, Math.max(100 - newsCount, 0)],
        backgroundColor: ["#ea580c", trackColor],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] text-gray-900 dark:text-white transition-colors duration-300">
        <div className="luxury-loader" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] text-gray-900 dark:text-white px-4 py-12 md:py-20 font-sarabun transition-colors duration-300">
      <div className="container mx-auto max-w-7xl">
        {/* หัวข้อแดชบอร์ด */}
        <div className="text-center mb-16 space-y-3 select-none">
          <h2 className="text-[10px] tracking-[0.3em] font-light text-orange-500 uppercase">
            ADMINISTRATION
          </h2>
          <h1 className="text-3xl font-extralight text-gray-800 dark:text-gray-200 tracking-wide">
            แผงควบคุมและข้อมูลสถิติ
          </h1>
        </div>

        {/* การ์ดสรุป */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <SummaryCard
            title="เปอร์เซ็นต์ผู้เข้าร่วม"
            value={`${calculateParticipationRate().toFixed(2)}%`}
            icon={<Users className="h-6 w-6 text-orange-500/80" />}
            color="text-gray-900 dark:text-white"
            delay={0.05}
          />
          <SummaryCard
            title="จำนวนกิจกรรมทั้งหมด"
            value={activities.length}
            icon={<CalendarRange className="h-6 w-6 text-orange-500/80" />}
            color="text-gray-900 dark:text-white"
            delay={0.1}
          />
          <SummaryCard
            title="จำนวนข่าวสารทั้งหมด"
            value={newsCount}
            icon={<Newspaper className="h-6 w-6 text-orange-500/80" />}
            color="text-gray-900 dark:text-white"
            delay={0.15}
          />
        </div>

        {/* กราฟ Doughnut */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <DoughnutChartCard
            title="เปอร์เซ็นต์ผู้เข้าร่วม"
            data={participationData}
            options={doughnutOptions}
            delay={0.2}
          />
          <DoughnutChartCard
            title="จำนวนกิจกรรมทั้งหมด"
            data={activitiesData}
            options={doughnutOptions}
            delay={0.25}
          />
          <DoughnutChartCard
            title="จำนวนข่าวสารทั้งหมด"
            data={newsData}
            options={doughnutOptions}
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
}