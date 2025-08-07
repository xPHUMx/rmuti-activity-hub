
// "use client";

// import { useEffect, useState } from "react";
// import { PencilIcon, TrashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
// import Swal from "sweetalert2";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
// } from "@mui/material";
// import { LocalizationProvider } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

// interface Activity {
//   _id: string;
//   title: string;
//   registerStart: string;
//   registerEnd: string;
//   activityStart: string;
//   activityEnd: string;
//   location: string;
//   maxParticipants: number;
//   status: string;
//   participants: Participant[];
//   newsId?: string;
// }

// interface Participant {
//   fullName: string;
//   studentId: string;
//   year: string;
//   phone: string;
//   department?: string;
//   program?: string;
// }

// interface News {
//   _id: string;
//   title: string;
//   image: string;
// }

// export default function AdminActivities() {
//   const [activities, setActivities] = useState<Activity[]>([]);
//   const [editId, setEditId] = useState<string | null>(null);
//   const [openDialog, setOpenDialog] = useState(false);
//   const [formData, setFormData] = useState<any>({});
//   const [newsList, setNewsList] = useState<News[]>([]);

//   useEffect(() => {
//     fetchActivities();
//     fetchNews();
//   }, []);

//   async function fetchActivities() {
//     try {
//       const res = await fetch("/api/activities");
//       if (!res.ok) throw new Error("Failed to fetch activities");
//       const data: Activity[] = await res.json();
//       setActivities(data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async function fetchNews() {
//     try {
//       const res = await fetch("/api/news");
//       if (!res.ok) throw new Error("Failed to fetch news");
//       const data: News[] = await res.json();
//       setNewsList(data);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async function handleCreateOrEditActivity() {
//     const method = editId ? "PUT" : "POST";
//     const url = "/api/activities";
//     const body = JSON.stringify(editId ? { id: editId, updates: formData } : formData);

//     try {
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body,
//       });
//       if (res.ok) {
//         Swal.fire("Success", editId ? "แก้ไขกิจกรรมแล้ว" : "สร้างกิจกรรมแล้ว", "success");
//         fetchActivities();
//         setOpenDialog(false);
//         setEditId(null);
//       } else {
//         const errorData = await res.json();
//         Swal.fire("Error", errorData.message || "Operation failed", "error");
//       }
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "Server error", "error");
//     }
//   }

//   async function deleteActivity(id: string) {
//     const confirm = await Swal.fire({ title: "ยืนยันลบกิจกรรม", icon: "warning", showCancelButton: true });
//     if (!confirm.isConfirmed) return;

//     try {
//       const res = await fetch("/api/activities", {
//         method: "DELETE",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ id }),
//       });
//       if (res.ok) {
//         Swal.fire("Deleted", "ลบกิจกรรมแล้ว", "success");
//         fetchActivities();
//       } else {
//         Swal.fire("Error", "ลบไม่สำเร็จ", "error");
//       }
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "Server error", "error");
//     }
//   }

//   function showParticipants(participants: Participant[]) {
//     if (participants.length === 0) {
//       Swal.fire("ไม่มีผู้ลงทะเบียน", "", "info");
//       return;
//     }
//     const text = participants.map((p, i) => `${i + 1}. ${p.fullName} (${p.studentId}) ปี${p.year} เบอร์: ${p.phone} สาขา: ${p.department || "-"} ภาค: ${p.program || "-"}`).join("\n");
//     Swal.fire({ title: "รายชื่อผู้ลงทะเบียน", text, icon: "info", customClass: { popup: "text-left" } });
//   }

//   function downloadParticipants(participants: Participant[], activity: Activity) {
//     if (participants.length === 0) {
//       Swal.fire("ไม่มีผู้ลงทะเบียน", "", "info");
//       return;
//     }
//     const csv = "ลำดับ,ชื่อ,รหัส,ปี,เบอร์โทร,สาขา,ภาค\n" +
//       participants.map((p, i) => `${i + 1},${p.fullName},${p.studentId},${p.year},${p.phone},${p.department || "-"},${p.program || "-"}`).join("\n");
//     const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = `${activity.title}_รายชื่อ.csv`.replace(/\s+/g, "_");
//     link.click();
//   }

