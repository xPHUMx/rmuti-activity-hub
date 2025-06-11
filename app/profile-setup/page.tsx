

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
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#0f172a",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 420,
          bgcolor: "#ffffff",
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" align="center" gutterBottom color="black">
          กรอกข้อมูลนักศึกษา
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
          {/* คำนำหน้า */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>คำนำหน้า</InputLabel>
            <Select
              value={formData.title}
              label="คำนำหน้า"
              onChange={(e) => handleTitleChange(e.target.value as string)}
            >
              {titleOptions.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ชื่อ-นามสกุล */}
          <TextField
            label="ชื่อ-นามสกุล"
            name="fullName"
            fullWidth
            required
            margin="normal"
            value={formData.fullName}
            onChange={handleTextChange}
          />

          {/* รหัสนักศึกษา */}
          <TextField
            label="รหัสนักศึกษา"
            name="studentId"
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 13 }}
            value={formData.studentId}
            onChange={handleTextChange}
          />

          {/* สาขา */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>สาขา</InputLabel>
            <Select
              value={selectedBranch}
              label="สาขา"
              onChange={(e) => handleBranchChange(e.target.value as string)}
            >
              {branchOptions.map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* เบอร์โทร */}
          <TextField
            label="เบอร์โทร"
            name="phone"
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 12 }}
            value={formData.phone}
            onChange={handleTextChange}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1.2 }}
          >
            บันทึกข้อมูล
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}