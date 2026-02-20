"use client";

import { useState, useEffect } from "react";
import { AttendanceStats } from "@/components/AttendanceStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserSwitcher } from "@/components/UserSwitcher";
import { getCurrentUser, type MockUser } from "@/lib/mock-users";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const courseCode = "CSC101";

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

  const canView =
    currentUser.role === "LECTURER" || currentUser.role === "COURSE_REP";

  if (!canView) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Only lecturers and course reps can view attendance reports.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Attendance Reports
          </h2>
          <p className="text-muted-foreground">
            View attendance statistics and analytics for {courseCode}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-[#261CC1]" />
            Current User
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserSwitcher />
        </CardContent>
      </Card>

      <AttendanceStats courseCode={courseCode} />
    </div>
  );
}
