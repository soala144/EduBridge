import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseCode = searchParams.get("courseCode");
    const sessionDate = searchParams.get("sessionDate");

    console.log("Fetching attendance for:", { courseCode, sessionDate });

    if (!courseCode || !sessionDate) {
      return NextResponse.json(
        { error: "Missing courseCode or sessionDate" },
        { status: 400 }
      );
    }

    const date = new Date(sessionDate);
    const sessionKey = `${courseCode}-${date.toISOString().split("T")[0]}`;

    console.log("Looking for sessionKey:", sessionKey);

    const attendances = await prisma.attendance.findMany({
      where: {
        sessionKey,
        present: true,
      },
      select: {
        id: true,
        userName: true,
        userEmail: true,
        matNumber: true,
        markedAt: true,
      },
      orderBy: {
        markedAt: "asc",
      },
    });

    console.log(`Found ${attendances.length} attendance records`);

    return NextResponse.json({
      attendees: attendances,
      count: attendances.length,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch attendance", details: errorMessage },
      { status: 500 }
    );
  }
}
