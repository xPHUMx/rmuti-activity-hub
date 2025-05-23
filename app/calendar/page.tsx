

// "use client";

// import thLocale from "@fullcalendar/core/locales/th"; // นำเข้า locale ภาษาไทยสำหรับ FullCalendar
// import { useState, useEffect, useRef } from "react";
// import Swal from "sweetalert2"; 
// import withReactContent from "sweetalert2-react-content";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import html2canvas from "html2canvas";
// import { ChevronLeft, ChevronRight } from "lucide-react"; 
// import { format } from "date-fns";
// import { th } from "date-fns/locale"; // นำเข้า locale ภาษาไทย


// const MySwal = withReactContent(Swal);

// // ฟังก์ชันสุ่มสีพื้นหลัง
// const getRandomColor = () => {
//   const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF", "#85E3FF", "#B9FBC0"];
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// type Activity = {
//   _id: string;
//   title: string;
//   description: string;
//   time: string;
//   closeTime: string;
// };

// export default function CalendarPage() {
//   const [events, setEvents] = useState<any[]>([]);
//   const calendarRef = useRef<FullCalendar>(null);
//   const [currentDate, setCurrentDate] = useState(new Date());

//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const response = await fetch(`/api/activities`);
//         const data: Activity[] = await response.json();
//         const calendarEvents = data.map((activity) => ({
//           id: activity._id,
//           title: activity.title,
//           start: format(new Date(activity.time), "yyyy-MM-dd'T'HH:mm:ss"),
//           end: format(new Date(activity.closeTime), "yyyy-MM-dd'T'HH:mm:ss"),
//           backgroundColor: getRandomColor(), 
//           borderColor: "transparent",
//           textColor: "#010205", // เปลี่ยนสีข้อความเป็นขาว
//           extendedProps: { 
//             description: activity.description,
//             time: activity.time,
//             closeTime: activity.closeTime,
//           },
//         }));

//         setEvents(calendarEvents);
//       } catch (error) {
//         console.error("Error fetching activities:", error);
//       }
//     };

//     fetchActivities();
//   }, []);

//   // ฟังก์ชันเปลี่ยนเดือน
//   const changeMonth = (increment: number) => {
//     if (calendarRef.current) {
//       const newDate = new Date(currentDate);
//       newDate.setMonth(newDate.getMonth() + increment);
//       setCurrentDate(newDate);
//       calendarRef.current.getApi().gotoDate(newDate);
//     }
//   };

//   // ฟังก์ชันดาวน์โหลดปฏิทินเป็นภาพ PNG
//   const downloadCalendarAsImage = async () => {
//     if (!calendarRef.current) return;
    
//     // ค้นหา DOM ของ FullCalendar และแปลงเป็น HTMLElement
//     const calendarElement = document.querySelector(".fc") as HTMLElement | null;
//     if (!calendarElement) {
//       console.error("ไม่พบองค์ประกอบปฏิทิน");
//       return;
//     }
  
//     // ใช้ html2canvas จับภาพ
//     const canvas = await html2canvas(calendarElement, {
//       scale: 2, 
//       backgroundColor: null, // ใช้สีพื้นหลังจริงจาก CSS
//       useCORS: true, // รองรับ CSS จากไฟล์ภายนอก
//     });
  
//     const link = document.createElement("a");
//     link.href = canvas.toDataURL("image/png");
//     link.download = "calendar.png";
//     link.click();
//   };
  

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <h1 className="text-4xl font-semibold text-center mb-6">ปฏิทินกิจกรรม</h1>

//       {/* ปุ่มเลือกเดือน */}
//       <div className="flex justify-between items-center mb-4">
//         <button 
//           onClick={() => changeMonth(-1)}
//           className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center shadow-md"
//         >
//           <ChevronLeft className="w-5 h-5 mr-2" /> ก่อนหน้า
//         </button>
        
//         <span className="text-lg font-semibold">
//           {format(currentDate, "MMMM yyyy", { locale: th })} {/* แสดงชื่อเดือนเป็นภาษาไทย */}
//         </span>

//         <button 
//           onClick={() => changeMonth(1)}
//           className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center shadow-md"
//         >
//           ถัดไป <ChevronRight className="w-5 h-5 ml-2" />
//         </button>
//       </div>

//       <div className="flex justify-end mb-4">
//         <button
//           onClick={downloadCalendarAsImage}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-md"
//         >
//           ดาวน์โหลดปฏิทิน
//         </button>
//       </div>

