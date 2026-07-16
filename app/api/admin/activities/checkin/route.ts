import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/utils/db";
import Activity from "@/models/Activity";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { activityId, email } = await req.json();

    if (!activityId || !email) {
      return NextResponse.json(
        { message: "ข้อมูลไม่ครบถ้วน กรุณาระบุรหัสกิจกรรมและอีเมลนักศึกษา" },
        { status: 400 }
      );
    }

    // 1. ตรวจสอบผู้ใช้จากเมล
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: `ไม่พบข้อมูลผู้ใช้งานอีเมล: ${email} ในระบบ` },
        { status: 404 }
      );
    }

    // 2. ตรวจสอบกิจกรรม
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return NextResponse.json(
        { message: "ไม่พบกิจกรรมนี้ในระบบ" },
        { status: 404 }
      );
    }

    // 3. ตรวจสอบว่าเคยลงทะเบียน / เข้าร่วมในกิจกรรมนี้หรือยัง
    const participant = activity.participants.find(
      (p: any) => p.studentId === user.studentId || p.fullName === user.name
    );

    if (participant) {
      // นักศึกษาลงทะเบียนไว้แล้วในเว็บ -> ทำการเช็คอินหน้างาน
      if (participant.checkedIn) {
        return NextResponse.json(
          { 
            message: `นักศึกษา ${user.name} ได้เช็คอินเข้าร่วมกิจกรรมนี้เรียบร้อยแล้ว`,
            success: true,
            user 
          },
          { status: 200 }
        );
      }

      // ทำการเช็คอินในฝั่ง Activity
      participant.checkedIn = true;
      participant.checkInDate = new Date();
      await activity.save();

      // ทำการเช็คอินในฝั่ง User
      const userReg = user.registeredActivities.find(
        (reg: any) => reg.activityId.toString() === activityId.toString()
      );
      if (userReg) {
        userReg.checkedIn = true;
        userReg.checkInDate = new Date();
      } else {
        user.registeredActivities.push({
          activityId: activity._id,
          registrationDate: new Date(),
          checkedIn: true,
          checkInDate: new Date()
        });
      }
      await user.save();

      return NextResponse.json(
        { 
          message: `เช็คอินและบันทึกชั่วโมงกิจกรรมของนักศึกษา ${user.name} สำเร็จ!`,
          success: true,
          user 
        },
        { status: 200 }
      );
    }

    // 4. บันทึกเข้าร่วมกิจกรรมในฝั่ง Activity (เช็คอินทันทีสำหรับผู้ที่ไม่ได้ลงทะเบียนล่วงหน้า)
    activity.participants.push({
      fullName: user.name,
      studentId: user.studentId || "EXTERNAL",
      department: user.department || "-",
      program: user.program || "-",
      year: user.year || "1",
      phone: user.phone || "-",
      registeredAt: new Date(),
      checkedIn: true,
      checkInDate: new Date()
    });

    // ปิดรับอัตโนมัติหากจำนวนผู้ลงทะเบียนเต็ม
    if (activity.participants.length >= activity.maxParticipants) {
      activity.status = "closed";
    }
    await activity.save();

    // 5. บันทึกเข้าร่วมกิจกรรมในฝั่ง User (เช็คอินทันทีสำหรับผู้ที่ไม่ได้ลงทะเบียนล่วงหน้า)
    user.registeredActivities.push({
      activityId: activity._id,
      registrationDate: new Date(),
      checkedIn: true,
      checkInDate: new Date()
    });
    await user.save();

    return NextResponse.json(
      { 
        message: `ลงทะเบียนและเช็คอินนักศึกษา ${user.name} สำเร็จ!`,
        success: true,
        user 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Check-in error:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในการเช็คชื่อ", error: error.message },
      { status: 500 }
    );
  }
}
