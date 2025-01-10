// import express from "express";
// import cron from "node-cron";
// import connectToDatabase from "./utils/db.js"; // เชื่อมต่อ MongoDB
// import Activity from "./models/Activity.js"; // โมเดลของ Activity

// // เชื่อมต่อฐานข้อมูล
// connectToDatabase();

// const app = express();

// // อัปเดตสถานะกิจกรรมที่ถึงเวลาปิดทุกนาที
// cron.schedule ("* * * * *") , async () => {
//   const now = new Date();
//   try {
//     // ค้นหากิจกรรมที่ถึงเวลาปิดและยังคงเปิดอยู่
//     const result = await Activity.updateMany(
//       { closeTime: { $lte: now }, status: "open" },
//       { $set: { status: "closed" } }
//     );     
//   }    
// }

import express from "express";
import cron from "node-cron";
import { WebSocketServer, WebSocket } from "ws";
import http from "http"; // ใช้สำหรับสร้าง HTTP Server
import connectToDatabase from "./utils/db.js"; // เชื่อมต่อ MongoDB
import Activity from "./models/Activity.js"; // โมเดล Activity

// เชื่อมต่อฐานข้อมูล
connectToDatabase();

const app = express();
const server = http.createServer(app); // สร้าง HTTP Server
const wss = new WebSocketServer({ server }); // สร้าง WebSocket Server

// อัปเดตสถานะกิจกรรมที่ถึงเวลาปิดทุกนาที
cron.schedule("* * * * *", async () => {
  const now = new Date();
  try {
    // ค้นหากิจกรรมที่ถึงเวลาปิดและยังคงเปิดอยู่
    const result = await Activity.updateMany(
      { closeTime: { $lte: now }, status: "open" },
      { $set: { status: "closed" } }
    );
    console.log(`Updated ${result.modifiedCount} activities to closed.`);
  } catch (error) {
    console.error("Error updating activities:", error);
  }
});

// เก็บข้อมูลผู้ใช้ออนไลน์
let onlineUsers = new Set<string>();

// WebSocket Server: จัดการการเชื่อมต่อ
wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  // รับข้อความจากไคลเอนต์
  ws.on("message", (message: string) => {
    try {
      const data = JSON.parse(message);
      if (data.action === "online" && data.userId) {
        onlineUsers.add(data.userId);
        console.log(`User ${data.userId} is online`);
        broadcastOnlineCount();
      } else if (data.action === "offline" && data.userId) {
        onlineUsers.delete(data.userId);
        console.log(`User ${data.userId} is offline`);
        broadcastOnlineCount();
      }
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });

  // เมื่อไคลเอนต์ตัดการเชื่อมต่อ
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// ฟังก์ชันส่งจำนวนผู้ใช้ออนไลน์ไปยังไคลเอนต์ทั้งหมด
function broadcastOnlineCount() {
  const onlineCount = onlineUsers.size;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ onlineCount }));
    }
  });
}

// เริ่มเซิร์ฟเวอร์
const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`WebSocket Server is running on ws://localhost:${PORT}`);
});


// import express from "express";
// import cron from "node-cron";
// import { WebSocketServer, WebSocket } from "ws";
// import http from "http";
// import connectToDatabase from "./utils/db"; // เชื่อมต่อ MongoDB
// import Activity from "./models/Activity"; // โมเดล Activity

// // เชื่อมต่อฐานข้อมูล
// connectToDatabase();

// const app = express();
// const server = http.createServer(app); // สร้าง HTTP Server
// const wss = new WebSocketServer({ server }); // สร้าง WebSocket Server

// // อัปเดตสถานะกิจกรรมที่ถึงเวลาปิดทุกนาที
// cron.schedule("* * * * *", async () => {
//   const now = new Date();
//   try {
//     // ค้นหากิจกรรมที่ถึงเวลาปิดและยังคงเปิดอยู่
//     const result = await Activity.updateMany(
//       { closeTime: { $lte: now }, status: "open" },
//       { $set: { status: "closed" } }
//     );
//     console.log(`Updated ${result.modifiedCount} activities to closed.`);
//   } catch (error) {
//     console.error("Error updating activities:", error);
//   }
// });

// // เก็บข้อมูลผู้ใช้ออนไลน์
// const onlineUsers = new Set<string>();

// // WebSocket Server: จัดการการเชื่อมต่อ
// wss.on("connection", (ws: WebSocket) => {
//   console.log("Client connected");

//   // รับข้อความจากไคลเอนต์
//   ws.on("message", (message: string) => {
//     try {
//       const data = JSON.parse(message);
//       if (data.action === "online" && data.userId) {
//         onlineUsers.add(data.userId);
//         console.log(`User ${data.userId} is online`);
//         broadcastOnlineCount();
//       } else if (data.action === "offline" && data.userId) {
//         onlineUsers.delete(data.userId);
//         console.log(`User ${data.userId} is offline`);
//         broadcastOnlineCount();
//       }
//     } catch (error) {
//       console.error("Error processing message:", error);
//     }
//   });

//   // เมื่อไคลเอนต์ตัดการเชื่อมต่อ
//   ws.on("close", () => {
//     console.log("Client disconnected");
//   });
// });

// // ฟังก์ชันส่งจำนวนผู้ใช้ออนไลน์ไปยังไคลเอนต์ทั้งหมด
// function broadcastOnlineCount() {
//   const onlineCount = onlineUsers.size;
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify({ onlineCount }));
//     }
//   });
// }

// // เริ่มเซิร์ฟเวอร์
// const PORT = process.env.PORT || 8080;
// const HOST = process.env.HOSTNAME || "localhost";

// const PORT = process.env.PORT || 8080;
// server.listen(PORT, "0.0.0.0", () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
//   console.log(`WebSocket Server is running on ws://localhost:${PORT}`);
// });