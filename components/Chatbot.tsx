

// "use client";
// import { useState, useRef, useEffect } from "react";
// import { useSession } from "next-auth/react";

// type Activity = {
//   _id: string;
//   title: string;
//   registerStart: string;
//   registerEnd: string;
//   activityStart: string;
//   activityEnd: string;
//   location: string;
//   status: "open" | "closed";
//   maxParticipants: number;
//   participants: any[];
// };

// type News = {
//   _id: string;
//   title: string;
//   content: string;
//   image?: string;
//   pinned?: boolean;
//   createdAt: string;
// };

// type Message = { sender: "user" | "bot"; text: string; newsImage?: string };

// function formatDateTH(date: string) {
//   return new Date(date).toLocaleString("th-TH", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// export default function Chatbot() {
//   const [open, setOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       sender: "bot",
//       text: "สวัสดีจ้า! ถามเรื่องกิจกรรม ข่าวสาร หรือปัญหาอะไรก็ได้เลยนะ 😊",
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { data: session } = useSession();
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, open]);

//   function isNewsSummary(text: string) {
//     const ptn = /ข่าว(ใหม่|อะไรบ้าง|ล่าสุด|ทั้งหมด|อัพเดต|บ้าง|มั้ย|ไหม|มี|รวม)?$/i;
//     return ptn.test(text.trim());
//   }

//   function isNewsRelated(text: string) {
//     return /ข่าว|news/i.test(text);
//   }

//   async function handleSend() {
//     if (!input.trim()) return;
//     const userMsg = input.trim();
//     setMessages((msgs) => [...msgs, { sender: "user", text: userMsg }]);
//     setInput("");
//     setLoading(true);

//     if (isNewsRelated(userMsg)) {
//       let newsList: News[] = [];
//       try {
//         const res = await fetch("/api/news?limit=10");
//         newsList = await res.json();
//       } catch {
//         setMessages((msgs) => [
//           ...msgs,
//           {
//             sender: "bot",
//             text: "ขออภัย บอทดึงข่าวสารไม่ได้เลยจ้า ลองใหม่อีกทีนะ",
//           },
//         ]);
//         setLoading(false);
//         return;
//       }

//       if (isNewsSummary(userMsg)) {
//         if (!newsList.length) {
//           setMessages((msgs) => [
//             ...msgs,
//             {
//               sender: "bot",
//               text: "ตอนนี้ยังไม่มีข่าวใหม่ ๆ ในระบบเลยน้า",
//             },
//           ]);
//         } else {
//           const newsMsgs: Message[] = newsList.slice(0, 3).map((n) => ({
//             sender: "bot",
//             text: `• ${n.title}\n${n.content.slice(0, 120).replace(/\n/g, " ")}...`,
//             newsImage: n.image,
//           }));
//           setMessages((msgs) => [
//             ...msgs,
//             {
//               sender: "bot",
//               text: `นี่ข่าวอัปเดตล่าสุด ${newsMsgs.length} เรื่องจ้า👇`,
//             },
//             ...newsMsgs,
//           ]);
//         }
//         setLoading(false);
//         return;
//       }

//       let found: News | undefined = newsList.find((n) => n.pinned);
//       if (!found) {
//         found = newsList.find(
//           (n) =>
//             n.title.toLowerCase().includes(userMsg.toLowerCase()) ||
//             n.content.toLowerCase().includes(userMsg.toLowerCase())
//         );
//       }
//       if (!found && newsList.length > 0) found = newsList[0];

//       if (found) {
//         setMessages((msgs) => [
//           ...msgs,
//           {
//             sender: "bot",
//             text: `ข่าวนี้น่าสนใจเลยจ้า!\n${found.title}\n${found.content
//               .slice(0, 200)
//               .replace(/\n/g, " ")}...`,
//             newsImage: found.image,
//           },
//         ]);
//       } else {
//         setMessages((msgs) => [
//           ...msgs,
//           {
//             sender: "bot",
//             text: "ยังไม่มีข่าวที่ตรงกับที่ถามมาเลยจ้า ลองถามใหม่อีกทีได้นะ",
//           },
//         ]);
//       }
//       setLoading(false);
//       return;
//     }

