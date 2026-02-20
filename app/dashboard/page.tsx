import { StatCard } from "@/components/StatCard";
import { CourseCard } from "@/components/CourseCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calendar, FileText, TrendingUp, Bell } from "lucide-react";
import { mockCourses } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Your academic overview at a glance
        </p>
      </div>

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
          value={mockCourses.length}
          icon={BookOpen}
          description="This semester"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#261CC1]" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  course: "CSC 301",
                  message: "Class moved to LT2 tomorrow",
                  time: "2 hours ago",
                  priority: "high",
                },
                {
                  course: "CSC 305",
                  message: "New lecture notes uploaded",
                  time: "5 hours ago",
                  priority: "medium",
                },
                {
                  course: "GST 301",
                  message: "Assignment deadline extended",
                  time: "1 day ago",
                  priority: "low",
                },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0"
                >
                  <Badge
                    variant={
                      alert.priority === "high"
                        ? "destructive"
                        : alert.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                    className="mt-1"
                  >
                    {alert.course}
                  </Badge>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#261CC1]" />
              Upcoming Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  course: "CSC 301",
                  title: "Algorithm Analysis Report",
                  dueDate: "Due in 2 days",
                  status: "pending",
                },
                {
                  course: "CSC 305",
                  title: "Database Design Project",
                  dueDate: "Due in 5 days",
                  status: "in-progress",
                },
                {
                  course: "GST 301",
                  title: "Business Plan Presentation",
                  dueDate: "Due in 1 week",
                  status: "pending",
                },
              ].map((assignment, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between pb-3 border-b last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {assignment.course}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={
                        assignment.status === "in-progress"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {assignment.status === "in-progress"
                        ? "In Progress"
                        : "Pending"}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {assignment.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">My Courses</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
