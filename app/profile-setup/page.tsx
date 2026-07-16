

// "use client";

// import { useState } from "react";
// import { useSession, signOut } from "next-auth/react";
// import Swal from "sweetalert2";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
// } from "@mui/material";

// // ตัวเลือกสาขา ➜ ภาค ➜ ปี
// const branchOptions: Record<string, { programs: Record<string, string[]> }> = {
//   "วิศวกรรมคอมพิวเตอร์": {
//     programs: {
//       "ภาคปกติ": ["ECP1N", "ECP2N", "ECP3N", "ECP4N"],
//       "ภาคสมทบ": ["ECP1R", "ECP2R", "ECP3R", "ECP4R"],
//     },
//   },
//   "วิศวกรรมไฟฟ้า": {
//     programs: {
//       "ภาคปกติ": ["EEP1N", "EEP2N", "EEP3N", "EEP4N"],
//       "ภาคสมทบ": ["EEP1R", "EEP2R", "EEP3R", "EEP4R"],
//     },
//   },
// };

// export default function ProfileSetup() {
//   const { data: session } = useSession();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     studentId: "",
//     department: "",
//     program: "",
//     year: "",
//     phone: "",
//   });
//   const [selectedBranch, setSelectedBranch] = useState<string>("");
//   const [selectedProgram, setSelectedProgram] = useState<string>("");

//   const formatStudentId = (v: string) => v.replace(/\D/g, "").replace(/^(.{11})(.)/, "$1-$2");
//   const formatPhone = (v: string) => v.replace(/\D/g, "").replace(/^(.{3})(.{3})(.{0,4})$/, "$1-$2-$3");

//   const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (name === "studentId") setFormData({ ...formData, studentId: formatStudentId(value) });
//     else if (name === "phone") setFormData({ ...formData, phone: formatPhone(value) });
//     else setFormData({ ...formData, [name]: value });
//   };

//   const handleBranchChange = (branch: string) => {
//     setSelectedBranch(branch);
//     setSelectedProgram("");
//     setFormData({ ...formData, department: branch, program: "", year: "" });
//   };

//   const handleProgramChange = (prog: string) => {
//     setSelectedProgram(prog);
//     setFormData({ ...formData, program: prog, year: "" });
//   };