//       {/* ปฏิทิน */}
//       <div className="overflow-hidden bg-gray-800 p-4 rounded-lg shadow-xl max-w-3xl mx-auto">
//         <FullCalendar
//           ref={calendarRef} 
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           initialDate={currentDate}
//           events={events}
//           locale={thLocale} // ใช้ FullCalendar ภาษาไทย
//           eventClick={(info) => {
//             MySwal.fire({
//               title: info.event.title,
//               html: `
//                 <p><strong>รายละเอียดกิจกรรม:</strong><br>${info.event.extendedProps.description}</p>
//                 <p><strong>เวลาเปิด:</strong> ${format(new Date(info.event.extendedProps.time), "dd MMMM yyyy HH:mm:ss", { locale: th })}</p>
//                 <p><strong>เวลาปิด:</strong> ${format(new Date(info.event.extendedProps.closeTime), "dd MMMM yyyy HH:mm:ss", { locale: th })}</p>
//               `,
//               icon: "info",
//               confirmButtonText: "ตกลง",
//             });
//           }}
//           eventContent={(arg) => (
//             <div style={{ color: "#010205", fontWeight: "bold" }}>{arg.event.title}</div> // เปลี่ยนเป็นข้อความสีขาว
//           )}
//           themeSystem="bootstrap5" // ใช้ธีม Bootstrap สำหรับ FullCalendar
//         />
//       </div>
//     </div>
//   );
// }


// "use client";

// import thLocale from "@fullcalendar/core/locales/th";
// import { useState, useEffect, useRef } from "react";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import html2canvas from "html2canvas";
// import { ChevronLeft, ChevronRight, Download } from "lucide-react"; // ใช้ไอคอน Download
// import { format } from "date-fns";
// import { th } from "date-fns/locale";

// const MySwal = withReactContent(Swal);

// // ฟังก์ชันสุ่มสีพื้นหลัง
// const getRandomColor = () => {
//   const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF", "#85E3FF", "#B9FBC0"];
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// type Activity = {
//   _id: string;
//   title: string;
//   description: string;
//   registerStart: string;
//   registerEnd: string;
//   activityStart: string;
//   activityEnd: string;
// };

// export default function CalendarPage() {
//   const [events, setEvents] = useState<any[]>([]);
//   const calendarRef = useRef<FullCalendar>(null);
//   const [currentDate, setCurrentDate] = useState(new Date());

//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const response = await fetch(`/api/activities`);
//         const data: Activity[] = await response.json();
//         const calendarEvents = data.map((activity) => ({
//           id: activity._id,
//           title: activity.title,
//           start: format(new Date(activity.activityStart), "yyyy-MM-dd'T'HH:mm:ss"),
//           end: format(new Date(activity.activityEnd), "yyyy-MM-dd'T'HH:mm:ss"),
//           backgroundColor: getRandomColor(),
//           borderColor: "transparent",
//           textColor: "#111111", // เปลี่ยนสี title ให้เข้ม
//           extendedProps: {
//             description: activity.description,
//             registerStart: activity.registerStart,
//             registerEnd: activity.registerEnd,
//             activityStart: activity.activityStart,
//             activityEnd: activity.activityEnd,
//           },
//         }));

//         setEvents(calendarEvents);
//       } catch (error) {
//         console.error("Error fetching activities:", error);
//       }
//     };

//     fetchActivities();
//   }, []);

//   const changeMonth = (increment: number) => {
//     if (calendarRef.current) {
//       const newDate = new Date(currentDate);
//       newDate.setMonth(newDate.getMonth() + increment);
//       setCurrentDate(newDate);
//       calendarRef.current.getApi().gotoDate(newDate);
//     }
//   };

//   const downloadCalendarAsImage = async () => {
//     if (!calendarRef.current) return;

//     const calendarElement = document.querySelector(".fc") as HTMLElement | null;
//     if (!calendarElement) {
//       console.error("ไม่พบองค์ประกอบปฏิทิน");
//       return;
//     }

//     const canvas = await html2canvas(calendarElement, {
//       scale: 2,
//       backgroundColor: null,
//       useCORS: true,
//     });

//     const link = document.createElement("a");
//     link.href = canvas.toDataURL("image/png");
//     link.download = "calendar.png";
//     link.click();
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <h1 className="text-4xl font-semibold text-center mb-6">ปฏิทินกิจกรรม</h1>

//       {/* ปุ่มเลือกเดือน */}
//       <div className="flex justify-between items-center mb-4">
//         <button
//           onClick={() => changeMonth(-1)}
//           className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center shadow-md"
//         >
//           <ChevronLeft className="w-5 h-5 mr-2" /> ก่อนหน้า
//         </button>

//         <span className="text-lg font-semibold">
//           {format(currentDate, "MMMM yyyy", { locale: th })}
//         </span>

//         <button
//           onClick={() => changeMonth(1)}
//           className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center shadow-md"
//         >
//           ถัดไป <ChevronRight className="w-5 h-5 ml-2" />
//         </button>
//       </div>

//       {/* ปุ่มดาวน์โหลด */}
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={downloadCalendarAsImage}
//           className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded flex items-center gap-2 shadow-md"
//         >
//           <Download className="w-5 h-5" />
//           ดาวน์โหลดปฏิทิน
//         </button>
//       </div>

