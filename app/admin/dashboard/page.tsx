
"use client";

import React, { useEffect, useState } from "react";
import { FaClipboardList, FaRegFileAlt } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  ArcElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Register the components required for Pie Chart
ChartJS.register(Title, Tooltip, ArcElement, CategoryScale, LinearScale);

export default function AdminDashboard() {
  const [activities, setActivities] = useState<any[]>([]);
  const [newsCount, setNewsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const activityRes = await fetch("/api/activities");
        if (!activityRes.ok) throw new Error(`Error fetching activities: ${activityRes.status}`);
        const fetchedActivities = await activityRes.json();
        setActivities(fetchedActivities);

        const newsRes = await fetch("/api/news");
        if (!newsRes.ok) throw new Error(`Error fetching news: ${newsRes.status}`);
        const fetchedNews = await newsRes.json();
        setNewsCount(fetchedNews.length);

        setLoading(false); // Data Loaded
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // คำนวณเปอร์เซ็นต์ผู้เข้าร่วมกิจกรรม
  const calculateParticipationRate = (): number => {
    const totalParticipants = activities.reduce(
      (sum, activity) => sum + (activity.participants?.length || 0),
      0
    );
    const maxParticipants = activities.reduce(
      (sum, activity) => sum + (activity.maxParticipants || 0),
      0
    );
    if (maxParticipants === 0) return 0;
    return (totalParticipants / maxParticipants) * 100;
  };

  // Minimal Pie Chart Options
  const pieOptions = {
    plugins: {
      legend: {
        display: false, // ❌ เอา Legend ออก
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  // กราฟวงกลมแบบ Minimal
  const participationData = {
    datasets: [
      {
        data: [calculateParticipationRate(), 100 - calculateParticipationRate()],
        backgroundColor: ["#3B82F6", "#D1D5DB"],
        borderWidth: 0, // ❌ เอาเส้นขอบออก
      },
    ],
  };

  const newsData = {
    datasets: [
      {
        data: [newsCount, 100 - newsCount],
        backgroundColor: ["#FACC15", "#D1D5DB"],
        borderWidth: 0,
      },
    ],
  };

  const activitiesData = {
    datasets: [
      {
        data: [activities.length, 100 - activities.length],
        backgroundColor: ["#10B981", "#D1D5DB"],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        กำลังโหลดข้อมูล...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
          <FaRegFileAlt className="text-4xl text-blue-400 mb-3" />
          <h2 className="text-lg font-semibold text-white mb-2">เปอร์เซ็นผู้เข้าร่วมกิจกรรม</h2>
          <p className="text-3xl font-bold text-blue-400">{calculateParticipationRate().toFixed(2)}%</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
          <FaClipboardList className="text-4xl text-green-400 mb-3" />
          <h2 className="text-lg font-semibold text-white mb-2">กิจกรรมทั้งหมด</h2>
          <p className="text-3xl font-bold text-green-400">{activities.length}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
          <FaRegFileAlt className="text-4xl text-yellow-400 mb-3" />
          <h2 className="text-lg font-semibold text-white mb-2">ข่าวสารทั้งหมด</h2>
          <p className="text-3xl font-bold text-yellow-400">{newsCount}</p>
        </div>
      </div>

      {/* Pie Charts - Minimal Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
          <h3 className="text-white font-semibold mb-2">เปอร์เซ็นผู้เข้าร่วม</h3>
          <div className="h-40">
            <Pie data={participationData} options={pieOptions} />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
          <h3 className="text-white font-semibold mb-2">กิจกรรมทั้งหมด</h3>
          <div className="h-40">
            <Pie data={activitiesData} options={pieOptions} />
          </div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center hover:bg-gray-700 transition">
          <h3 className="text-white font-semibold mb-2">ข่าวสารทั้งหมด</h3>
          <div className="h-40">
            <Pie data={newsData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
