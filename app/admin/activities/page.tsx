"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { th } from "date-fns/locale";
import { Pencil, Trash2, Eye, Download, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

interface Activity {
  _id: string;
  title: string;
  registerStart: string;
  registerEnd: string;
  activityStart: string;
  activityEnd: string;
  location: string;
  maxParticipants: number;
  status: string;
  participants: Participant[];
  newsId?: string;
}

interface Participant {
  fullName: string;
  studentId: string;
  year: string;
  phone: string;
  department?: string;
  program?: string;
  checkedIn?: boolean;
  checkInDate?: string;
}

interface News {
  _id: string;
  title: string;
  image: string;
}

export default function AdminActivities() {
  const { theme } = useTheme();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchActivities();
    fetchNews();
  }, []);

  async function fetchActivities() {
    try {
      const res = await fetch("/api/activities");
      if (!res.ok) throw new Error("Failed to fetch activities");
      const data: Activity[] = await res.json();
      setActivities(data);
    } catch (error) {
      console.error("Fetch activities error:", error);
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลกิจกรรมได้",
        icon: "error",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
    }
  }

  async function fetchNews() {
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      const data: News[] = await res.json();
      setNewsList(data);
    } catch (error) {
      console.error("Fetch news error:", error);
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถโหลดข้อมูลข่าวสารได้",
        icon: "error",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
    }
  }

  async function handleCreateOrEditActivity() {
    if (isLoading) return;

    // ตรวจสอบฟิลด์ที่จำเป็นก่อนส่ง
    const missingFields: string[] = [];
    if (!formData.title?.trim()) missingFields.push("ชื่อกิจกรรม");
    if (!formData.registerStart) missingFields.push("วันเปิดลงทะเบียน");
    if (!formData.registerEnd) missingFields.push("วันปิดลงทะเบียน");
    if (!formData.activityStart) missingFields.push("เวลาเริ่มกิจกรรม");
    if (!formData.activityEnd) missingFields.push("เวลาสิ้นสุดกิจกรรม");
    if (!formData.location?.trim()) missingFields.push("สถานที่จัดกิจกรรม");
    if (!formData.maxParticipants || formData.maxParticipants < 1) missingFields.push("จำนวนผู้เข้าร่วมสูงสุด");

    if (missingFields.length > 0) {
      Swal.fire({
        title: "กรุณากรอกข้อมูลให้ครบ",
        html: `<p style="text-align:left; font-size:13px; color:#d1d5db;">ฟิลด์ที่ยังไม่ได้กรอก:</p><ul style="text-align:left; font-size:13px; color:#f97316; margin-top:8px;">${missingFields.map(f => `<li>• ${f}</li>`).join("")}</ul>`,
        icon: "warning",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
      return;
    }

    setIsLoading(true);
    Swal.fire({
      title: "กำลังบันทึก...",
      html: '<div class="loader mx-auto"></div>',
      allowOutsideClick: false,
      showConfirmButton: false,
      background: "#0c0c0e",
      color: "#ffffff"
    });

    const now = new Date();
    const datesToCheck = [
      { name: "วันเปิดลงทะเบียน", date: formData.registerStart },
      { name: "วันปิดลงทะเบียน", date: formData.registerEnd },
      { name: "เวลาเริ่มกิจกรรม", date: formData.activityStart },
      { name: "เวลาสิ้นสุดกิจกรรม", date: formData.activityEnd },
    ];

    // ตรวจสอบวันที่ในอดีต
    for (const { name, date } of datesToCheck) {
      if (date && new Date(date) < now) {
        setIsLoading(false);
        Swal.close();
        setOpenDialog(false);
        setTimeout(() => {
          Swal.fire({
            title: "ข้อผิดพลาด",
            text: `${name} ไม่สามารถเป็นวันที่ในอดีตได้`,
            icon: "error",
            confirmButtonColor: "#f97316",
            background: "#0c0c0e",
            color: "#ffffff"
          });
        }, 200);
        return;
      }
    }

    // ตรวจสอบวันที่สมเหตุสมผล
    if (formData.registerEnd && formData.registerStart && new Date(formData.registerEnd) < new Date(formData.registerStart)) {
      setIsLoading(false);
      Swal.close();
      setOpenDialog(false);
      setTimeout(() => {
        Swal.fire({
          title: "ข้อผิดพลาด",
          text: "วันปิดลงทะเบียนต้องอยู่หลังวันเปิดลงทะเบียน",
          icon: "error",
          confirmButtonColor: "#f97316",
          background: "#0c0c0e",
          color: "#ffffff"
        });
      }, 200);
      return;
    }

    if (formData.activityEnd && formData.activityStart && new Date(formData.activityEnd) < new Date(formData.activityStart)) {
      setIsLoading(false);
      Swal.close();
      setOpenDialog(false);
      setTimeout(() => {
        Swal.fire({
          title: "ข้อผิดพลาด",
          text: "เวลาสิ้นสุดกิจกรรมต้องอยู่หลังเวลาเริ่มกิจกรรม",
          icon: "error",
          confirmButtonColor: "#f97316",
          background: "#0c0c0e",
          color: "#ffffff"
        });
      }, 200);
      return;
    }

    const method = editId ? "PUT" : "POST";
    const url = "/api/activities";
    const payload = editId
      ? { id: editId, updates: formData }
      : { ...formData, status: formData.status || "open" };
    console.log("Submitting activity payload:", payload);
    const body = JSON.stringify(payload);

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      setIsLoading(false);
      Swal.close();
      if (res.ok) {
        setOpenDialog(false);
        setTimeout(() => {
          Swal.fire({
            title: "สำเร็จ",
            text: editId ? "แก้ไขกิจกรรมเรียบร้อย" : "สร้างกิจกรรมเรียบร้อย",
            icon: "success",
            confirmButtonColor: "#f97316",
            background: "#0c0c0e",
            color: "#ffffff"
          });
        }, 200);
        fetchActivities();
        setEditId(null);
      } else {
        const errorData = await res.json();
        setOpenDialog(false);
        setTimeout(() => {
          Swal.fire({
            title: "ข้อผิดพลาด",
            text: errorData.message || "ไม่สามารถดำเนินการได้",
            icon: "error",
            confirmButtonColor: "#f97316",
            background: "#0c0c0e",
            color: "#ffffff"
          });
        }, 200);
      }
    } catch (error) {
      console.error("API error:", error);
      setIsLoading(false);
      Swal.close();
      setOpenDialog(false);
      setTimeout(() => {
        Swal.fire({
          title: "ข้อผิดพลาด",
          text: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์",
          icon: "error",
          confirmButtonColor: "#f97316",
          background: "#0c0c0e",
          color: "#ffffff"
        });
      }, 200);
    }
  }

  async function deleteActivity(id: string) {
    const confirm = await Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณต้องการลบกิจกรรมนี้หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3f3f46",
      background: "#0c0c0e",
      color: "#ffffff",
      customClass: { popup: "swal2-high-zindex" },
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/activities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        Swal.fire({
          title: "ลบสำเร็จ",
          text: "กิจกรรมถูกลบเรียบร้อย",
          icon: "success",
          confirmButtonColor: "#f97316",
          background: "#0c0c0e",
          color: "#ffffff"
        });
        fetchActivities();
      } else {
        throw new Error();
      }
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire({
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถลบกิจกรรมได้",
        icon: "error",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
    }
  }

  function showParticipants(participants: Participant[]) {
    if (participants.length === 0) {
      Swal.fire({
        title: "ไม่มีผู้ลงทะเบียน",
        text: "ยังไม่มีผู้ลงทะเบียนในกิจกรรมนี้",
        icon: "info",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
      return;
    }
    const text = participants
      .map(
        (p, i) =>
          `${i + 1}. ${p.fullName} (${p.studentId}) ชั้นปี/กลุ่ม: ${p.year} เบอร์: ${p.phone} สาขา: ${p.department || "-"} [${p.checkedIn ? "เช็คอินแล้ว" : "ยังไม่เช็คอิน"}]`
      )
      .join("\n");
    Swal.fire({
      title: "รายชื่อผู้ลงทะเบียน",
      text,
      icon: "info",
      confirmButtonColor: "#f97316",
      background: "#0c0c0e",
      color: "#ffffff",
      customClass: { popup: "text-left whitespace-pre-line font-light" },
    });
  }

  function downloadParticipants(participants: Participant[], activity: Activity) {
    if (participants.length === 0) {
      Swal.fire({
        title: "ไม่มีผู้ลงทะเบียน",
        text: "ยังไม่มีผู้ลงทะเบียนในกิจกรรมนี้",
        icon: "info",
        confirmButtonColor: "#f97316",
        background: "#0c0c0e",
        color: "#ffffff"
      });
      return;
    }
    const csv =
      "ลำดับ,ชื่อ-นามสกุล,รหัสนักศึกษา,ชั้นปี/กลุ่มเรียน,เบอร์โทร,สาขา,สถานะเช็คอิน\n" +
      participants
        .map(
          (p, i) =>
            `${i + 1},${p.fullName},${p.studentId},${p.year},${p.phone},${p.department || "-"},${p.checkedIn ? "เช็คอินแล้ว" : "ยังไม่เช็คอิน"}`
        )
        .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activity.title}_รายชื่อ.csv`.replace(/\s+/g, "_");
    link.click();
  }

  function openCreateDialog() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    setFormData({
      title: "",
      newsId: "",
      registerStart: today,
      registerEnd: tomorrow,
      activityStart: nextWeek,
      activityEnd: nextWeek,
      location: "",
      maxParticipants: 1,
      status: "open",
    });
    setEditId(null);
    setOpenDialog(true);
  }

  function openEditDialog(activity: Activity) {
    setFormData({
      title: activity.title,
      newsId: activity.newsId || "",
      registerStart: new Date(activity.registerStart),
      registerEnd: new Date(activity.registerEnd),
      activityStart: new Date(activity.activityStart),
      activityEnd: new Date(activity.activityEnd),
      location: activity.location,
      maxParticipants: activity.maxParticipants,
      status: activity.status,
    });
    setEditId(activity._id);
    setOpenDialog(true);
  }

  // MUI input styles helper
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: theme === "dark" ? "#ffffff" : "#111827",
      backgroundColor: theme === "dark" ? "rgba(255, 255, 255, 0.01)" : "rgba(0, 0, 0, 0.02)",
      borderRadius: "14px",
      "& fieldset": { borderColor: theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)" },
      "&:hover fieldset": { borderColor: theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.2)" },
      "&.Mui-focused fieldset": { borderColor: "#f97316" }
    },
    "& .MuiInputLabel-root": { color: theme === "dark" ? "#9ca3af" : "#4b5563" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#f97316" },
    "& .MuiFormHelperText-root": { color: theme === "dark" ? "#6b7280" : "#9ca3af" }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] text-gray-900 dark:text-white px-4 py-12 md:py-20 font-sarabun transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* หัวข้อ */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 select-none">
          <div className="space-y-2">
            <h2 className="text-[10px] tracking-[0.25em] font-light text-orange-500 uppercase">
              ACTIVITY CONFIGURATION
            </h2>
            <h1 className="text-2xl font-light text-gray-808 dark:text-gray-200 tracking-wide">
              จัดการและสร้างกิจกรรมนักศึกษา
            </h1>
          </div>
          <button
            onClick={openCreateDialog}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-black text-xs font-medium tracking-wider rounded-xl shadow-[0_5px_15px_rgba(249,115,22,0.15)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition duration-300"
          >
            <Plus className="h-4 w-4" />
            <span>เพิ่มกิจกรรมใหม่</span>
          </button>
        </div>

        {/* ตารางข้อมูล */}
        <div className="bg-white dark:bg-white/[0.01] border border-gray-200 dark:border-white/[0.04] backdrop-blur-xl rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/[0.04] select-none">
                  <th className="p-4 pl-6 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase">ชื่อกิจกรรม</th>
                  <th className="p-4 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase">เปิดลงทะเบียน</th>
                  <th className="p-4 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase">ปิดลงทะเบียน</th>
                  <th className="p-4 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase">เริ่มกิจกรรม</th>
                  <th className="p-4 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase">สถานที่</th>
                  <th className="p-4 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase">สถานะ</th>
                  <th className="p-4 pr-6 text-[10px] tracking-[0.2em] font-light text-orange-500 uppercase text-center">การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {activities.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-gray-650 dark:text-gray-500 font-light text-sm">
                        ไม่มีข้อมูลกิจกรรมในขณะนี้
                      </td>
                    </tr>
                  ) : (
                    activities.map((a, idx) => (
                      <motion.tr
                        key={a._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.03 }}
                        className="border-b border-gray-100 dark:border-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.01] transition duration-300"
                      >
                        <td className="p-4 pl-6 text-sm font-light text-gray-800 dark:text-gray-200">{a.title}</td>
                        <td className="p-4 text-xs font-light text-gray-600 dark:text-gray-400">
                          {new Date(a.registerStart).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })} น.
                        </td>
                        <td className="p-4 text-xs font-light text-gray-600 dark:text-gray-400">
                          {new Date(a.registerEnd).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })} น.
                        </td>
                        <td className="p-4 text-xs font-light text-gray-600 dark:text-gray-400">
                          {new Date(a.activityStart).toLocaleString("th-TH", { dateStyle: "short", timeStyle: "short" })} น.
                        </td>
                        <td className="p-4 text-xs font-light text-gray-600 dark:text-gray-400 truncate max-w-[120px]">{a.location}</td>
                        <td className="p-4">
                          <span
                            className={`text-[9px] tracking-wider px-2.5 py-1 rounded-lg border font-light ${
                              a.status === "open"
                                ? "bg-green-500/5 border-green-500/20 text-green-400"
                                : "bg-red-500/5 border-red-500/20 text-red-400"
                            }`}
                          >
                            {a.status === "open" ? "OPEN" : "CLOSED"}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditDialog(a)}
                              title="แก้ไข"
                              className="p-2 border border-gray-200 dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-xl text-gray-550 dark:text-gray-400 hover:text-black hover:dark:text-white transition duration-300"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteActivity(a._id)}
                              title="ลบ"
                              className="p-2 border border-red-200 dark:border-red-500/10 hover:bg-red-500/10 rounded-xl text-gray-550 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition duration-300"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => showParticipants(a.participants)}
                              title="ดูรายชื่อผู้ลงทะเบียน"
                              className="p-2 border border-gray-200 dark:border-white/[0.08] hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-xl text-gray-550 dark:text-gray-400 hover:text-black hover:dark:text-white transition duration-300"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => downloadParticipants(a.participants, a)}
                              className="px-3 py-1.5 bg-gray-50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] hover:bg-gray-100 dark:hover:bg-white/[0.04] text-[10px] font-light tracking-wider rounded-xl text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition duration-300 flex items-center gap-1 shadow-sm dark:shadow-none"
                            >
                              <Download className="h-3 w-3 text-orange-500/80" />
                              <span>CSV</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Dialog (MUI) */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          fullWidth 
          maxWidth="sm"
          PaperProps={{
            style: {
              backgroundColor: theme === "dark" ? "#0c0c0e" : "#ffffff",
              border: theme === "dark" ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
              borderRadius: "24px",
              padding: "16px",
              color: theme === "dark" ? "#ffffff" : "#111827"
            }
          }}
        >
          <DialogTitle style={{ color: theme === "dark" ? "#ffffff" : "#111827", fontWeight: "300", letterSpacing: "0.05em" }} className="border-b border-gray-200 dark:border-white/[0.04] pb-4">
            {editId ? "แก้ไขรายละเอียดกิจกรรม" : "สร้างกิจกรรมผู้เข้าร่วมใหม่"}
          </DialogTitle>
          <DialogContent className="pt-6">
            <div className="space-y-6 mt-4">
              <div>
                <TextField
                  label="ชื่อกิจกรรม"
                  fullWidth
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  variant="outlined"
                  sx={inputSx}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined" sx={inputSx}>
                  <InputLabel>เลือกข่าวสารที่เกี่ยวข้อง (ถ้ามี)</InputLabel>
                  <Select
                    value={formData.newsId || ""}
                    onChange={(e) => setFormData({ ...formData, newsId: e.target.value })}
                    label="เลือกข่าวสารที่เกี่ยวข้อง (ถ้ามี)"
                  >
                    <MenuItem value="">— ไม่เลือก —</MenuItem>
                    {newsList.map((n) => (
                      <MenuItem key={n._id} value={n._id}>
                        {n.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DateTimePicker
                    label="วันเปิดลงทะเบียน"
                    value={formData.registerStart ? new Date(formData.registerStart) : null}
                    onChange={(value) => setFormData({ ...formData, registerStart: value })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        sx: inputSx
                      },
                    }}
                    format="dd/MM/yyyy HH:mm"
                  />
                  <DateTimePicker
                    label="วันปิดลงทะเบียน"
                    value={formData.registerEnd ? new Date(formData.registerEnd) : null}
                    onChange={(value) => setFormData({ ...formData, registerEnd: value })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        sx: inputSx
                      },
                    }}
                    format="dd/MM/yyyy HH:mm"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DateTimePicker
                    label="เวลาเริ่มกิจกรรม"
                    value={formData.activityStart ? new Date(formData.activityStart) : null}
                    onChange={(value) => setFormData({ ...formData, activityStart: value })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        sx: inputSx
                      },
                    }}
                    format="dd/MM/yyyy HH:mm"
                  />
                  <DateTimePicker
                    label="เวลาสิ้นสุดกิจกรรม"
                    value={formData.activityEnd ? new Date(formData.activityEnd) : null}
                    onChange={(value) => setFormData({ ...formData, activityEnd: value })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        sx: inputSx
                      },
                    }}
                    format="dd/MM/yyyy HH:mm"
                  />
                </div>
              </LocalizationProvider>

              <div>
                <TextField
                  label="สถานที่จัดกิจกรรม"
                  fullWidth
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  variant="outlined"
                  sx={inputSx}
                />
              </div>

              <div>
                <TextField
                  label="จำนวนผู้เข้าร่วมสูงสุด (คน)"
                  type="number"
                  fullWidth
                  value={formData.maxParticipants || 1}
                  onChange={(e) =>
                    setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })
                  }
                  variant="outlined"
                  sx={inputSx}
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined" sx={inputSx}>
                  <InputLabel>สถานะการลงทะเบียน</InputLabel>
                  <Select
                    value={formData.status || "open"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    label="สถานะการลงทะเบียน"
                  >
                    <MenuItem value="open">เปิดลงทะเบียน</MenuItem>
                    <MenuItem value="closed">ปิดลงทะเบียน</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="pt-4 border-t border-gray-200 dark:border-white/[0.04]">
            <Button
              onClick={() => setOpenDialog(false)}
              style={{ color: theme === "dark" ? "#a1a1aa" : "#4b5563", textTransform: "none", fontSize: "12px", letterSpacing: "0.05em" }}
            >
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateOrEditActivity}
              disabled={isLoading}
              style={{ 
                backgroundColor: "#f97316", 
                color: "#000000", 
                borderRadius: "12px", 
                textTransform: "none", 
                fontSize: "12px", 
                letterSpacing: "0.05em",
                fontWeight: "500" 
              }}
            >
              บันทึกการอัปเดต
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}