//   function openCreateDialog() {
//     setFormData({
//       title: "",
//       newsId: "",
//       registerStart: new Date(),
//       registerEnd: new Date(),
//       activityStart: new Date(),
//       activityEnd: new Date(),
//       location: "",
//       maxParticipants: 1,
//       status: "open",
//     });
//     setEditId(null);
//     setOpenDialog(true);
//   }

//   function openEditDialog(activity: Activity) {
//     setFormData({
//       title: activity.title,
//       newsId: activity.newsId || "",
//       registerStart: new Date(activity.registerStart || activity.registerStart),
//       registerEnd: new Date(activity.registerEnd || activity.registerEnd),
//       activityStart: new Date(activity.activityStart || activity.activityStart),
//       activityEnd: new Date(activity.activityEnd || activity.activityEnd),
//       location: activity.location,
//       maxParticipants: activity.maxParticipants,
//       status: activity.status,
//     });
//     setEditId(activity._id);
//     setOpenDialog(true);
//   }

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-8">
//       <div className="flex justify-between mb-6">
//         <h1 className="text-2xl font-bold">จัดการกิจกรรม</h1>
//         <button onClick={openCreateDialog} className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">เพิ่มกิจกรรม</button>
//       </div>

//       <table className="w-full bg-gray-800 rounded">
//         <thead>
//           <tr className="bg-gray-700">
//             <th className="p-2">ชื่อกิจกรรม</th>
//             <th>เปิดลงทะเบียน</th>
//             <th>ปิดลงทะเบียน</th>
//             <th>เริ่มกิจกรรม</th>
//             <th>สิ้นสุดกิจกรรม</th>
//             <th>สถานที่</th>
//             <th>สถานะ</th>
//             <th>การจัดการ</th>
//           </tr>
//         </thead>
//         <tbody>
//           {activities.map((a) => (
//             <tr key={a._id} className="border-t border-gray-700 hover:bg-gray-600">
//               <td className="text-center p-2">{a.title}</td>
//               <td className="text-center">{new Date(a.registerStart).toLocaleString()}</td>
//               <td className="text-center">{new Date(a.registerEnd).toLocaleString()}</td>
//               <td className="text-center">{new Date(a.activityStart).toLocaleString()}</td>
//               <td className="text-center">{new Date(a.activityEnd).toLocaleString()}</td>
//               <td className="text-center">{a.location}</td>
//               <td className="text-center">
//                 <span className={`px-2 py-1 rounded-full ${a.status === "open" ? "bg-green-500" : "bg-red-500"}`}>{a.status === "open" ? "เปิด" : "ปิด"}</span>
//               </td>
//               <td className="flex justify-center gap-2 p-2">
//                 <button onClick={() => openEditDialog(a)}><PencilIcon className="w-5 h-5 text-blue-400 hover:text-blue-600" /></button>
//                 <button onClick={() => deleteActivity(a._id)}><TrashIcon className="w-5 h-5 text-red-400 hover:text-red-600" /></button>
//                 <button onClick={() => showParticipants(a.participants)}><CheckCircleIcon className="w-5 h-5 text-green-400 hover:text-green-600" /></button>
//                 <button onClick={() => downloadParticipants(a.participants, a)}>ดาวน์โหลด</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
//         <DialogTitle>{editId ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}</DialogTitle>
//         <DialogContent>
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
//     {/* ชื่อกิจกรรม */}
//     <TextField
//       label="ชื่อกิจกรรม"
//       fullWidth
//       value={formData.title}
//       onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//     />

//     {/* ข่าวสาร */}
//     <FormControl fullWidth>
//       <InputLabel>เลือกข่าวสาร</InputLabel>
//       <Select
//         value={formData.newsId}
//         onChange={(e) => setFormData({ ...formData, newsId: e.target.value })}
//       >
//         <MenuItem value="">— ไม่เลือก —</MenuItem>
//         {newsList.map((n) => (
//           <MenuItem key={n._id} value={n._id}>
//             <img src={n.image} alt={n.title} className="w-8 h-8 inline mr-2 rounded" />
//             {n.title}
//           </MenuItem>
//         ))}
//       </Select>
//     </FormControl>

