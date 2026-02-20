"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { QRGenerator } from "./QRGenerator";
import { QRScanner } from "./QRScanner";
import { getAttendees, addAttendee, getCurrentUser, db } from "@/lib/db";
import { toast } from "sonner";
import { Users, AlertCircle } from "lucide-react";

interface AttendanceSectionProps {
  courseCode: string;
}

export function AttendanceSection({ courseCode }: AttendanceSectionProps) {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [attendees, setAttendees] = useState<string[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const sessionKey = `${courseCode}-${new Date().toISOString().split("T")[0]}`;

  useEffect(() => {
    async function loadUser() {
      const user = await getCurrentUser();
      setCurrentUser(user);
    }
    loadUser();
  }, []);

  useEffect(() => {
    async function loadStudents() {
      const students = await db.users.where("role").equals("STUDENT").toArray();
      setAllStudents(students);
    }
    loadStudents();
  }, []);

  useEffect(() => {
    async function loadAttendees() {
      const list = await getAttendees(sessionKey);
      setAttendees(list);
    }
    loadAttendees();

    const interval = setInterval(loadAttendees, 3000);
    return () => clearInterval(interval);
  }, [sessionKey]);

  const handleSimulateAll = async () => {
    try {
      const dummyStudents = await db.users
        .where("role")
        .equals("STUDENT")
        .toArray();

      for (const student of dummyStudents) {
        await addAttendee(sessionKey, student.email);
      }

      toast.success(`Simulated attendance for ${dummyStudents.length} students`);
      const updated = await getAttendees(sessionKey);
      setAttendees(updated);
    } catch (error) {
      toast.error("Failed to simulate attendance");
      console.error(error);
    }
  };

  const handleClearAttendance = async () => {
    try {
      await db.attendance.delete(sessionKey);
      setAttendees([]);
      toast.success("Attendance cleared");
    } catch (error) {
      toast.error("Failed to clear attendance");
      console.error(error);
    }
  };

  if (!currentUser) return null;

  const canManage =
    currentUser.role === "LECTURER" || currentUser.role === "COURSE_REP";
  const isStudent = currentUser.role === "STUDENT";

  return (
    <div className="space-y-6">
      {canManage && (
        <>
          <QRGenerator courseCode={courseCode} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#261CC1]" />
                Live Attendance ({attendees.length} present)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900">
                      Demo Mode
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Real multi-device sync requires a backend (e.g., Supabase,
                      Firebase). This demo uses local IndexedDB.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSimulateAll}
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Simulate All Students Scanning
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleClearAttendance}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    Clear Attendance
                  </Button>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allStudents.map((student) => {
                    const isPresent = attendees.includes(student.email);
                    return (
                      <TableRow key={student.email}>
                        <TableCell className="font-medium">
                          {student.name}
                        </TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={isPresent ? "default" : "secondary"}
                            className={
                              isPresent
                                ? "bg-green-600 hover:bg-green-700"
                                : ""
                            }
                          >
                            {isPresent ? "Present" : "Absent"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {attendees.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">
                  No students have marked attendance yet
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}

      {isStudent && <QRScanner />}
    </div>
  );
}
