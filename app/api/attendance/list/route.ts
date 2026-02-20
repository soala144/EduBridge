import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseCode = searchParams.get("courseCode");
    const sessionDate = searchParams.get("sessionDate");

    if (!courseCode || !sessionDate) {
      return NextResponse.json(
        { error: "Missing courseCode or sessionDate" },
        { status: 400 }
      );
    }

    const date = new Date(sessionDate);
    const sessionKey = `${courseCode}-${date.toISOString().split("T")[0]}`;

    const attendances = await prisma.attendance.findMany({
      where: {
        sessionKey,
        present: true,
      },
      select: {
        userName: true,
        userEmail: true,
        matNumber: true,
        markedAt: true,
      },
      orderBy: {
        markedAt: "asc",
      },
    });

    return NextResponse.json({
      attendees: attendances,
      count: attendances.length,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}