//     let activities: Activity[] = [];
//     try {
//       const res = await fetch("/api/activities");
//       activities = await res.json();
//     } catch {
//       setMessages((msgs) => [
//         ...msgs,
//         {
//           sender: "bot",
//           text: "ขออภัย เชื่อมต่อข้อมูลกิจกรรมไม่ได้ ลองอีกทีน้า",
//         },
//       ]);
//       setLoading(false);
//       return;
//     }

//     let activitiesInfo = "";
//     if (activities.length === 0) {
//       activitiesInfo = "- ช่วงนี้ยังไม่มีกิจกรรมในระบบเลยน้า";
//     } else {
//       activitiesInfo += activities
//         .map(
//           (a, idx) =>
//             `${idx + 1}. ${a.title} [${
//               a.status === "open" ? "เปิดลงทะเบียน" : "ปิดลงทะเบียน"
//             }]
// - ลงทะเบียน: ${formatDateTH(a.registerStart)} ถึง ${formatDateTH(a.registerEnd)}
// - วันกิจกรรม: ${formatDateTH(a.activityStart)} ถึง ${formatDateTH(a.activityEnd)}
// - สถานที่: ${a.location}
// - จำนวนที่รับ: ${a.maxParticipants} คน
// - ลงทะเบียนแล้ว: ${a.participants.length} คน`
//         )
//         .join("\n\n");
//     }

//     const prompt = `
// ผู้ใช้ถามว่า: "${userMsg}"
// นี่คือกิจกรรมทั้งหมดในระบบตอนนี้:
// ${activitiesInfo}
// ตอบแบบเป็นกันเอง เหมือนคุยกับเพื่อนหรือรุ่นพี่ในม. ให้ข้อมูลตรงประเด็น ถ้าไม่มีข้อมูลให้แจ้งว่า "ยังไม่มีกิจกรรมที่เปิดลงทะเบียน"
// `;

//     let aiResponse = "เกิดข้อผิดพลาด";
//     try {
//       const res = await fetch("/api/ask-gemini", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt }),
//       });
//       const data = await res.json();
//       aiResponse = data.text;
//     } catch {
//       aiResponse = "ขออภัย ระบบบอทขัดข้อง ลองถามใหม่อีกทีน้า";
//     }

//     setMessages((msgs) => [...msgs, { sender: "bot", text: aiResponse }]);
//     setLoading(false);
//   }

//   return (
//     <>
//       <button
//         onClick={() => setOpen(!open)}
//         className="fixed z-50 bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl transition"
//         aria-label="เปิด/ปิดแชทบอท"
//       >
//         <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
//           <circle cx="12" cy="12" r="12" fill="white" opacity="0.18" />
//           <path
//             d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"
//             fill="currentColor"
//           />
//         </svg>
//       </button>

//       {open && (
//         <div className="fixed bottom-24 right-5 w-80 max-w-xs bg-white shadow-2xl rounded-2xl border z-50 flex flex-col">
//           <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-500 rounded-t-2xl">
//             <div className="flex items-center gap-2">
//               <span className="inline-flex w-8 h-8 rounded-full bg-white items-center justify-center">
//                 <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
//                   <circle cx="12" cy="8" r="4" />
//                   <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z" />
//                 </svg>
//               </span>
//               <span className="text-white font-bold">Chatbot สอบถาม</span>
//             </div>
//             <button
//               className="text-white"
//               onClick={() => setOpen(false)}
//               aria-label="ปิดแชท"
//             >
//               ×
//             </button>
//           </div>

