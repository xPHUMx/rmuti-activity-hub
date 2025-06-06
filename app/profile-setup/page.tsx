

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

// ตัวเลือกสาขา ➜ ภาค ➜ ปี
const branchOptions: Record<string, { programs: Record<string, string[]> }> = {
  "วิศวกรรมคอมพิวเตอร์": {
    programs: {
      "ภาคปกติ": ["ECP1N", "ECP2N", "ECP3N", "ECP4N"],
      "ภาคสมทบ": ["ECP1R", "ECP2R", "ECP3R", "ECP4R"],
    },
  },
  "วิศวกรรมไฟฟ้า": {
    programs: {
      "ภาคปกติ": ["EEP1N", "EEP2N", "EEP3N", "EEP4N"],
      "ภาคสมทบ": ["EEP1R", "EEP2R", "EEP3R", "EEP4R"],
    },
  },
};

export default function ProfileSetup() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    department: "",
    program: "",
    year: "",
    phone: "",
  });
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const [selectedProgram, setSelectedProgram] = useState<string>("");

  const formatStudentId = (v: string) => v.replace(/\D/g, "").replace(/^(.{11})(.)/, "$1-$2");
  const formatPhone = (v: string) => v.replace(/\D/g, "").replace(/^(.{3})(.{3})(.{0,4})$/, "$1-$2-$3");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "studentId") setFormData({ ...formData, studentId: formatStudentId(value) });
    else if (name === "phone") setFormData({ ...formData, phone: formatPhone(value) });
    else setFormData({ ...formData, [name]: value });
  };

  const handleBranchChange = (branch: string) => {
    setSelectedBranch(branch);
    setSelectedProgram("");
    setFormData({ ...formData, department: branch, program: "", year: "" });
  };

  const handleProgramChange = (prog: string) => {
    setSelectedProgram(prog);
    setFormData({ ...formData, program: prog, year: "" });
  };

  const handleYearChange = (yr: string) => setFormData({ ...formData, year: yr });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) {
      Swal.fire("กรุณาล็อกอินใหม่", "คุณต้องล็อกอินเพื่อบันทึกข้อมูล", "error");
      return;
    }

    const res = await fetch("/api/users/update-profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: session.user.email,
        fullName: formData.fullName.trim(),
        studentId: formData.studentId.trim(),
        department: formData.department.trim(),
        program: formData.program.trim(),
        year: formData.year.trim(),
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
        bgcolor: "#0f172a", // พื้นหลัง dark
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 420,
          bgcolor: "#ffffff", // กรอบขาว
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" align="center" gutterBottom color="black">
          กรอกข้อมูลนักศึกษา
        </Typography>

        <Box component="form" noValidate onSubmit={handleSubmit}>
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
              {Object.keys(branchOptions).map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* ภาค */}
          {selectedBranch && (
            <FormControl fullWidth margin="normal" required>
              <InputLabel>ภาค</InputLabel>
              <Select
                value={selectedProgram}
                label="ภาค"
                onChange={(e) => handleProgramChange(e.target.value as string)}
              >
                {Object.keys(branchOptions[selectedBranch].programs).map((p) => (
                  <MenuItem key={p} value={p}>
                    {p}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* ชั้นปี */}
          {selectedProgram && (
            <FormControl fullWidth margin="normal" required>
              <InputLabel>ชั้นปี</InputLabel>
              <Select
                value={formData.year}
                label="ชั้นปี"
                onChange={(e) => handleYearChange(e.target.value as string)}
              >
                {branchOptions[selectedBranch].programs[selectedProgram].map((yr) => (
                  <MenuItem key={yr} value={yr}>
                    {yr}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

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


// "use client";
// import { useState, useEffect } from "react";
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

// export default function ProfileSetup() {
//   const { data: session } = useSession();
//   const [branches, setBranches] = useState<any[]>([]);
//   const [programs, setPrograms] = useState<any[]>([]);
//   const [plans, setPlans] = useState<any[]>([]);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     studentId: "",
//     branch: "",
//     program: "",
//     plan: "",
//     phone: "",
//   });

//   // ดึงข้อมูลตัวเลือกจาก API
//   useEffect(() => {
//     fetch("/api/branches")
//       .then(res => res.json())
//       .then(data => setBranches(data));

//     fetch("/api/plans")
//       .then(res => res.json())
//       .then(data => setPlans(data));
//   }, []);

//   // เมื่อเลือก branch ให้โหลด program ตามสาขา
//   useEffect(() => {
//     if (formData.branch) {
//       fetch(`/api/programs?branch=${formData.branch}`)
//         .then(res => res.json())
//         .then(data => setPrograms(data));
//     } else {
//       setPrograms([]);
//     }
//     setFormData(f => ({ ...f, program: "" })); // reset program เมื่อเปลี่ยนสาขา
//   }, [formData.branch]);

//   const handleChange = (e: any) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // ...เหมือนเดิม
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#0f172a", p: 2 }}>
//       <Paper elevation={6} sx={{ p: 4, width: 420, bgcolor: "#fff", borderRadius: 3 }}>
//         <Typography variant="h6" align="center" gutterBottom color="black">
//           กรอกข้อมูลนักศึกษา
//         </Typography>

//         <Box component="form" noValidate onSubmit={handleSubmit}>
//           <TextField label="ชื่อ-นามสกุล" name="fullName" fullWidth required margin="normal" value={formData.fullName} onChange={handleChange} />
//           <TextField label="รหัสนักศึกษา" name="studentId" fullWidth required margin="normal" value={formData.studentId} onChange={handleChange} />

//           {/* สาขา */}
//           <FormControl fullWidth margin="normal" required>
//             <InputLabel>สาขา</InputLabel>
//             <Select name="branch" value={formData.branch} label="สาขา" onChange={handleChange}>
//               {branches.map(b => (
//                 <MenuItem key={b._id} value={b.name}>{b.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* หลักสูตร/ภาค */}
//           <FormControl fullWidth margin="normal" required>
//             <InputLabel>หลักสูตร/ภาค</InputLabel>
//             <Select name="program" value={formData.program} label="หลักสูตร/ภาค" onChange={handleChange} disabled={!formData.branch}>
//               {programs.map(p => (
//                 <MenuItem key={p._id} value={p.name}>{p.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           {/* แผนการศึกษา */}
//           <FormControl fullWidth margin="normal" required>
//             <InputLabel>แผนการศึกษา</InputLabel>
//             <Select name="plan" value={formData.plan} label="แผนการศึกษา" onChange={handleChange}>
//               {plans.map(p => (
//                 <MenuItem key={p._id} value={p.name}>{p.name}</MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <TextField label="เบอร์โทร" name="phone" fullWidth required margin="normal" value={formData.phone} onChange={handleChange} />

//           <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.2 }}>
//             บันทึกข้อมูล
//           </Button>
//         </Box>
//       </Paper>
//     </Box>
//   );
// }
