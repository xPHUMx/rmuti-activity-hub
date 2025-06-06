// "use client";
// import { useState, useRef, useEffect } from "react";

// // มึงดึง session user ด้วย useSession จาก next-auth/react
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

// type Message = { sender: "user" | "bot"; text: string };

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
//     { sender: "bot", text: "สอบถามข้อมูลกิจกรรมหรือปัญหาได้เลยค่ะ 😊" }
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { data: session } = useSession();
//   const bottomRef = useRef<HTMLDivElement>(null);

//   // scroll to bottom ทุกครั้งที่มีข้อความใหม่
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, open]);

//   async function handleSend() {
//     if (!input.trim()) return;
//     const userMsg = input.trim();
//     setMessages(msgs => [...msgs, { sender: "user", text: userMsg }]);
//     setInput("");
//     setLoading(true);

//     let activities: Activity[] = [];
//     try {
//       const res = await fetch("/api/activities");
//       activities = await res.json();
//     } catch {
//       setMessages(msgs => [
//         ...msgs,
//         { sender: "bot", text: "ขออภัย บอทเชื่อมต่อข้อมูลกิจกรรมไม่ได้" }
//       ]);
//       setLoading(false);
//       return;
//     }

//     let activitiesInfo = "ขณะนี้กิจกรรมทั้งหมด:\n";
//     if (activities.length === 0) {
//       activitiesInfo += "- ยังไม่มีกิจกรรมในระบบ";
//     } else {
//       activitiesInfo += activities
//         .map(
//           (a, idx) =>
//             `${idx + 1}. ${a.title} [${a.status === "open" ? "เปิดลงทะเบียน" : "ปิดลงทะเบียน"}]
// - ลงทะเบียน: ${formatDateTH(a.registerStart)} ถึง ${formatDateTH(a.registerEnd)}
// - วันกิจกรรม: ${formatDateTH(a.activityStart)} ถึง ${formatDateTH(a.activityEnd)}
// - สถานที่: ${a.location}
// - จำนวนที่รับ: ${a.maxParticipants} คน
// - ลงทะเบียนแล้ว: ${a.participants.length} คน
// `
//         )
//         .join("\n");
//     }

//     const prompt = `
// มี user ถามว่า: "${userMsg}"
// นี่คือข้อมูลกิจกรรมของนักศึกษาที่เปิด/ปิดลงทะเบียนในระบบตอนนี้:
// ${activitiesInfo}
// กรุณาตอบ user ด้วยข้อมูลที่ตรงและอ่านง่าย, เป็นกันเอง ถ้าไม่มีข้อมูลกิจกรรมเปิดลงทะเบียนตอนนี้ ให้แจ้งว่า "ยังไม่มีกิจกรรมที่เปิดลงทะเบียน"
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
//       aiResponse = "ขออภัย ระบบแชทบอทมีปัญหา";
//     }

//     setMessages(msgs => [...msgs, { sender: "bot", text: aiResponse }]);
//     setLoading(false);
//   }

//   return (
//     <>
//       {/* วงกลม Icon Bot */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="fixed z-50 bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl transition"
//         aria-label="เปิด/ปิดแชทบอท"
//       >
//         {/* Icon หัวคนแนว chatbot */}
//         <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
//           <circle cx="12" cy="12" r="12" fill="white" opacity="0.18"/>
//           <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" fill="currentColor"/>
//         </svg>
//       </button>