//       {/* ปฏิทิน */}
//       <div className="overflow-hidden bg-gray-800 p-4 rounded-lg shadow-xl max-w-4xl mx-auto">
//         <FullCalendar
//           ref={calendarRef}
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           initialDate={currentDate}
//           events={events}
//           locale={thLocale}
//           eventClick={(info) => {
//             MySwal.fire({
//               title: info.event.title,
//               html: `
//                 <p><strong>เปิดลงทะเบียน:</strong> ${format(new Date(info.event.extendedProps.registerStart), "dd MMMM yyyy HH:mm:ss", { locale: th })}</p>
//                 <p><strong>ปิดลงทะเบียน:</strong> ${format(new Date(info.event.extendedProps.registerEnd), "dd MMMM yyyy HH:mm:ss", { locale: th })}</p>
//                 <p><strong>เวลาเริ่มกิจกรรม:</strong> ${format(new Date(info.event.extendedProps.activityStart), "dd MMMM yyyy HH:mm:ss", { locale: th })}</p>
//                 <p><strong>เวลาสิ้นสุดกิจกรรม:</strong> ${format(new Date(info.event.extendedProps.activityEnd), "dd MMMM yyyy HH:mm:ss", { locale: th })}</p>
//               `,
//               icon: "info",
//               confirmButtonText: "ตกลง",
//             });
//           }}
//           eventContent={(arg) => (
//             <div style={{ color: "#111", fontWeight: "bold" }}>{arg.event.title}</div> // สีเข้ม อ่านง่าย
//           )}
//           themeSystem="bootstrap5"
//         />
//       </div>
//     </div>
//   );
// }

"use client";

import thLocale from "@fullcalendar/core/locales/th";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import html2canvas from "html2canvas";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";

const MySwal = withReactContent(Swal);

const getRandomColor = () => {
  const colors = ["#FFDDC1", "#FFABAB", "#FFC3A0", "#D5AAFF", "#85E3FF", "#B9FBC0"];
  return colors[Math.floor(Math.random() * colors.length)];
};

type Activity = {
  _id: string;
  title: string;
  description: string;
  registerStart: string;
  registerEnd: string;
  activityStart: string;
  activityEnd: string;
  newsId?: { _id: string } | string;
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
          start: format(new Date(activity.registerStart), "yyyy-MM-dd'T'HH:mm:ss"),
          end: format(new Date(activity.registerEnd), "yyyy-MM-dd'T'HH:mm:ss"),
          backgroundColor: getRandomColor(),
          borderColor: "transparent",
          textColor: "#000000",
          extendedProps: {
            description: activity.description,
            registerStart: activity.registerStart,
            registerEnd: activity.registerEnd,
            activityStart: activity.activityStart,
            activityEnd: activity.activityEnd,
            newsId: activity.newsId || null,
          },
        }));
        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchActivities();
  }, []);

  const changeMonth = (increment: number) => {
    if (calendarRef.current) {
      const newDate = new Date(currentDate);
      newDate.setMonth(newDate.getMonth() + increment);
      setCurrentDate(newDate);
      calendarRef.current.getApi().gotoDate(newDate);
    }
  };

  const downloadCalendarAsImage = async () => {
    if (!calendarRef.current) return;
    const calendarElement = document.querySelector(".fc") as HTMLElement | null;
    if (!calendarElement) return;
    const canvas = await html2canvas(calendarElement, { scale: 2, backgroundColor: null, useCORS: true });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "calendar.png";
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-semibold text-center mb-6">ปฏิทินกิจกรรม</h1>

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <ChevronLeft className="w-5 h-5 mr-2" /> ก่อนหน้า
        </button>
        <span className="text-lg font-semibold">{format(currentDate, "MMMM yyyy", { locale: th })}</span>
        <button onClick={() => changeMonth(1)} className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center">
          ถัดไป <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      <div className="flex justify-end mb-4">
        <button onClick={downloadCalendarAsImage} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center">
          <Download className="w-5 h-5 mr-2" /> ดาวน์โหลดปฏิทิน
        </button>
      </div>

      <div className="overflow-hidden bg-gray-800 p-4 rounded-lg shadow-xl max-w-3xl mx-auto">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          initialDate={currentDate}
          events={events}
          locale={thLocale}
          eventClick={(info) => {
            const newsId = info.event.extendedProps.newsId;
            MySwal.fire({
              title: info.event.title,
              html: `
                <p><strong>เปิดลงทะเบียน:</strong> ${format(new Date(info.event.extendedProps.registerStart), "dd MMMM yyyy HH:mm:ss", { locale: th })}</p>
                <p><strong>ปิดลงทะเบียน:</strong> ${format(new Date(info.event.extendedProps.registerEnd), "dd MMMM yyyy HH:mm:ss", { locale: th })}</p>
                ${newsId ? `<div style='margin-top:10px;'><a href='/news/${typeof newsId === 'object' ? newsId._id : newsId}' target='_blank' style='color:#3b82f6; text-decoration:underline;'>ข่าวสารกิจกรรม</a></div>` : ''}
              `,
              icon: "info",
              confirmButtonText: "ปิด",
            });
          }}
          eventContent={(arg) => (
            <div style={{ color: "#1f2937", fontWeight: "bold" }}>{arg.event.title}</div>
          )}
          themeSystem="bootstrap5"
        />
      </div>
    </div>
  );
}
