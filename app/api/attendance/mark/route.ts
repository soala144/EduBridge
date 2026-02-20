import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseCode, sessionDate, userName, userEmail, matNumber } = body;

    if (!courseCode || !sessionDate || !userName || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const date = new Date(sessionDate);
    const sessionKey = `${courseCode}-${date.toISOString().split("T")[0]}`;

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
        matNumber,
      },
      create: {
        courseCode,
        sessionDate: date,
        userName,
        userEmail,
        matNumber,
        sessionKey,
        present: true,
      },
    });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { error: "Failed to mark attendance" },
      { status: 500 }
    );
  }
}
