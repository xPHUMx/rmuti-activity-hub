// "use client";

// import { useState, useEffect } from "react";
// import { format } from "date-fns";
// import Swal from 'sweetalert2'; // SweetAlert2
// import withReactContent from 'sweetalert2-react-content'; // ใช้ SweetAlert2
// import FullCalendar from "@fullcalendar/react"; // นำเข้า FullCalendar
// import dayGridPlugin from "@fullcalendar/daygrid"; // ใช้ day grid plugin
// import interactionPlugin from "@fullcalendar/interaction"; // ใช้ interaction plugin สำหรับคลิกกิจกรรม

// const MySwal = withReactContent(Swal); // ใช้ SweetAlert2

// // กำหนดข้อมูลกิจกรรม
// type Activity = {
//   _id: string;
//   title: string;
//   description: string;
//   time: string; // เวลาเปิด
//   closeTime: string; // เวลาปิด
// };

// export default function CalendarPage() {
//   const [events, setEvents] = useState<any[]>([]);

//   // ดึงข้อมูลกิจกรรมจาก API
//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const response = await fetch(`/api/activities`);
//         const data: Activity[] = await response.json();

//         // แปลงข้อมูลกิจกรรมให้เหมาะสมกับ FullCalendar
//         const calendarEvents = data.map((activity) => ({
//           title: activity.title,
//           start: format(new Date(activity.time), "yyyy-MM-dd'T'HH:mm:ss"),
//           end: format(new Date(activity.closeTime), "yyyy-MM-dd'T'HH:mm:ss"),
//           description: activity.description,
//           id: activity._id,
//         }));

//         setEvents(calendarEvents);
//       } catch (error) {
//         console.error("Error fetching activities:", error);
//       }
//     };

//     fetchActivities();
//   }, []);

//   // ฟังก์ชั่นที่จะแสดง SweetAlert2 Popup เมื่อคลิกกิจกรรม
//   const showActivityDetails = (activity: Activity) => {
//     MySwal.fire({
//       title: activity.title,
//       html: `
//         <p><strong>รายละเอียดกิจกรรม:</strong><br>${activity.description}</p>
//         <p><strong>เวลาเปิดลงทะเบียน:</strong> ${format(new Date(activity.time), 'dd MMM yyyy HH:mm:ss')}</p>
//         <p><strong>เวลาปิดลงทะเบียน:</strong> ${format(new Date(activity.closeTime), 'dd MMM yyyy HH:mm:ss')}</p>
//       `,
//       icon: 'info',
//       confirmButtonText: 'ตกลง',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <h1 className="text-4xl font-semibold text-center mb-6">ปฏิทินกิจกรรม</h1>
      
//       <div className="overflow-hidden bg-gray-800 p-4 rounded-lg shadow-lg">
//         {/* ปฏิทิน FullCalendar */}
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin]} // ใช้ day grid และ interaction
//           initialView="dayGridMonth" // เริ่มต้นแสดงเป็นมุมมองเดือน
//           events={events} // กำหนดข้อมูลกิจกรรม
//           eventClick={(info) => {
//             const activity: Activity = {
//               _id: info.event.id, // เพิ่ม _id จาก event.id
//               title: info.event.title,
//               description: info.event.extendedProps.description, // ดึงจาก extendedProps
//               time: info.event.start ? info.event.start.toISOString() : "",
//               closeTime: info.event.end ? info.event.end.toISOString() : "",
//             };
//             showActivityDetails(activity);
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { format } from "date-fns";
// import Swal from "sweetalert2"; 
// import withReactContent from "sweetalert2-react-content";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// const MySwal = withReactContent(Swal);

// type Activity = {
//   _id: string;
//   title: string;
//   description: string;
//   time: string;
//   closeTime: string;
// };

// export default function CalendarPage() {
//   const [events, setEvents] = useState<any[]>([]);
//   const calendarRef = useRef(null);

//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const response = await fetch(`/api/activities`);
//         const data: Activity[] = await response.json();
//         const calendarEvents = data.map((activity) => ({
//           title: activity.title,
//           start: format(new Date(activity.time), "yyyy-MM-dd'T'HH:mm:ss"),
//           end: format(new Date(activity.closeTime), "yyyy-MM-dd'T'HH:mm:ss"),
//           description: activity.description,
//           id: activity._id,
//         }));

//         setEvents(calendarEvents);
//       } catch (error) {
//         console.error("Error fetching activities:", error);
//       }
//     };

//     fetchActivities();
//   }, []);

