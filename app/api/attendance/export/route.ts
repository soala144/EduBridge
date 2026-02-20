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

    // Generate CSV
    const headers = ["#", "Name", "Email", "Matric Number", "Time Marked"];
    const rows = attendances.map((att, index) => [
      index + 1,
      att.userName,
      att.userEmail,
      att.matNumber || "N/A",
      new Date(att.markedAt).toLocaleString(),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="attendance-${courseCode}-${sessionDate}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error exporting attendance:", error);
    return NextResponse.json(
      { error: "Failed to export attendance" },
      { status: 500 }
    );
  }
}
