
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
import { FaClipboardList, FaRegFileAlt, FaUsers } from "react-icons/fa";
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
} from "chart.js";

// ลงทะเบียนคอมโพเนนต์ Chart.js
ChartJS.register(Title, Tooltip, ArcElement, CategoryScale, LinearScale);

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
}> = ({ title, value, icon, color }) => (
  <div className="relative bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <div className="flex items-center justify-center mb-4 text-4xl">{icon}</div>
    <h2 className="text-lg font-medium text-gray-300 text-center">{title}</h2>
    <p className={`text-4xl font-bold text-center ${color}`}>{value}</p>
  </div>
);

// คอมโพเนนต์กราฟ Doughnut (3D-like)
const DoughnutChartCard: React.FC<{
  title: string;
  data: ChartData<"doughnut">;
  options: ChartOptions<"doughnut">;
}> = ({ title, data, options }) => (
  <div className="relative bg-gray-800/50 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/50 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
    <h3 className="text-lg font-medium text-gray-300 text-center mb-4">{title}</h3>
    <div className="h-56">
      <Doughnut data={data} options={options} />
    </div>
  </div>
);

export default function AdminDashboard() {
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
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleFont: { family: "'Sarabun', sans-serif", size: 14 },
        bodyFont: { family: "'Sarabun', sans-serif", size: 14 },
        callbacks: {
          label: (context) => `${context.parsed.toFixed(2)}%`,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%", // ทำให้เป็น Doughnut
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
    },
  };

  // ข้อมูลกราฟ
  const participationData: ChartData<"doughnut"> = {
    datasets: [
      {
        data: [calculateParticipationRate(), 100 - calculateParticipationRate()],
        backgroundColor: ["#3B82F6", "#4B5563"],
        borderWidth: 0,
        hoverOffset: 30,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        shadowBlur: 10,
        shadowColor: "rgba(0, 0, 0, 0.3)",
      },
    ],
  };

  const activitiesData: ChartData<"doughnut"> = {
    datasets: [
      {
        data: [activities.length, 100 - activities.length],
        backgroundColor: ["#10B981", "#4B5563"],
        borderWidth: 0,
        hoverOffset: 30,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        shadowBlur: 10,
        shadowColor: "rgba(0, 0, 0, 0.3)",
      },
    ],
  };

  const newsData: ChartData<"doughnut"> = {
    datasets: [
      {
        data: [newsCount, 100 - newsCount],
        backgroundColor: ["#FACC15", "#4B5563"],
        borderWidth: 0,
        hoverOffset: 30,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        shadowBlur: 10,
        shadowColor: "rgba(0, 0, 0, 0.3)",
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-xl font-medium">กำลังโหลดข้อมูลแดชบอร์ด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 sm:p-8">
      {/* หัวข้อแดชบอร์ด */}
      <h1 className="text-4xl font-bold text-center mb-10 animate-fade-in">
        แดชบอร์ดผู้ดูแลระบบ
      </h1>

      {/* การ์ดสรุป */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <SummaryCard
          title="เปอร์เซ็นต์ผู้เข้าร่วม"
          value={`${calculateParticipationRate().toFixed(2)}%`}
          icon={<FaUsers className="text-blue-400" />}
          color="text-blue-400"
        />
        <SummaryCard
          title="จำนวนกิจกรรมทั้งหมด"
          value={activities.length}
          icon={<FaClipboardList className="text-green-400" />}
          color="text-green-400"
        />
        <SummaryCard
          title="จำนวนข่าวสารทั้งหมด"
          value={newsCount}
          icon={<FaRegFileAlt className="text-yellow-400" />}
          color="text-yellow-400"
        />
      </div>

      {/* กราฟ Doughnut */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DoughnutChartCard
          title="เปอร์เซ็นต์ผู้เข้าร่วม"
          data={participationData}
          options={doughnutOptions}
        />
        <DoughnutChartCard
          title="จำนวนกิจกรรมทั้งหมด"
          data={activitiesData}
          options={doughnutOptions}
        />
        <DoughnutChartCard
          title="จำนวนข่าวสารทั้งหมด"
          data={newsData}
          options={doughnutOptions}
        />
      </div>
    </div>
  );
}