//       {/* กล่องแชทเด้ง */}
//       {open && (
//         <div className="fixed bottom-24 right-5 w-80 max-w-xs bg-white shadow-2xl rounded-2xl border z-50 flex flex-col">
//           <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-500 rounded-t-2xl">
//             <div className="flex items-center gap-2">
//               {/* Bot icon */}
//               <span className="inline-flex w-8 h-8 rounded-full bg-white items-center justify-center">
//                 <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
//                   <circle cx="12" cy="8" r="4"/>
//                   <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z"/>
//                 </svg>
//               </span>
//               <span className="text-white font-bold">แชทบอทกิจกรรม</span>
//             </div>
//             <button className="text-white" onClick={() => setOpen(false)} aria-label="ปิดแชท">
//               ×
//             </button>
//           </div>
//           {/* แสดงข้อความ */}
//           <div className="p-3 flex-1 overflow-y-auto" style={{ maxHeight: "320px" }}>
//             {messages.map((msg, idx) => (
//               <div key={idx} className={`flex items-end mb-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
//                 {msg.sender === "bot" ? (
//                   <>
//                     <span className="w-7 h-7 mr-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
//                       {/* icon bot */}
//                       <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
//                         <circle cx="12" cy="8" r="4"/>
//                         <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z"/>
//                       </svg>
//                     </span>
//                     <span className="bg-blue-50 text-gray-800 px-3 py-2 rounded-2xl max-w-[70%] text-sm shadow">{msg.text}</span>
//                   </>
//                 ) : (
//                   <>
//                     <span className="bg-blue-500 text-white px-3 py-2 rounded-2xl max-w-[70%] text-sm shadow">{msg.text}</span>
//                     {session?.user?.image ? (
//                       <img src={session.user.image} alt="user" className="w-7 h-7 ml-2 rounded-full object-cover" />
//                     ) : (
//                       <span className="w-7 h-7 ml-2 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
//                         {/* user fallback icon */}
//                         <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
//                           <circle cx="12" cy="8" r="4"/>
//                           <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z"/>
//                         </svg>
//                       </span>
//                     )}
//                   </>
//                 )}
//               </div>
//             ))}
//             <div ref={bottomRef}></div>
//             {loading && <div className="text-gray-400 text-xs">บอทกำลังตอบ...</div>}
//           </div>
//           <div className="flex border-t p-2 gap-2 bg-gray-50 rounded-b-2xl">
//             <input
//               className="flex-1 rounded-xl border p-2 text-sm"
//               value={input}
//               onChange={e => setInput(e.target.value)}
//               onKeyDown={e => e.key === "Enter" && handleSend()}
//               placeholder="พิมพ์สอบถามที่นี่..."
//               disabled={loading}
//             />
//             <button
//               className="bg-blue-500 text-white px-3 py-1 rounded-xl"
//               onClick={handleSend}
//               disabled={loading || !input.trim()}
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
    { sender: "bot", text: "สวัสดีจ้า! ถามเรื่องกิจกรรม ข่าวสาร หรือปัญหาอะไรก็ได้เลยนะ 😊" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // "ข่าว" = คำถามรวม (true = โชว์ข่าว 3 อัน, false = หา match ที่สุด)
  function isNewsSummary(text: string) {
    // ถ้า user ถามสั้นๆว่า "ข่าว" หรือ "ข่าวอะไรบ้าง" หรือ "มีข่าวมั้ย" หรือ "ข่าวใหม่" ให้มองว่าอยากดูหลายข่าว
    const ptn = /ข่าว(ใหม่|อะไรบ้าง|ล่าสุด|ทั้งหมด|อัพเดต|บ้าง|มั้ย|ไหม|มี|รวม)?$/i;
    return ptn.test(text.trim());
  }

  // ถ้ามีคำว่า "ข่าว" (หรือ news) ติดมาในคำถามใดๆ (แต่ไม่ใช่คำถามรวม)
  function isNewsRelated(text: string) {
    return /ข่าว|news/i.test(text);
  }

  async function handleSend() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(msgs => [...msgs, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    // ดึงข่าวก่อนทุกครั้งถ้ามี "ข่าว" ในข้อความ
    if (isNewsRelated(userMsg)) {
      let newsList: News[] = [];
      try {
        const res = await fetch("/api/news?limit=10");
        newsList = await res.json();
      } catch {
        setMessages(msgs => [
          ...msgs,
          { sender: "bot", text: "ขออภัย บอทดึงข่าวสารไม่ได้เลยจ้า ลองใหม่อีกทีนะ" }
        ]);
        setLoading(false);
        return;
      }

      // กรณีถามรวม - "ข่าว", "ข่าวอะไรบ้าง", "มีข่าวมั้ย" ฯลฯ
      if (isNewsSummary(userMsg)) {
        if (!newsList.length) {
          setMessages(msgs => [
            ...msgs,
            { sender: "bot", text: "ตอนนี้ยังไม่มีข่าวใหม่ ๆ ในระบบเลยน้า" }
          ]);
        } else {
          const newsMsgs: Message[] = newsList.slice(0, 3).map(n => ({
            sender: "bot",
            text: `• ${n.title}\n${n.content.slice(0, 120).replace(/\n/g, " ")}...`,
            newsImage: n.image,
          }));
          setMessages(msgs => [
            ...msgs,
            { sender: "bot", text: `นี่ข่าวอัปเดตล่าสุด ${newsMsgs.length} เรื่องจ้า👇` },
            ...newsMsgs
          ]);
        }
        setLoading(false);
        return;
      }

      // กรณีข่าวเฉพาะ: หา match ใกล้เคียง/ปักหมุด/ล่าสุด
      // 1. ปักหมุดก่อน
      let found: News | undefined = newsList.find(n => n.pinned);
      // 2. หา match ใน title/content
      if (!found) {
        found = newsList.find(n =>
          n.title.toLowerCase().includes(userMsg.toLowerCase()) ||
          n.content.toLowerCase().includes(userMsg.toLowerCase())
        );
      }
      // 3. ถ้าไม่เจอเลย เอาข่าวล่าสุดสุด
      if (!found && newsList.length > 0) found = newsList[0];

      if (found) {
        setMessages(msgs => [
          ...msgs,
          {
            sender: "bot",
            text: `ข่าวนี้น่าสนใจเลยจ้า!\n${found.title}\n${found.content.slice(0, 200).replace(/\n/g, " ")}...`,
            newsImage: found.image,
          }
        ]);
      } else {
        setMessages(msgs => [
          ...msgs,
          { sender: "bot", text: "ยังไม่มีข่าวที่ตรงกับที่ถามมาเลยจ้า ลองถามใหม่อีกทีได้นะ" }
        ]);
      }
      setLoading(false);
      return;
    }

    // ถามกิจกรรม (หรืออื่น ๆ)
    let activities: Activity[] = [];
    try {
      const res = await fetch("/api/activities");
      activities = await res.json();
    } catch {
      setMessages(msgs => [
        ...msgs,
        { sender: "bot", text: "ขออภัย กูเชื่อมต่อข้อมูลกิจกรรมไม่ได้ ลองอีกทีน้า" }
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
            `${idx + 1}. ${a.title} [${a.status === "open" ? "เปิดลงทะเบียน" : "ปิดลงทะเบียน"}]
- ลงทะเบียน: ${formatDateTH(a.registerStart)} ถึง ${formatDateTH(a.registerEnd)}
- วันกิจกรรม: ${formatDateTH(a.activityStart)} ถึง ${formatDateTH(a.activityEnd)}
- สถานที่: ${a.location}
- จำนวนที่รับ: ${a.maxParticipants} คน
- ลงทะเบียนแล้ว: ${a.participants.length} คน`
        )
        .join("\n\n");
    }

    const prompt = `
ผู้ใช้ถามว่า: "${userMsg}"
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

    setMessages(msgs => [...msgs, { sender: "bot", text: aiResponse }]);
    setLoading(false);
  }

  return (
    <>
      {/* วงกลม Icon Bot */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed z-50 bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-xl transition"
        aria-label="เปิด/ปิดแชทบอท"
      >
        <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="12" fill="white" opacity="0.18"/>
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5Z" fill="currentColor"/>
        </svg>
      </button>
      {/* กล่องแชทเด้ง */}
      {open && (
        <div className="fixed bottom-24 right-5 w-80 max-w-xs bg-white shadow-2xl rounded-2xl border z-50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-500 rounded-t-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-8 h-8 rounded-full bg-white items-center justify-center">
                <svg width="28" height="28" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z"/>
                </svg>
              </span>
              <span className="text-white font-bold">Chatbot สอบถาม</span>
            </div>
            <button className="text-white" onClick={() => setOpen(false)} aria-label="ปิดแชท">
              ×
            </button>
          </div>
          {/* แสดงข้อความ */}
          <div className="p-3 flex-1 overflow-y-auto" style={{ maxHeight: "320px" }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col items-end mb-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "bot" ? (
                  <div className="flex flex-col items-start max-w-full">
                    <div className="flex items-end">
                      <span className="w-7 h-7 mr-2 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="8" r="4"/>
                          <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z"/>
                        </svg>
                      </span>
                      <span className="bg-blue-50 text-gray-800 px-3 py-2 rounded-2xl max-w-[85%] text-sm shadow" style={{ wordBreak: "break-word", whiteSpace: "pre-line" }}>
                        {msg.text}
                      </span>
                    </div>
                    {msg.newsImage && (
                      <img
                        src={msg.newsImage}
                        alt="ข่าว"
                        className="ml-9 mt-2 rounded-lg shadow max-h-32 max-w-[80%] object-cover"
                      />
                    )}
                  </div>
                ) : (
                  <div className="flex items-end">
                    <span className="bg-blue-500 text-white px-3 py-2 rounded-2xl max-w-[70%] text-sm shadow">{msg.text}</span>
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="user" className="w-7 h-7 ml-2 rounded-full object-cover" />
                    ) : (
                      <span className="w-7 h-7 ml-2 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <circle cx="12" cy="8" r="4"/>
                          <path d="M12 14c-3.33 0-10 1.67-10 5v2h20v-2c0-3.33-6.67-5-10-5Z"/>
                        </svg>
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={bottomRef}></div>
            {loading && <div className="text-gray-400 text-xs">บอทกำลังตอบ...</div>}
          </div>
          <div className="flex border-t p-2 gap-2 bg-gray-50 rounded-b-2xl">
            <input
              className="flex-1 rounded-xl border p-2 text-sm"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
              placeholder="พิมพ์สอบถามที่นี่..."
              disabled={loading}
            />
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded-xl"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              ส่ง
            </button>
          </div>
        </div>
      )}
    </>
  );
}


