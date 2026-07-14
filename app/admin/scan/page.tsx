"use client";

import { useEffect, useState, useRef } from "react";
import Swal from "sweetalert2";
import { Html5Qrcode } from "html5-qrcode";
import { 
  Camera, 
  RefreshCw, 
  QrCode
} from "lucide-react";
import { motion } from "framer-motion";

interface Activity {
  _id: string;
  title: string;
  location: string;
}

export default function AdminScanPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivityId, setSelectedActivityId] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  
  const qrReaderRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "qr-reader-viewport";

  useEffect(() => {
    // โหลดกิจกรรมทั้งหมด
    fetch("/api/activities")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setActivities(data);
          if (data.length > 0) {
            setSelectedActivityId(data[0]._id);
          }
        }
      })
      .catch((err) => console.error("Error loading activities:", err));
  }, []);

  const startScanner = async () => {
    if (!selectedActivityId) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเลือกกิจกรรม",
        text: "เลือกกิจกรรมที่ต้องการสแกนก่อนเปิดกล้อง",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
      return;
    }

    setScanning(true);

    try {
      const html5QrCode = new Html5Qrcode(scannerId);
      qrReaderRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // สแกนเจอคิวอาร์โค้ดสำเร็จ
          console.log("Scanned:", decodedText);
          
          // ปิดสแกนชั่วคราวขณะโหลดผลลัพธ์
          html5QrCode.pause();

          Swal.fire({
            title: "กำลังตรวจสอบ...",
            allowOutsideClick: false,
            showConfirmButton: false,
            background: "#0c0c0e",
            color: "#ffffff",
            didOpen: () => {
              Swal.showLoading();
            }
          });

          try {
            const res = await fetch("/api/admin/activities/checkin", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                activityId: selectedActivityId,
                email: decodedText
              })
            });
            const result = await res.json();

            Swal.close();

            if (res.ok && result.success) {
              await Swal.fire({
                icon: "success",
                title: "เช็คอินสำเร็จ!",
                text: result.message,
                confirmButtonColor: "#f97316",
                background: "#0c0c0e",
                color: "#ffffff"
              });
            } else {
              await Swal.fire({
                icon: "error",
                title: "เช็คอินไม่สำเร็จ",
                text: result.message || "เกิดข้อผิดพลาดในการตรวจสอบ",
                confirmButtonColor: "#f97316",
                background: "#0c0c0e",
                color: "#ffffff"
              });
            }
          } catch {
            await Swal.fire({
              icon: "error",
              title: "ข้อผิดพลาด",
              text: "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้",
              confirmButtonColor: "#f97316",
              background: "#0c0c0e",
              color: "#ffffff"
            });
          } finally {
            // ทำการสแกนต่อหลังจากปิด Alert
            if (qrReaderRef.current) {
              try {
                html5QrCode.resume();
              } catch (e) {
                console.error("Resume scanner error:", e);
              }
            }
          }
        },
        (errorMessage) => {
          // ข้อผิดพลาดในการอ่านเฟรม (ละเว้นได้เพื่อป้องกัน log สแปม)
        }
      );
      setCameraPermission(true);
    } catch (err) {
      console.error("Camera error:", err);
      setScanning(false);
      setCameraPermission(false);
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเข้าถึงกล้องได้",
        text: "กรุณาเปิดสิทธิ์การใช้งานกล้องในเบราว์เซอร์ของคุณ",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
    }
  };

  const stopScanner = async () => {
    if (qrReaderRef.current) {
      try {
        await qrReaderRef.current.stop();
      } catch (err) {
        console.error("Stop scanner error:", err);
      }
      qrReaderRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => {
      if (qrReaderRef.current) {
        qrReaderRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#080808] text-white px-4 py-12 md:py-20 font-sarabun">
      <div className="max-w-xl mx-auto space-y-8">
        
        {/* หัวข้อ */}
        <div className="space-y-2 select-none text-center">
          <h2 className="text-[10px] tracking-[0.25em] font-light text-orange-500 uppercase">
            QR CODE ATTENDANCE CHECK-IN
          </h2>
          <h1 className="text-2xl font-light text-gray-200 tracking-wide">
            สแกนคิวอาร์โค้ดเช็คชื่อ
          </h1>
        </div>

        {/* ฟอร์มเลือกกิจกรรม */}
        <div className="bg-white/[0.02] border border-white/[0.04] p-6 rounded-3xl backdrop-blur-xl shadow-lg space-y-4">
          <div>
            <label className="block text-[10px] tracking-wider text-gray-500 uppercase mb-2">กิจกรรมที่ต้องการเช็คชื่อ</label>
            <select
              value={selectedActivityId}
              onChange={(e) => {
                setSelectedActivityId(e.target.value);
                if (scanning) {
                  stopScanner();
                }
              }}
              className="w-full bg-[#0f0f10] border border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-white rounded-2xl p-3.5 focus:outline-none transition duration-300 cursor-pointer"
            >
              {activities.length === 0 ? (
                <option value="">— ไม่มีกิจกรรมในระบบขณะนี้ —</option>
              ) : (
                activities.map((a) => (
                  <option key={a._id} value={a._id} className="bg-[#0f0f10]">
                    {a.title} ({a.location})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex justify-center pt-2">
            {!scanning ? (
              <button
                onClick={startScanner}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-black text-xs font-medium tracking-widest rounded-2xl shadow-[0_5px_15px_rgba(249,115,22,0.15)] transition duration-300"
              >
                <Camera className="h-4 w-4" />
                <span>เปิดกล้องสแกนคิวอาร์โค้ด</span>
              </button>
            ) : (
              <button
                onClick={stopScanner}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-white text-xs font-light tracking-widest rounded-2xl transition duration-300"
              >
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>ปิดกล้องสแกน</span>
              </button>
            )}
          </div>
        </div>

        {/* Viewport สแกนกล้อง */}
        <div className="relative aspect-square w-full max-w-sm mx-auto bg-black/60 rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
          <div id={scannerId} className="w-full h-full object-cover" />

          {/* สัญลักษณ์ Scan Line เมื่อเปิดสแกน */}
          {scanning && (
            <>
              {/* แถบสแกนสีส้มเลื่อนลง */}
              <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent top-0 animate-scanner-line pointer-events-none" />
              
              {/* มุมกล่องสีส้มครอบสแกน */}
              <div className="absolute inset-0 border-[30px] border-black/40 pointer-events-none flex items-center justify-center">
                <div className="w-[180px] h-[180px] border-2 border-dashed border-orange-500/30 rounded-2xl relative">
                  {/* มุมซ้ายบน */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-orange-500 rounded-tl-md" />
                  {/* มุมขวาบน */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-orange-500 rounded-tr-md" />
                  {/* มุมซ้ายล่าง */}
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-orange-500 rounded-bl-md" />
                  {/* มุมขวาล่าง */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-orange-500 rounded-br-md" />
                </div>
              </div>
            </>
          )}

          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none space-y-3 bg-[#0d0d0e]">
              <QrCode className="h-12 w-12 text-gray-600" />
              <p className="text-xs font-light text-gray-500 uppercase tracking-widest">CAMERA VIEWPORT CLOSE</p>
              <p className="text-[10px] font-light text-orange-500/60 uppercase">กดเปิดกล้องเพื่อเริ่มต้นสแกนเช็คอิน</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
