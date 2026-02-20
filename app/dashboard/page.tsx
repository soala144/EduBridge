"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, FileText, TrendingUp } from "lucide-react";
import { QRGenerator } from "@/components/QRGenerator";
import { QRScannerSimple } from "@/components/QRScannerSimple";
import { AttendanceLiveView } from "@/components/AttendanceLiveView";
import { UserSwitcher } from "@/components/UserSwitcher";
import { useUser } from "@/contexts/UserContext";

export default function DashboardPage() {
  const { currentUser, isLoading } = useUser();
  const [mounted, setMounted] = useState(false);
  const courseCode = "CSC101";
  const sessionDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading || !currentUser) {
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Your academic overview at a glance
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current User</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg font-semibold">{currentUser.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <Badge variant="secondary" className="text-sm">
                {currentUser.role}
              </Badge>
            </div>
            <UserSwitcher />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Classes"
          value={3}
          icon={Calendar}
          description="2 completed, 1 upcoming"
        />
        <StatCard
          title="Pending Assignments"
          value={5}
          icon={FileText}
          description="2 due this week"
        />
        <StatCard
          title="Attendance Rate"
          value="87%"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
        />
        <StatCard
          title="Enrolled Courses"
          value={2}
          icon={BookOpen}
          description="This semester"
        />
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Quick Attendance - {courseCode}</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {canManage && (
            <>
              <QRGenerator courseCode={courseCode} />
              <AttendanceLiveView
                courseCode={courseCode}
                sessionDate={sessionDate}
              />
            </>
          )}

          {isStudent && <QRScannerSimple />}
        </div>
      </div>
    </div>
  );
}
