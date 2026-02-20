"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface AttendanceLiveViewProps {
  courseCode: string;
  sessionDate: string;
}

interface Attendee {
  userName: string;
  userEmail: string;
  matNumber: string | null;
  markedAt: Date;
}

export function AttendanceLiveView({
  courseCode,
  sessionDate,
}: AttendanceLiveViewProps) {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchAttendees = async () => {
    try {
      const response = await fetch(
        `/api/attendance/list?courseCode=${courseCode}&sessionDate=${sessionDate}`
      );
      if (response.ok) {
        const data = await response.json();
        setAttendees(data.attendees);
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error("Error fetching attendees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
    const interval = setInterval(fetchAttendees, 3000);
    return () => clearInterval(interval);
  }, [courseCode, sessionDate]);

  const handleSimulateDummies = async () => {
    const dummyStudents = [
      { userName: "Favour Igibks", userEmail: "student1@uni.ng", matNumber: "2020/123456" },
      { userName: "Chidi Okafor", userEmail: "student2@uni.ng", matNumber: "2020/123457" },
      { userName: "Amina Bello", userEmail: "student3@uni.ng", matNumber: "2020/123458" },
      { userName: "Tunde Williams", userEmail: "student4@uni.ng", matNumber: "2020/123459" },
      { userName: "Ngozi Eze", userEmail: "student5@uni.ng", matNumber: "2020/123460" },
      { userName: "Ibrahim Musa", userEmail: "student6@uni.ng", matNumber: "2020/123461" },
      { userName: "Blessing Okoro", userEmail: "student7@uni.ng", matNumber: "2020/123462" },
      { userName: "David Adeyemi", userEmail: "student8@uni.ng", matNumber: "2020/123463" },
    ];

    try {
      for (const student of dummyStudents) {
        await fetch("/api/attendance/mark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseCode,
            sessionDate,
            userName: student.userName,
            userEmail: student.userEmail,
            matNumber: student.matNumber,
          }),
        });
      }
      toast.success("Demo attendance added for 8 students!");
      await fetchAttendees();
    } catch (error) {
      toast.error("Failed to simulate attendance");
      console.error(error);
    }
  };

  const handleExportCSV = () => {
    const url = `/api/attendance/export?courseCode=${courseCode}&sessionDate=${sessionDate}`;
    window.open(url, "_blank");
    toast.success("Downloading attendance CSV...");
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#261CC1]" />
            Live Attendance ({attendees.length} present)
          </CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Auto-refresh: 3s</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">
                Live Polling Active
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Attendance list updates every 3 seconds. Last update:{" "}
                {lastUpdate.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCSV}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {attendees.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">
            No students have marked attendance yet
          </p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Matric Number</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((attendee, index) => (
                  <TableRow key={attendee.userEmail}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {attendee.userName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {attendee.userEmail}
                    </TableCell>
                    <TableCell className="text-sm">
                      {attendee.matNumber || "-"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(attendee.markedAt).toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-600 hover:bg-green-700">
                        Present
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Present:</span>
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {attendees.length}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
