"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";

interface AttendanceStatsProps {
  courseCode: string;
}

interface StudentAttendance {
  userName: string;
  userEmail: string;
  sessionsAttended: number;
  totalSessions: number;
  percentage: number;
}

interface Stats {
  courseCode: string;
  totalSessions: number;
  totalUniqueStudents: number;
  averageAttendance: number;
  studentAttendance: StudentAttendance[];
}

export function AttendanceStats({ courseCode }: AttendanceStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(
          `/api/attendance/stats?courseCode=${courseCode}`
        );
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, [courseCode]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading stats...</p>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unique Students
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalUniqueStudents}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Attendance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageAttendance}</div>
            <p className="text-xs text-muted-foreground">per session</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.courseCode}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.studentAttendance.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No attendance records yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Sessions Attended</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.studentAttendance.map((student) => (
                  <TableRow key={student.userEmail}>
                    <TableCell className="font-medium">
                      {student.userName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {student.userEmail}
                    </TableCell>
                    <TableCell>
                      {student.sessionsAttended} / {student.totalSessions}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[100px] bg-muted rounded-full h-2">
                          <div
                            className="bg-[#261CC1] h-2 rounded-full"
                            style={{ width: `${student.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {student.percentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          student.percentage >= 75
                            ? "default"
                            : student.percentage >= 50
                            ? "secondary"
                            : "destructive"
                        }
                        className={
                          student.percentage >= 75
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                      >
                        {student.percentage >= 75
                          ? "Good"
                          : student.percentage >= 50
                          ? "Fair"
                          : "Poor"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
