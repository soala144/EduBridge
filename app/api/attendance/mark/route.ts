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

    const attendance = await prisma.attendance.upsert({
      where: {
        sessionKey_userEmail: {
          sessionKey,
          userEmail,
        },
      },
      update: {
        present: true,
        markedAt: new Date(),
        userName,
        matNumber: matNumber || null,
      },
      create: {
        courseCode,
        sessionDate: date,
        userName,
        userEmail,
        matNumber: matNumber || null,
        sessionKey,
        present: true,
      },
    });

    console.log("Attendance marked successfully:", attendance.id);

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to mark attendance", details: errorMessage },
      { status: 500 }
    );
  }
}
