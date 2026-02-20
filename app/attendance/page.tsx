"use client";

import { useState, useEffect } from "react";
import { QRGenerator } from "@/components/QRGenerator";
import { QRScanner } from "@/components/QRScanner";
import { AttendanceLiveView } from "@/components/AttendanceLiveView";
import { UserSwitcher } from "@/components/UserSwitcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser, type MockUser } from "@/lib/mock-users";
import { Calendar } from "lucide-react";

export default function AttendancePage() {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const courseCode = "CSC101";
  const sessionDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setMounted(true);
    const user = getCurrentUser();
    setCurrentUser(user);
  }, []);

  if (!mounted || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  const canManage =
    currentUser.role === "LECTURER" || currentUser.role === "COURSE_REP";
  const isStudent = currentUser.role === "STUDENT";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">
            QR-based attendance tracking for {courseCode}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#261CC1]" />
            Current Session
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Course Code
              </p>
              <p className="text-lg font-semibold">{courseCode}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Session Date
              </p>
              <p className="text-lg font-semibold">{sessionDate}</p>
            </div>
          </div>
          <UserSwitcher />
        </CardContent>
      </Card>

      {canManage && (
        <div className="grid gap-6 lg:grid-cols-2">
          <QRGenerator courseCode={courseCode} />
          <AttendanceLiveView
            courseCode={courseCode}
            sessionDate={sessionDate}
          />
        </div>
      )}

      {isStudent && (
        <div className="max-w-md mx-auto">
          <QRScanner />
        </div>
      )}
    </div>
  );
}
