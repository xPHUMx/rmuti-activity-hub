"use client";

import thLocale from "@fullcalendar/core/locales/th"; // นำเข้า locale ภาษาไทยสำหรับ FullCalendar
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2"; 
import withReactContent from "sweetalert2-react-content";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import html2canvas from "html2canvas";
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import { format } from "date-fns";
import { th } from "date-fns/locale"; // นำเข้า locale ภาษาไทย


const MySwal = withReactContent(Swal);

// ฟังก์ชันสุ่มสีพื้นหลัง
const getRandomColor = () => {
  const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF", "#85E3FF", "#B9FBC0"];
  return colors[Math.floor(Math.random() * colors.length)];
};

type Activity = {
  _id: string;
  title: string;
  description: string;
  time: string;
  closeTime: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<any[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`/api/activities`);
        const data: Activity[] = await response.json();
        const calendarEvents = data.map((activity) => ({
          id: activity._id,
          title: activity.title,
          start: format(new Date(activity.time), "yyyy-MM-dd'T'HH:mm:ss"),
          end: format(new Date(activity.closeTime), "yyyy-MM-dd'T'HH:mm:ss"),
          backgroundColor: getRandomColor(), 
          borderColor: "transparent",
          textColor: "#1a1a1a", // ฟอนต์สีดำ
          extendedProps: { 
            description: activity.description,
            time: activity.time,
            closeTime: activity.closeTime,
          },
        }));

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  // ฟังก์ชันเปลี่ยนเดือน
  const changeMonth = (increment: number) => {
    if (calendarRef.current) {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + increment);
      setCurrentDate(newDate);
      calendarRef.current.getApi().gotoDate(newDate);
    }
  };

  // ฟังก์ชันดาวน์โหลดปฏิทินเป็นภาพ PNG
  const downloadCalendarAsImage = async () => {
    if (!calendarRef.current) return;
    
    // ค้นหา DOM ของ FullCalendar และแปลงเป็น HTMLElement
    const calendarElement = document.querySelector(".fc") as HTMLElement | null;
    if (!calendarElement) {
      console.error("ไม่พบองค์ประกอบปฏิทิน");
      return;
    }
  
    // ใช้ html2canvas จับภาพ
    const canvas = await html2canvas(calendarElement, {
      scale: 2, 
      backgroundColor: null, // ใช้สีพื้นหลังจริงจาก CSS
      useCORS: true, // รองรับ CSS จากไฟล์ภายนอก
    });
  
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "calendar.png";
    link.click();
  };
  

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-semibold text-center mb-6">ปฏิทินกิจกรรม</h1>

      {/* ปุ่มเลือกเดือน */}
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => changeMonth(-1)}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <ChevronLeft className="w-5 h-5 mr-2" /> ก่อนหน้า
        </button>
        
        <span className="text-lg font-semibold">
       {format(currentDate, "MMMM yyyy", { locale: th })} {/* แสดงชื่อเดือนเป็นภาษาไทย */}
        </span>

        <button 
          onClick={() => changeMonth(1)}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          ถัดไป <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={downloadCalendarAsImage}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          ดาวน์โหลดปฏิทิน
        </button>
      </div>

      <div className="overflow-hidden bg-gray-800 p-4 rounded-lg shadow-lg">
      <FullCalendar
  ref={calendarRef} 
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  initialDate={currentDate}
  events={events}
  locale={thLocale} // ใช้ FullCalendar ภาษาไทย
  eventClick={(info) => {
    MySwal.fire({
      title: info.event.title,
      html: `
        <p><strong>รายละเอียดกิจกรรม:</strong><br>${info.event.extendedProps.description}</p>
        <p><strong>เวลาเปิด:</strong> ${format(new Date(info.event.extendedProps.time), "dd MMMM yyyy HH:mm:ss", { locale: th })}</p>
        <p><strong>เวลาปิด:</strong> ${format(new Date(info.event.extendedProps.closeTime), "dd MMMM yyyy HH:mm:ss", { locale: th })}</p>
      `,
      icon: "info",
      confirmButtonText: "ตกลง",
    });
  }}
  eventContent={(arg) => (
    <div style={{ color: "#1a1a1a", fontWeight: "bold" }}>{arg.event.title}</div>
  )}
/>
      </div>
    </div>
  );
}