//     {/* เวลา */}
//   <LocalizationProvider dateAdapter={AdapterDateFns}>
//   <DateTimePicker
//     label="เปิดลงทะเบียน"
//     value={formData.registerStart}
//     onChange={(value) => setFormData({ ...formData, registerStart: value })}
//     slotProps={{ textField: { fullWidth: true } }}
//   />
//   <DateTimePicker
//     label="ปิดลงทะเบียน"
//     value={formData.registerEnd}
//     onChange={(value) => setFormData({ ...formData, registerEnd: value })}
//     slotProps={{ textField: { fullWidth: true } }}
//   />
//   <DateTimePicker
//     label="เริ่มกิจกรรม"
//     value={formData.activityStart}
//     onChange={(value) => setFormData({ ...formData, activityStart: value })}
//     slotProps={{ textField: { fullWidth: true } }}
//   />
//   <DateTimePicker
//     label="สิ้นสุดกิจกรรม"
//     value={formData.activityEnd}
//     onChange={(value) => setFormData({ ...formData, activityEnd: value })}
//     slotProps={{ textField: { fullWidth: true } }}
//   />
// </LocalizationProvider>


//     {/* สถานที่ */}
//     <TextField
//       label="สถานที่จัดกิจกรรม"
//       fullWidth
//       value={formData.location}
//       onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//     />

//     {/* จำนวน */}
//     <TextField
//       label="จำนวนผู้เข้าร่วมสูงสุด"
//       type="number"
//       fullWidth
//       value={formData.maxParticipants}
//       onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
//     />

//     {/* สถานะ */}
//     <FormControl fullWidth>
//       <InputLabel>สถานะ</InputLabel>
//       <Select
//         value={formData.status}
//         onChange={(e) => setFormData({ ...formData, status: e.target.value })}
//       >
//         <MenuItem value="open">เปิดลงทะเบียน</MenuItem>
//         <MenuItem value="closed">ปิดลงทะเบียน</MenuItem>
//       </Select>
//     </FormControl>
//   </div>
// </DialogContent>

//         <DialogActions>
//           <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
//           <Button variant="contained" onClick={handleCreateOrEditActivity}>บันทึก</Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { PencilIcon, TrashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
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
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { th } from "date-fns/locale";

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
}

interface News {
  _id: string;
  title: string;
  image: string;
}

