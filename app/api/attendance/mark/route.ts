import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseCode, sessionDate, userName, userEmail, matNumber } = body;

    console.log("Received attendance data:", { courseCode, sessionDate, userName, userEmail, matNumber });

    if (!courseCode || !sessionDate || !userName || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const date = new Date(sessionDate);
    const sessionKey = `${courseCode}-${date.toISOString().split("T")[0]}`;

    console.log("Creating attendance with sessionKey:", sessionKey);

    // Check if attendance already exists
    const existing = await prisma.attendance.findFirst({
      where: {
        sessionKey,
        userEmail,
      },
    });

    let attendance;

    if (existing) {
      // Update existing attendance
      attendance = await prisma.attendance.update({
        where: {
          id: existing.id,
        },
        data: {
          present: true,
          markedAt: new Date(),
          userName,
          matNumber: matNumber || null,
        },
      });
      console.log("Attendance updated:", attendance.id);
    } else {
      // Create new attendance
      attendance = await prisma.attendance.create({
        data: {
          courseCode,
          sessionDate: date,
          userName,
          userEmail,
          matNumber: matNumber || null,
          sessionKey,
          present: true,
        },
      });
      console.log("Attendance created:", attendance.id);
    }

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    return NextResponse.json(
      { error: "Failed to mark attendance", details: errorMessage, stack: errorStack },
      { status: 500 }
    );
  }
}