//           <div className="p-3 flex-1 overflow-y-auto" style={{ maxHeight: "320px" }}>
//             {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 className={`flex flex-col items-end mb-3 ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {msg.sender === "bot" ? (
//                   <div className="flex flex-col items-start max-w-full">
//                     <div className="flex items-end">
//                       <span className="w-7 h-7 mr-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
//                         <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
//                           <circle cx="12" cy="8" r="4" />
//                           <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z" />
//                         </svg>
//                       </span>
//                       <span className="bg-blue-50 text-gray-800 px-3 py-2 rounded-2xl max-w-[85%] text-sm shadow" style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
//                         {msg.text}
//                       </span>
//                     </div>
//                     {msg.newsImage && (
//                       <img
//                         src={msg.newsImage}
//                         alt="ข่าว"
//                         className="ml-9 mt-2 rounded-lg shadow max-h-32 max-w-[80%] object-cover"
//                       />
//                     )}
//                   </div>
//                 ) : (
//                   <div className="flex items-end">
//                     <span className="bg-blue-500 text-white px-3 py-2 rounded-2xl max-w-[70%] text-sm shadow">
//                       {msg.text}
//                     </span>
//                     {session?.user?.image ? (
//                       <img
//                         src={session.user.image}
//                         alt="user"
//                         className="w-7 h-7 ml-2 rounded-full object-cover"
//                       />
//                     ) : (
//                       <span className="w-7 h-7 ml-2 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
//                         <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
//                           <circle cx="12" cy="8" r="4" />
//                           <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z" />
//                         </svg>
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ))}
//             <div ref={bottomRef} />
//           </div>

//           <div className="p-3 border-t flex items-center gap-2">
//             <input
//               type="text"
//               className="flex-1 border rounded-2xl px-3 py-2 text-sm focus:outline-none"
//               placeholder="พิมพ์คำถาม..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") handleSend();
//               }}
//             />
//             <button
//               className="text-blue-500 font-bold disabled:opacity-50"
//               onClick={handleSend}
//               disabled={loading}
//             >
//               ส่ง
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Activity = {
  _id: string;
  title: string;
  registerStart: string;
  registerEnd: string;
  activityStart: string;
  activityEnd: string;
  location: string;
  status: "open" | "closed";
  maxParticipants: number;
  participants: any[];
};

type News = {
  _id: string;
  title: string;
  content: string;
  image?: string;
  pinned?: boolean;
  createdAt: string;
};

type Message = { sender: "user" | "bot"; text: string; newsImage?: string };