//   const showActivityDetails = (activity: Activity) => {
//     MySwal.fire({
//       title: activity.title,
//       html: `
//         <p><strong>รายละเอียดกิจกรรม:</strong><br>${activity.description}</p>
//         <p><strong>เวลาเปิด:</strong> ${format(new Date(activity.time), "dd MMM yyyy HH:mm:ss")}</p>
//         <p><strong>เวลาปิด:</strong> ${format(new Date(activity.closeTime), "dd MMM yyyy HH:mm:ss")}</p>
//       `,
//       icon: "info",
//       confirmButtonText: "ตกลง",
//     });
//   };

//   // ฟังก์ชันดาวน์โหลดปฏิทินเป็น PDF
//   const downloadCalendarAsImage = async () => {
//     if (!calendarRef.current) return;
    
//     const canvas = await html2canvas(calendarRef.current, { scale: 2 });
//     const link = document.createElement("a");
//     link.href = canvas.toDataURL("image/png");
//     link.download = "calendar.png";
//     link.click();
//   };
  

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <h1 className="text-4xl font-semibold text-center mb-6">ปฏิทินกิจกรรม</h1>

//       <div className="flex justify-end mb-4">
//       <button
//   onClick={downloadCalendarAsImage}
//   className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
// >
//   ดาวน์โหลดปฏิทิน
// </button>
//       </div>

//       <div className="overflow-hidden bg-gray-800 p-4 rounded-lg shadow-lg" ref={calendarRef}>
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           events={events}
//           eventClick={(info) => {
//             const activity = {
//               _id: info.event.id,
//               title: info.event.title,
//               description: info.event.extendedProps.description,
//               time: info.event.start ? info.event.start.toISOString() : "",
//               closeTime: info.event.end ? info.event.end.toISOString() : "",
//             };
//             showActivityDetails(activity);
//           }}
//         />
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useRef } from "react";
// import { format } from "date-fns";
// import Swal from "sweetalert2"; 
// import withReactContent from "sweetalert2-react-content";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import html2canvas from "html2canvas";

// const MySwal = withReactContent(Swal);

// // ฟังก์ชันสุ่มสี
// const getRandomColor = () => {
//   const colors = ["#FF5733", "#33FF57", "#337BFF", "#F333FF", "#FF9933", "#33FFF5", "#FF33A1", "#A133FF"];
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
//   const calendarRef = useRef(null);

//   useEffect(() => {
//     const fetchActivities = async () => {
//       try {
//         const response = await fetch(`/api/activities`);
//         const data: Activity[] = await response.json();
//         const calendarEvents = data.map((activity) => ({
//           id: activity._id,
//           title: activity.title, // แสดงเฉพาะชื่อกิจกรรม
//           start: format(new Date(activity.time), "yyyy-MM-dd'T'HH:mm:ss"),
//           end: format(new Date(activity.closeTime), "yyyy-MM-dd'T'HH:mm:ss"),
//           backgroundColor: getRandomColor(), // ใช้สีสุ่ม
//           borderColor: "transparent",
//           extendedProps: { // เก็บรายละเอียดไว้ใน extendedProps
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

//   const showActivityDetails = (info: any) => {
//     MySwal.fire({
//       title: info.event.title,
//       html: `
//         <p><strong>รายละเอียดกิจกรรม:</strong><br>${info.event.extendedProps.description}</p>
//         <p><strong>เวลาเปิด:</strong> ${format(new Date(info.event.extendedProps.time), "dd MMM yyyy HH:mm:ss")}</p>
//         <p><strong>เวลาปิด:</strong> ${format(new Date(info.event.extendedProps.closeTime), "dd MMM yyyy HH:mm:ss")}</p>
//       `,
//       icon: "info",
//       confirmButtonText: "ตกลง",
//     });
//   };

//   // ฟังก์ชันดาวน์โหลดปฏิทินเป็นภาพ PNG
//   const downloadCalendarAsImage = async () => {
//     if (!calendarRef.current) return;
    
//     const canvas = await html2canvas(calendarRef.current, { scale: 2 });
//     const link = document.createElement("a");
//     link.href = canvas.toDataURL("image/png");
//     link.download = "calendar.png";
//     link.click();
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <h1 className="text-4xl font-semibold text-center mb-6">ปฏิทินกิจกรรม</h1>

//       <div className="flex justify-end mb-4">
//         <button
//           onClick={downloadCalendarAsImage}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//         >
//           ดาวน์โหลดปฏิทิน
//         </button>
//       </div>

//       <div className="overflow-hidden bg-gray-800 p-4 rounded-lg shadow-lg" ref={calendarRef}>
//         <FullCalendar
//           plugins={[dayGridPlugin, interactionPlugin]}
//           initialView="dayGridMonth"
//           events={events}
//           eventClick={showActivityDetails} // กดแล้วแสดงรายละเอียด
//           eventContent={(arg) => <div>{arg.event.title}</div>} // แสดงแค่ชื่อกิจกรรม
//         />
//       </div>
//     </div>
//   );
// }


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
