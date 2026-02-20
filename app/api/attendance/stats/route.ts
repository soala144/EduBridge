import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseCode = searchParams.get("courseCode");

    if (!courseCode) {
      return NextResponse.json(
        { error: "Missing courseCode" },
        { status: 400 }
      );
    }

    // Get all unique sessions for this course
    const sessions = await prisma.attendance.groupBy({
      by: ["sessionKey", "sessionDate"],
      where: {
        courseCode,
      },
      _count: {
        userEmail: true,
      },
      orderBy: {
        sessionDate: "desc",
      },
    });

    // Get unique students who have attended at least once
    const uniqueStudents = await prisma.attendance.groupBy({
      by: ["userEmail"],
      where: {
        courseCode,
      },
    });

    const totalSessions = sessions.length;
    const totalUniqueStudents = uniqueStudents.length;

    // Calculate average attendance per session
    const totalAttendances = sessions.reduce(
      (sum, session) => sum + session._count.userEmail,
      0
    );
    const averageAttendance =
      totalSessions > 0 ? Math.round(totalAttendances / totalSessions) : 0;

    // Get attendance by student
    const studentAttendance = await prisma.attendance.groupBy({
      by: ["userEmail", "userName"],
      where: {
        courseCode,
      },
      _count: {
        id: true,
      },
    });

    const attendancePercentages = studentAttendance.map((student) => ({
      userName: student.userName,
      userEmail: student.userEmail,
      sessionsAttended: student._count.id,
      totalSessions,
      percentage:
        totalSessions > 0
          ? Math.round((student._count.id / totalSessions) * 100)
          : 0,
    }));

    return NextResponse.json({
      courseCode,
      totalSessions,
      totalUniqueStudents,
      averageAttendance,
      sessions: sessions.map((s) => ({
        sessionKey: s.sessionKey,
        sessionDate: s.sessionDate,
        attendanceCount: s._count.userEmail,
      })),
      studentAttendance: attendancePercentages.sort(
        (a, b) => b.percentage - a.percentage
      ),
    });
  } catch (error) {
    console.error("Error fetching attendance stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance stats" },
      { status: 500 }
    );
  }
}