//   const handleYearChange = (yr: string) => setFormData({ ...formData, year: yr });

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!session?.user?.email) {
//       Swal.fire("กรุณาล็อกอินใหม่", "คุณต้องล็อกอินเพื่อบันทึกข้อมูล", "error");
//       return;
//     }

//     const res = await fetch("/api/users/update-profile", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: session.user.email,
//         fullName: formData.fullName.trim(),
//         studentId: formData.studentId.trim(),
//         department: formData.department.trim(),
//         program: formData.program.trim(),
//         year: formData.year.trim(),
//         phone: formData.phone.trim(),
//       }),
//     });

//     if (res.ok) {
//       Swal.fire("บันทึกสำเร็จ", "โปรดเข้าสู่ระบบใหม่", "success").then(() =>
//         signOut({ callbackUrl: "/login" })
//       );
//     } else {
//       Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองใหม่", "error");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         bgcolor: "#0f172a", // พื้นหลัง dark
//         p: 2,
//       }}
//     >
//       <Paper
//         elevation={6}
//         sx={{
//           p: 4,
//           width: 420,
//           bgcolor: "#ffffff", // กรอบขาว
//           borderRadius: 3,
//         }}
//       >
//         <Typography variant="h6" align="center" gutterBottom color="black">
//           กรอกข้อมูลนักศึกษา
//         </Typography>

//         <Box component="form" noValidate onSubmit={handleSubmit}>
//           {/* ชื่อ-นามสกุล */}
//           <TextField
//             label="ชื่อ-นามสกุล"
//             name="fullName"
//             fullWidth
//             required
//             margin="normal"
//             value={formData.fullName}
//             onChange={handleTextChange}
//           />

//           {/* รหัสนักศึกษา */}
//           <TextField
//             label="รหัสนักศึกษา"
//             name="studentId"
//             fullWidth
//             required
//             margin="normal"
//             inputProps={{ maxLength: 13 }}
//             value={formData.studentId}
//             onChange={handleTextChange}
//           />

//           {/* สาขา */}
//           <FormControl fullWidth margin="normal" required>
//             <InputLabel>สาขา</InputLabel>
//             <Select
//               value={selectedBranch}
//               label="สาขา"
//               onChange={(e) => handleBranchChange(e.target.value as string)}
//             >
//               {Object.keys(branchOptions).map((b) => (
//                 <MenuItem key={b} value={b}>
//                   {b}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* ภาค */}
//           {selectedBranch && (
//             <FormControl fullWidth margin="normal" required>
//               <InputLabel>ภาค</InputLabel>
//               <Select
//                 value={selectedProgram}
//                 label="ภาค"
//                 onChange={(e) => handleProgramChange(e.target.value as string)}
//               >
//                 {Object.keys(branchOptions[selectedBranch].programs).map((p) => (
//                   <MenuItem key={p} value={p}>
//                     {p}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           )}

//           {/* ชั้นปี */}
//           {selectedProgram && (
//             <FormControl fullWidth margin="normal" required>
//               <InputLabel>ชั้นปี</InputLabel>
//               <Select
//                 value={formData.year}
//                 label="ชั้นปี"
//                 onChange={(e) => handleYearChange(e.target.value as string)}
//               >
//                 {branchOptions[selectedBranch].programs[selectedProgram].map((yr) => (
//                   <MenuItem key={yr} value={yr}>
//                     {yr}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           )}

//           {/* เบอร์โทร */}
//           <TextField
//             label="เบอร์โทร"
//             name="phone"
//             fullWidth
//             required
//             margin="normal"
//             inputProps={{ maxLength: 12 }}
//             value={formData.phone}
//             onChange={handleTextChange}
//           />

//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ mt: 3, py: 1.2 }}
//           >
//             บันทึกข้อมูล
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// }


// "use client";

// import { useState } from "react";
// import { useSession, signOut } from "next-auth/react";
// import Swal from "sweetalert2";
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Button,
// } from "@mui/material";

// // ตัวเลือกสาขาเท่านั้น
// const branchOptions: string[] = ["วิศวกรรมคอมพิวเตอร์", "วิศวกรรมไฟฟ้า"];

// export default function ProfileSetup() {
//   const { data: session } = useSession();
//   const [formData, setFormData] = useState({
//     fullName: "",
//     studentId: "",
//     department: "",
//     phone: "",
//   });
//   const [selectedBranch, setSelectedBranch] = useState<string>("");

//   const formatStudentId = (v: string) => v.replace(/\D/g, "").replace(/^(.{11})(.)/, "$1-$2");
//   const formatPhone = (v: string) => v.replace(/\D/g, "").replace(/^(.{3})(.{3})(.{0,4})$/, "$1-$2-$3");

//   const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     if (name === "studentId") setFormData({ ...formData, studentId: formatStudentId(value) });
//     else if (name === "phone") setFormData({ ...formData, phone: formatPhone(value) });
//     else setFormData({ ...formData, [name]: value });
//   };

//   const handleBranchChange = (branch: string) => {
//     setSelectedBranch(branch);
//     setFormData({ ...formData, department: branch });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!session?.user?.email) {
//       Swal.fire("กรุณาล็อกอินใหม่", "คุณต้องล็อกอินเพื่อบันทึกข้อมูล", "error");
//       return;
//     }

//     const res = await fetch("/api/users/update-profile", {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         email: session.user.email,
//         fullName: formData.fullName.trim(),
//         studentId: formData.studentId.trim(),
//         department: formData.department.trim(),
//         phone: formData.phone.trim(),
//       }),
//     });

//     if (res.ok) {
//       Swal.fire("บันทึกสำเร็จ", "โปรดเข้าสู่ระบบใหม่", "success").then(() =>
//         signOut({ callbackUrl: "/login" })
//       );
//     } else {
//       Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองใหม่", "error");
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         bgcolor: "#0f172a",
//         p: 2,
//       }}
//     >
//       <Paper
//         elevation={6}
//         sx={{
//           p: 4,
//           width: 420,
//           bgcolor: "#ffffff",
//           borderRadius: 3,
//         }}
//       >
//         <Typography variant="h6" align="center" gutterBottom color="black">
//           กรอกข้อมูลนักศึกษา
//         </Typography>

//         <Box component="form" noValidate onSubmit={handleSubmit}>
//           {/* ชื่อ-นามสกุล */}
//           <TextField
//             label="ชื่อ-นามสกุล"
//             name="fullName"
//             fullWidth
//             required
//             margin="normal"
//             value={formData.fullName}
//             onChange={handleTextChange}
//           />

//           {/* รหัสนักศึกษา */}
//           <TextField
//             label="รหัสนักศึกษา"
//             name="studentId"
//             fullWidth
//             required
//             margin="normal"
//             inputProps={{ maxLength: 13 }}
//             value={formData.studentId}
//             onChange={handleTextChange}
//           />

//           {/* สาขา */}
//           <FormControl fullWidth margin="normal" required>
//             <InputLabel>สาขา</InputLabel>
//             <Select
//               value={selectedBranch}
//               label="สาขา"
//               onChange={(e) => handleBranchChange(e.target.value as string)}
//             >
//               {branchOptions.map((b) => (
//                 <MenuItem key={b} value={b}>
//                   {b}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* เบอร์โทร */}
//           <TextField
//             label="เบอร์โทร"
//             name="phone"
//             fullWidth
//             required
//             margin="normal"
//             inputProps={{ maxLength: 12 }}
//             value={formData.phone}
//             onChange={handleTextChange}
//           />

//           <Button
//             type="submit"
//             variant="contained"
//             color="primary"
//             fullWidth
//             sx={{ mt: 3, py: 1.2 }}
//           >
//             บันทึกข้อมูล
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// }

"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

// ตัวเลือกสาขาและคำนำหน้า
const branchOptions: string[] = ["วิศวกรรมคอมพิวเตอร์", "วิศวกรรมไฟฟ้า"];
const titleOptions: string[] = ["นาย", "นาง", "นางสาว"];

export default function ProfileSetup() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    fullName: "",
    studentId: "",
    department: "",
    phone: "",
  });
  const [selectedBranch, setSelectedBranch] = useState<string>("");

  const formatStudentId = (v: string) => v.replace(/\D/g, "").replace(/^(.{11})(.)/, "$1-$2");
  const formatPhone = (v: string) => v.replace(/\D/g, "").replace(/^(.{3})(.{3})(.{0,4})$/, "$1-$2-$3");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "studentId") setFormData({ ...formData, studentId: formatStudentId(value) });
    else if (name === "phone") setFormData({ ...formData, phone: formatPhone(value) });
    else setFormData({ ...formData, [name]: value });
  };

  const handleTitleChange = (title: string) => {
    setFormData({ ...formData, title });
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    setFormData({ ...formData, department: branch });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      Swal.fire("กรุณาล็อกอินใหม่", "คุณต้องล็อกอินเพื่อบันทึกข้อมูล", "error");
      return;
    }

    const fullNameWithTitle = `${formData.title} ${formData.fullName}`.trim();

    const res = await fetch("/api/users/update-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        fullName: fullNameWithTitle,
        studentId: formData.studentId.trim(),
        department: formData.department.trim(),
        phone: formData.phone.trim(),
      }),
    });

    if (res.ok) {
      Swal.fire("บันทึกสำเร็จ", "โปรดเข้าสู่ระบบใหม่", "success").then(() =>
        signOut({ callbackUrl: "/login" })
      );
    } else {
      Swal.fire("เกิดข้อผิดพลาด", "กรุณาลองใหม่", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-[#0a0a0a] dark:via-[#121212] dark:to-[#080808] px-4 transition-colors duration-300 font-sarabun">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-[#0a0a0bf0] border border-gray-200 dark:border-white/[0.04] p-8 md:p-10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all duration-300 flex flex-col"
      >
        <h2 className="text-[10px] tracking-[0.3em] font-light text-orange-500 uppercase text-center mb-2">
          Student Profile Setup
        </h2>
        <h1 className="text-xl font-light text-center text-gray-800 dark:text-gray-200 tracking-wide mb-8">
          กรอกข้อมูลนักศึกษาเพื่อเริ่มต้นใช้งาน
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* คำนำหน้า */}
          <div>
            <label className="block text-[10px] tracking-wider text-gray-600 dark:text-gray-500 uppercase mb-2">
              คำนำหน้า <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-gray-800 dark:text-white rounded-2xl p-3.5 focus:outline-none transition duration-300 cursor-pointer"
              required
            >
              <option value="" disabled>— เลือกคำนำหน้า —</option>
              {titleOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* ชื่อ-นามสกุล */}
          <div>
            <label className="block text-[10px] tracking-wider text-gray-600 dark:text-gray-500 uppercase mb-2">
              ชื่อ-นามสกุล <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="กรอกชื่อและนามสกุลของคุณ..."
              value={formData.fullName}
              onChange={handleTextChange}
              className="w-full bg-gray-50 dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-gray-850 dark:text-white rounded-2xl p-3.5 focus:outline-none transition duration-300"
              required
            />
          </div>

          {/* รหัสนักศึกษา */}
          <div>
            <label className="block text-[10px] tracking-wider text-gray-600 dark:text-gray-500 uppercase mb-2">
              รหัสนักศึกษา <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="studentId"
              maxLength={13}
              placeholder="กรอกรหัสนักศึกษา 13 หลัก..."
              value={formData.studentId}
              onChange={handleTextChange}
              className="w-full bg-gray-50 dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-gray-850 dark:text-white rounded-2xl p-3.5 focus:outline-none transition duration-300 font-mono tracking-wider"
              required
            />
          </div>

          {/* สาขา */}
          <div>
            <label className="block text-[10px] tracking-wider text-gray-600 dark:text-gray-500 uppercase mb-2">
              สาขา <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => handleBranchChange(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-gray-800 dark:text-white rounded-2xl p-3.5 focus:outline-none transition duration-300 cursor-pointer"
              required
            >
              <option value="" disabled>— เลือกสาขาวิชา —</option>
              {branchOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* เบอร์โทร */}
          <div>
            <label className="block text-[10px] tracking-wider text-gray-600 dark:text-gray-500 uppercase mb-2">
              เบอร์โทร <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="phone"
              maxLength={12}
              placeholder="กรอกเบอร์โทรศัพท์ติดต่อ..."
              value={formData.phone}
              onChange={handleTextChange}
              className="w-full bg-gray-50 dark:bg-[#0f0f10] border border-gray-200 dark:border-white/[0.08] focus:border-orange-500/40 text-sm font-light text-gray-850 dark:text-white rounded-2xl p-3.5 focus:outline-none transition duration-300"
              required
            />
          </div>

          {/* ปุ่มบันทึก */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-black text-xs font-medium tracking-widest py-3.5 px-6 rounded-2xl shadow-[0_5px_15px_rgba(249,115,22,0.15)] hover:shadow-[0_8px_20px_rgba(249,115,22,0.3)] transition duration-300 flex items-center justify-center gap-2 mt-8"
          >
            <span>บันทึกข้อมูลเพื่อเข้าสู่ระบบ</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
}