export default function AdminActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [newsList, setNewsList] = useState<News[]>([]);

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
      console.error(error);
    }
  }

  async function fetchNews() {
    try {
      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("Failed to fetch news");
      const data: News[] = await res.json();
      setNewsList(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleCreateOrEditActivity() {
    const method = editId ? "PUT" : "POST";
    const url = "/api/activities";
    const body = JSON.stringify(
      editId
        ? { id: editId, updates: formData }
        : { ...formData, status: formData.status || "open" }
    );

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (res.ok) {
        Swal.fire("สำเร็จ", editId ? "แก้ไขกิจกรรมเรียบร้อย" : "สร้างกิจกรรมเรียบร้อย", "success");
        fetchActivities();
        setOpenDialog(false);
        setEditId(null);
      } else {
        const errorData = await res.json();
        Swal.fire("ข้อผิดพลาด", errorData.message || "ไม่สามารถดำเนินการได้", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("ข้อผิดพลาด", "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์", "error");
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
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/activities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        Swal.fire("ลบสำเร็จ", "กิจกรรมถูกลบเรียบร้อย", "success");
        fetchActivities();
      } else {
        Swal.fire("ข้อผิดพลาด", "ไม่สามารถลบกิจกรรมได้", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("ข้อผิดพลาด", "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์", "error");
    }
  }

  function showParticipants(participants: Participant[]) {
    if (participants.length === 0) {
      Swal.fire("ไม่มีผู้ลงทะเบียน", "ยังไม่มีผู้ลงทะเบียนในกิจกรรมนี้", "info");
      return;
    }
    const text = participants
      .map(
        (p, i) =>
          `${i + 1}. ${p.fullName} (${p.studentId}) ชั้นปี/กลุ่ม: ${p.year} เบอร์: ${p.phone} สาขา: ${p.department || "-"}`
      )
      .join("\n");
    Swal.fire({
      title: "รายชื่อผู้ลงทะเบียน",
      text,
      icon: "info",
      customClass: { popup: "text-left whitespace-pre-line" },
    });
  }

  function downloadParticipants(participants: Participant[], activity: Activity) {
    if (participants.length === 0) {
      Swal.fire("ไม่มีผู้ลงทะเบียน", "ยังไม่มีผู้ลงทะเบียนในกิจกรรมนี้", "info");
      return;
    }
    const csv =
      "ลำดับ,ชื่อ-นามสกุล,รหัสนักศึกษา,ชั้นปี/กลุ่มเรียน,เบอร์โทร,สาขา\n" +
      participants
        .map(
          (p, i) =>
            `${i + 1},${p.fullName},${p.studentId},${p.year},${p.phone},${p.department || "-"}`
        )
        .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${activity.title}_รายชื่อ.csv`.replace(/\s+/g, "_");
    link.click();
  }

  function openCreateDialog() {
    setFormData({
      title: "",
      newsId: "",
      registerStart: new Date(),
      registerEnd: new Date(),
      activityStart: new Date(),
      activityEnd: new Date(),
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

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">จัดการกิจกรรม</h1>
          <button
            onClick={openCreateDialog}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
          >
            + เพิ่มกิจกรรมใหม่
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-4">ชื่อกิจกรรม</th>
                <th className="p-4">เปิดลงทะเบียน</th>
                <th className="p-4">ปิดลงทะเบียน</th>
                <th className="p-4">เริ่มกิจกรรม</th>
                <th className="p-4">สิ้นสุดกิจกรรม</th>
                <th className="p-4">สถานที่</th>
                <th className="p-4">สถานะ</th>
                <th className="p-4 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((a) => (
                <tr
                  key={a._id}
                  className="border-t border-gray-700 hover:bg-gray-600 transition"
                >
                  <td className="p-4">{a.title}</td>
                  <td className="p-4">{new Date(a.registerStart).toLocaleString("th-TH")}</td>
                  <td className="p-4">{new Date(a.registerEnd).toLocaleString("th-TH")}</td>
                  <td className="p-4">{new Date(a.activityStart).toLocaleString("th-TH")}</td>
                  <td className="p-4">{new Date(a.activityEnd).toLocaleString("th-TH")}</td>
                  <td className="p-4">{a.location}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        a.status === "open"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >
                      {a.status === "open" ? "เปิด" : "ปิด"}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-3">
                    <button
                      onClick={() => openEditDialog(a)}
                      title="แก้ไข"
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteActivity(a._id)}
                      title="ลบ"
                      className="text-red-400 hover:text-red-600"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => showParticipants(a.participants)}
                      title="ดูรายชื่อ"
                      className="text-green-400 hover:text-green-600"
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => downloadParticipants(a.participants, a)}
                      className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                    >
                      ดาวน์โหลด
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle className="bg-white text-gray-900">
            {editId ? "แก้ไขกิจกรรม" : "สร้างกิจกรรมใหม่"}
          </DialogTitle>
          <DialogContent className="bg-white text-gray-900">
            <div className="space-y-6 mt-4">
              <div>
                <TextField
                  label="ชื่อกิจกรรม"
                  fullWidth
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#374151" } }}
                  InputProps={{ style: { backgroundColor: "#f3f4f6" } }}
                  helperText="ระบุชื่อกิจกรรม เช่น การแข่งขันเขียนโปรแกรม"
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel style={{ color: "#374151" }}>เลือกข่าวสาร (ถ้ามี)</InputLabel>
                  <Select
                    value={formData.newsId}
                    onChange={(e) => setFormData({ ...formData, newsId: e.target.value })}
                    style={{ backgroundColor: "#f3f4f6" }}
                    label="เลือกข่าวสาร (ถ้ามี)"
                  >
                    <MenuItem value="">— ไม่เลือก —</MenuItem>
                    {newsList.map((n) => (
                      <MenuItem key={n._id} value={n._id}>
                        <img
                          src={n.image}
                          alt={n.title}
                          className="w-8 h-8 inline mr-2 rounded"
                        />
                        {n.title}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" color="textSecondary">
                    เลือกข่าวที่เกี่ยวข้องกับกิจกรรม (ถ้ามี)
                  </Typography>
                </FormControl>
              </div>

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={th}>
                <div>
                  <DateTimePicker
                    label="วันเปิดลงทะเบียน"
                    value={formData.registerStart}
                    onChange={(value) => setFormData({ ...formData, registerStart: value })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        InputLabelProps: { style: { color: "#374151" } },
                        InputProps: { style: { backgroundColor: "#f3f4f6" } },
                        helperText: "เลือกวันที่และเวลาที่เริ่มเปิดให้ลงทะเบียน",
                      },
                    }}
                    format="dd/MM/yyyy HH:mm"
                  />
                </div>
                <div>
                  <DateTimePicker
                    label="วันปิดลงทะเบียน"
                    value={formData.registerEnd}
                    onChange={(value) => setFormData({ ...formData, registerEnd: value })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        InputLabelProps: { style: { color: "#374151" } },
                        InputProps: { style: { backgroundColor: "#f3f4f6" } },
                        helperText: "เลือกวันที่และเวลาที่ปิดการลงทะเบียน",
                      },
                    }}
                    format="dd/MM/yyyy HH:mm"
                  />
                </div>
                <div>
                  <DateTimePicker
                    label="เวลาเริ่มกิจกรรม"
                    value={formData.activityStart}
                    onChange={(value) => setFormData({ ...formData, activityStart: value })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        InputLabelProps: { style: { color: "#374151" } },
                        InputProps: { style: { backgroundColor: "#f3f4f6" } },
                        helperText: "เลือกวันที่และเวลาที่กิจกรรมเริ่ม",
                      },
                    }}
                    format="dd/MM/yyyy HH:mm"
                  />
                </div>
                <div>
                  <DateTimePicker
                    label="เวลาสิ้นสุดกิจกรรม"
                    value={formData.activityEnd}
                    onChange={(value) => setFormData({ ...formData, activityEnd: value })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        variant: "outlined",
                        InputLabelProps: { style: { color: "#374151" } },
                        InputProps: { style: { backgroundColor: "#f3f4f6" } },
                        helperText: "เลือกวันที่และเวลาที่กิจกรรมสิ้นสุด",
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
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#374151" } }}
                  InputProps={{ style: { backgroundColor: "#f3f4f6" } }}
                  helperText="ระบุสถานที่ เช่น ห้องประชุม A101"
                />
              </div>

              <div>
                <TextField
                  label="จำนวนผู้เข้าร่วมสูงสุด"
                  type="number"
                  fullWidth
                  value={formData.maxParticipants}
                  onChange={(e) =>
                    setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })
                  }
                  variant="outlined"
                  InputLabelProps={{ style: { color: "#374151" } }}
                  InputProps={{ style: { backgroundColor: "#f3f4f6" } }}
                  helperText="ระบุจำนวนสูงสุด เช่น 50"
                />
              </div>

              <div>
                <FormControl fullWidth variant="outlined">
                  <InputLabel style={{ color: "#374151" }}>สถานะ</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ backgroundColor: "#f3f4f6" }}
                    label="สถานะ"
                  >
                    <MenuItem value="open">เปิดลงทะเบียน</MenuItem>
                    <MenuItem value="closed">ปิดลงทะเบียน</MenuItem>
                  </Select>
                  <Typography variant="caption" color="textSecondary">
                    เลือกสถานะของกิจกรรม
                  </Typography>
                </FormControl>
              </div>
            </div>
          </DialogContent>
          <DialogActions className="bg-white">
            <Button
              onClick={() => setOpenDialog(false)}
              style={{ color: "#fff", backgroundColor: "#6b7280" }}
            >
              ยกเลิก
            </Button>
            <Button
              variant="contained"
              onClick={handleCreateOrEditActivity}
              style={{ backgroundColor: "#2563eb", color: "#fff" }}
            >
              บันทึก
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}