function formatDateTH(date: string) {
  return new Date(date).toLocaleString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "สวัสดีจ้า! ถามเรื่องกิจกรรม ข่าวสาร หรืออะไรก็ได้เลยน้า 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  function isNewsSummary(text: string) {
    const ptn = /ข่าว(ใหม่|อะไรบ้าง|ล่าสุด|ทั้งหมด|อัพเดต|บ้าง|มั้ย|ไหม|มี|รวม)?$/i;
    return ptn.test(text.trim());
  }

  function isNewsRelated(text: string) {
    return /ข่าว|news/i.test(text);
  }

  async function handleSend(userInput: string = input.trim()) {
    if (!userInput) return;
    setMessages((msgs) => [...msgs, { sender: "user", text: userInput }]);
    setInput("");
    setLoading(true);

    if (isNewsRelated(userInput)) {
      let newsList: News[] = [];
      try {
        const res = await fetch("/api/news?limit=10");
        newsList = await res.json();
      } catch {
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: "ขออภัย บอทดึงข่าวสารไม่ได้เลยจ้า ลองใหม่อีกทีนะ",
          },
        ]);
        setLoading(false);
        return;
      }

      if (isNewsSummary(userInput)) {
        if (!newsList.length) {
          setMessages((msgs) => [
            ...msgs,
            {
              sender: "bot",
              text: "ตอนนี้ยังไม่มีข่าวใหม่ ๆ ในระบบเลยน้า",
            },
          ]);
        } else {
          const newsMsgs: Message[] = newsList.slice(0, 3).map((n) => ({
            sender: "bot",
            text: `• ${n.title}\n${n.content.slice(0, 120).replace(/\n/g, " ")}...`,
            newsImage: n.image,
          }));
          setMessages((msgs) => [
            ...msgs,
            {
              sender: "bot",
              text: `นี่ข่าวอัปเดตล่าสุด ${newsMsgs.length} เรื่องจ้า 👇`,
            },
            ...newsMsgs,
          ]);
        }
        setLoading(false);
        return;
      }

      let found: News | undefined = newsList.find((n) => n.pinned);
      if (!found) {
        found = newsList.find(
          (n) =>
            n.title.toLowerCase().includes(userInput.toLowerCase()) ||
            n.content.toLowerCase().includes(userInput.toLowerCase())
        );
      }
      if (!found && newsList.length > 0) found = newsList[0];

      if (found) {
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: `ข่าวนี้น่าสนใจเลยจ้า!\n${found.title}\n${found.content
              .slice(0, 200)
              .replace(/\n/g, " ")}...`,
            newsImage: found.image,
          },
        ]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          {
            sender: "bot",
            text: "ยังไม่มีข่าวที่ตรงกับที่ถามมาเลยจ้า ลองถามใหม่อีกทีได้นะ",
          },
        ]);
      }
      setLoading(false);
      return;
    }

    let activities: Activity[] = [];
    try {
      const res = await fetch("/api/activities");
      activities = await res.json();
    } catch {
      setMessages((msgs) => [
        ...msgs,
        {
          sender: "bot",
          text: "ขออภัย เชื่อมต่อข้อมูลกิจกรรมไม่ได้ ลองอีกทีน้า",
        },
      ]);
      setLoading(false);
      return;
    }

    let activitiesInfo = "";
    if (activities.length === 0) {
      activitiesInfo = "- ช่วงนี้ยังไม่มีกิจกรรมในระบบเลยน้า";
    } else {
      activitiesInfo += activities
        .map(
          (a, idx) =>
            `${idx + 1}. ${a.title} [${
              a.status === "open" ? "เปิดลงทะเบียน" : "ปิดลงทะเบียน"
            }]
- ลงทะเบียน: ${formatDateTH(a.registerStart)} ถึง ${formatDateTH(a.registerEnd)}
- วันกิจกรรม: ${formatDateTH(a.activityStart)} ถึง ${formatDateTH(a.activityEnd)}
- สถานที่: ${a.location}
- จำนวนที่รับ: ${a.maxParticipants} คน
- ลงทะเบียนแล้ว: ${a.participants.length} คน`
        )
        .join("\n\n");
    }

    const prompt = `
ผู้ใช้ถามว่า: "${userInput}"
นี่คือกิจกรรมทั้งหมดในระบบตอนนี้:
${activitiesInfo}
ตอบแบบเป็นกันเอง เหมือนคุยกับเพื่อนหรือรุ่นพี่ในม. ให้ข้อมูลตรงประเด็น ถ้าไม่มีข้อมูลให้แจ้งว่า "ยังไม่มีกิจกรรมที่เปิดลงทะเบียน"
`;

    let aiResponse = "เกิดข้อผิดพลาด";
    try {
      const res = await fetch("/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      aiResponse = data.text;
    } catch {
      aiResponse = "ขออภัย ระบบบอทขัดข้อง ลองถามใหม่อีกทีน้า";
    }

    setMessages((msgs) => [...msgs, { sender: "bot", text: aiResponse }]);
    setLoading(false);
  }

  const handleClearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "สวัสดีจ้า! ถามเรื่องกิจกรรม ข่าวสาร หรืออะไรก็ได้เลยน้า 😊",
      },
    ]);
  };

  const suggestedPrompts = [
    "ข่าวล่าสุดมีอะไรบ้าง",
    "กิจกรรมที่เปิดลงทะเบียน",
    "ปฏิทินกิจกรรม",
  ];

  return (
    <>
{/* ปุ่มเปิดแชทบอท */}
<motion.button
  onClick={() => setOpen(!open)}
  className="fixed z-50 bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 animate-pulse-hover"
  aria-label="เปิด/ปิดแชทบอท"
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
>
  <div className="flex flex-col items-center justify-center">
    <svg width="30" height="30" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="white" opacity="0.2" />
      <path
        d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z"
        fill="currentColor"
      />
    </svg>
    <span className="text-xs font-semibold mt-1">สอบถาม</span>
  </div>
</motion.button>

      {/* หน้าต่างแชท */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 w-80 max-w-[90vw] sm:w-96 bg-gray-900/80 backdrop-blur-lg shadow-2xl rounded-2xl border border-gray-800/50 z-50 flex flex-col font-sarabun"
          >
            {/* ส่วนหัว */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50 bg-blue-700/80 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <span className="inline-flex w-8 h-8 rounded-full bg-white items-center justify-center text-blue-600">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z" />
                  </svg>
                </span>
                <span className="text-white font-bold text-sm">บอทสอบถาม</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-gray-300 hover:text-white text-xs px-2 py-1 rounded-md hover:bg-gray-700/50"
                  onClick={handleClearChat}
                  aria-label="ล้างแชท"
                >
                  ล้าง
                </button>
                <button
                  className="text-gray-300 hover:text-white"
                  onClick={() => setOpen(false)}
                  aria-label="ปิดแชท"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* พื้นที่แชท */}
            <div className="p-4 flex-1 overflow-y-auto" style={{ maxHeight: "400px" }}>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex flex-col mb-3 ${
                    msg.sender === "user" ? "items-end" : "items-start"
                  }`}
                >
                  {msg.sender === "bot" ? (
                    <div className="flex flex-col items-start max-w-full">
                      <div className="flex items-end">
                        <span className="w-8 h-8 mr-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z" />
                          </svg>
                        </span>
                        <span className="bg-gray-800/80 text-gray-200 px-3 py-2 rounded-2xl max-w-[80%] text-sm shadow-md" style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
                          {msg.text}
                        </span>
                      </div>
                      {msg.newsImage && (
                        <motion.img
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          src={msg.newsImage}
                          alt="ข่าว"
                          className="ml-10 mt-2 rounded-lg shadow max-h-32 max-w-[80%] object-cover"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="flex items-end">
                      <span className="bg-blue-600 text-white px-3 py-2 rounded-2xl max-w-[70%] text-sm shadow-md">
                        {msg.text}
                      </span>
                      {session?.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt="ผู้ใช้"
                          width={28}
                          height={28}
                          className="w-7 h-7 ml-2 rounded-full object-cover"
                        />
                      ) : (
                        <span className="w-7 h-7 ml-2 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z" />
                          </svg>
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start mb-3"
                >
                  <span className="w-8 h-8 mr-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z" />
                    </svg>
                  </span>
                  <span className="bg-gray-800/80 text-gray-200 px-3 py-2 rounded-2xl text-sm flex items-center gap-1">
                    <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full delay-100"></span>
                    <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full delay-200"></span>
                  </span>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* คำถามแนะนำ */}
            <div className="px-4 py-2 border-t border-gray-800/50">
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    className="text-xs text-gray-300 bg-gray-800/50 hover:bg-gray-700/50 px-2 py-1 rounded-full transition-all duration-300"
                    disabled={loading}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* อินพุต */}
            <div className="p-4 border-t border-gray-800/50 flex items-center gap-2">
              <input
                type="text"
                className="flex-1 bg-gray-800/50 text-gray-200 border border-gray-700 rounded-2xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="พิมพ์คำถาม..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                disabled={loading}
              />
              <button
                className="bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all duration-300"
                onClick={() => handleSend()}
                disabled={loading}
                aria-label="ส่งข้อความ"
              >
                ส่ง
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}