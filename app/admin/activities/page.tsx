
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
//     <LocalizationProvider dateAdapter={AdapterDateFns}>
//       <DateTimePicker
//         label="เปิดลงทะเบียน"
//         value={formData.registerStart}
//         onChange={(value) => setFormData({ ...formData, registerStart: value })}
//         renderInput={(params) => <TextField {...params} fullWidth />}
//       />
//       <DateTimePicker
//         label="ปิดลงทะเบียน"
//         value={formData.registerEnd}
//         onChange={(value) => setFormData({ ...formData, registerEnd: value })}
//         renderInput={(params) => <TextField {...params} fullWidth />}
//       />
//       <DateTimePicker
//         label="เริ่มกิจกรรม"
//         value={formData.activityStart}
//         onChange={(value) => setFormData({ ...formData, activityStart: value })}
//         renderInput={(params) => <TextField {...params} fullWidth />}
//       />
//       <DateTimePicker
//         label="สิ้นสุดกิจกรรม"
//         value={formData.activityEnd}
//         onChange={(value) => setFormData({ ...formData, activityEnd: value })}
//         renderInput={(params) => <TextField {...params} fullWidth />}
//       />
//     </LocalizationProvider>

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
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

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
    const body = JSON.stringify(editId ? { id: editId, updates: formData } : formData);

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body,
      });
      if (res.ok) {
        Swal.fire("Success", editId ? "แก้ไขกิจกรรมแล้ว" : "สร้างกิจกรรมแล้ว", "success");
        fetchActivities();
        setOpenDialog(false);
        setEditId(null);
      } else {
        const errorData = await res.json();
        Swal.fire("Error", errorData.message || "Operation failed", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Server error", "error");
    }
  }

  async function deleteActivity(id: string) {
    const confirm = await Swal.fire({ title: "ยืนยันลบกิจกรรม", icon: "warning", showCancelButton: true });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch("/api/activities", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        Swal.fire("Deleted", "ลบกิจกรรมแล้ว", "success");
        fetchActivities();
      } else {
        Swal.fire("Error", "ลบไม่สำเร็จ", "error");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Server error", "error");
    }
  }

  function showParticipants(participants: Participant[]) {
    if (participants.length === 0) {
      Swal.fire("ไม่มีผู้ลงทะเบียน", "", "info");
      return;
    }
    const text = participants.map((p, i) => `${i + 1}. ${p.fullName} (${p.studentId}) ปี${p.year} เบอร์: ${p.phone} สาขา: ${p.department || "-"} ภาค: ${p.program || "-"}`).join("\n");
    Swal.fire({ title: "รายชื่อผู้ลงทะเบียน", text, icon: "info", customClass: { popup: "text-left" } });
  }

  function downloadParticipants(participants: Participant[], activity: Activity) {
    if (participants.length === 0) {
      Swal.fire("ไม่มีผู้ลงทะเบียน", "", "info");
      return;
    }
    const csv = "ลำดับ,ชื่อ,รหัส,ปี,เบอร์โทร,สาขา,ภาค\n" +
      participants.map((p, i) => `${i + 1},${p.fullName},${p.studentId},${p.year},${p.phone},${p.department || "-"},${p.program || "-"}`).join("\n");
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
      registerStart: new Date(activity.registerStart || activity.registerStart),
      registerEnd: new Date(activity.registerEnd || activity.registerEnd),
      activityStart: new Date(activity.activityStart || activity.activityStart),
      activityEnd: new Date(activity.activityEnd || activity.activityEnd),
      location: activity.location,
      maxParticipants: activity.maxParticipants,
      status: activity.status,
    });
    setEditId(activity._id);
    setOpenDialog(true);
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">จัดการกิจกรรม</h1>
        <button onClick={openCreateDialog} className="bg-green-500 px-4 py-2 rounded hover:bg-green-700">เพิ่มกิจกรรม</button>
      </div>

      <table className="w-full bg-gray-800 rounded">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-2">ชื่อกิจกรรม</th>
            <th>เปิดลงทะเบียน</th>
            <th>ปิดลงทะเบียน</th>
            <th>เริ่มกิจกรรม</th>
            <th>สิ้นสุดกิจกรรม</th>
            <th>สถานที่</th>
            <th>สถานะ</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a) => (
            <tr key={a._id} className="border-t border-gray-700 hover:bg-gray-600">
              <td className="text-center p-2">{a.title}</td>
              <td className="text-center">{new Date(a.registerStart).toLocaleString()}</td>
              <td className="text-center">{new Date(a.registerEnd).toLocaleString()}</td>
              <td className="text-center">{new Date(a.activityStart).toLocaleString()}</td>
              <td className="text-center">{new Date(a.activityEnd).toLocaleString()}</td>
              <td className="text-center">{a.location}</td>
              <td className="text-center">
                <span className={`px-2 py-1 rounded-full ${a.status === "open" ? "bg-green-500" : "bg-red-500"}`}>{a.status === "open" ? "เปิด" : "ปิด"}</span>
              </td>
              <td className="flex justify-center gap-2 p-2">
                <button onClick={() => openEditDialog(a)}><PencilIcon className="w-5 h-5 text-blue-400 hover:text-blue-600" /></button>
                <button onClick={() => deleteActivity(a._id)}><TrashIcon className="w-5 h-5 text-red-400 hover:text-red-600" /></button>
                <button onClick={() => showParticipants(a.participants)}><CheckCircleIcon className="w-5 h-5 text-green-400 hover:text-green-600" /></button>
                <button onClick={() => downloadParticipants(a.participants, a)}>ดาวน์โหลด</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>{editId ? "แก้ไขกิจกรรม" : "เพิ่มกิจกรรม"}</DialogTitle>
        <DialogContent>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
    {/* ชื่อกิจกรรม */}
    <TextField
      label="ชื่อกิจกรรม"
      fullWidth
      value={formData.title}
      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
    />

    {/* ข่าวสาร */}
    <FormControl fullWidth>
      <InputLabel>เลือกข่าวสาร</InputLabel>
      <Select
        value={formData.newsId}
        onChange={(e) => setFormData({ ...formData, newsId: e.target.value })}
      >
        <MenuItem value="">— ไม่เลือก —</MenuItem>
        {newsList.map((n) => (
          <MenuItem key={n._id} value={n._id}>
            <img src={n.image} alt={n.title} className="w-8 h-8 inline mr-2 rounded" />
            {n.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* เวลา */}
  <LocalizationProvider dateAdapter={AdapterDateFns}>
  <DateTimePicker
    label="เปิดลงทะเบียน"
    value={formData.registerStart}
    onChange={(value) => setFormData({ ...formData, registerStart: value })}
    slotProps={{ textField: { fullWidth: true } }}
  />
  <DateTimePicker
    label="ปิดลงทะเบียน"
    value={formData.registerEnd}
    onChange={(value) => setFormData({ ...formData, registerEnd: value })}
    slotProps={{ textField: { fullWidth: true } }}
  />
  <DateTimePicker
    label="เริ่มกิจกรรม"
    value={formData.activityStart}
    onChange={(value) => setFormData({ ...formData, activityStart: value })}
    slotProps={{ textField: { fullWidth: true } }}
  />
  <DateTimePicker
    label="สิ้นสุดกิจกรรม"
    value={formData.activityEnd}
    onChange={(value) => setFormData({ ...formData, activityEnd: value })}
    slotProps={{ textField: { fullWidth: true } }}
  />
</LocalizationProvider>


    {/* สถานที่ */}
    <TextField
      label="สถานที่จัดกิจกรรม"
      fullWidth
      value={formData.location}
      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
    />

    {/* จำนวน */}
    <TextField
      label="จำนวนผู้เข้าร่วมสูงสุด"
      type="number"
      fullWidth
      value={formData.maxParticipants}
      onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
    />

    {/* สถานะ */}
    <FormControl fullWidth>
      <InputLabel>สถานะ</InputLabel>
      <Select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
      >
        <MenuItem value="open">เปิดลงทะเบียน</MenuItem>
        <MenuItem value="closed">ปิดลงทะเบียน</MenuItem>
      </Select>
    </FormControl>
  </div>
</DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
          <Button variant="contained" onClick={handleCreateOrEditActivity}>บันทึก</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
