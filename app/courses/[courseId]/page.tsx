"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockCourses, mockUser } from "@/lib/mock-data";
import {
  BookOpen,
  Calendar,
  Bell,
  Library,
  MessageSquare,
  FileText,
  Upload,
  QrCode,
  Star,
  Download,
} from "lucide-react";
import { use } from "react";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const course = mockCourses.find((c) => c.id === courseId);

  if (!course) {
    return <div>Course not found</div>;
  }

  const isLecturer = mockUser.role === "LECTURER";
  const isRep = mockUser.role === "COURSE_REP";
  const canManage = isLecturer || isRep;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-14 w-14 rounded-lg bg-[#261CC1]/10 flex items-center justify-center">
              <BookOpen className="h-7 w-7 text-[#261CC1]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{course.code}</h2>
              <p className="text-lg text-muted-foreground">{course.title}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Badge variant="secondary">{course.level} Level</Badge>
            <Badge variant="secondary">{course.semester} Semester</Badge>
            <Badge variant="secondary">{course.creditUnits} Units</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
                <p className="mt-1">{course.description}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Lecturer
                </p>
                <p className="mt-1">{course.lecturer}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Level
                  </p>
                  <p className="mt-1">{course.level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Semester
                  </p>
                  <p className="mt-1">{course.semester}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Credit Units
                  </p>
                  <p className="mt-1">{course.creditUnits}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#261CC1]" />
                Attendance Records
              </CardTitle>
              {canManage && (
                <Button className="bg-[#261CC1] hover:bg-[#1e1499]">
                  <QrCode className="h-4 w-4 mr-2" />
                  Generate QR Code
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Session</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Marked By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      date: "2024-02-15",
                      session: "Lecture 1",
                      status: "Present",
                      markedBy: "Dr. Johnson",
                    },
                    {
                      date: "2024-02-12",
                      session: "Lecture 2",
                      status: "Present",
                      markedBy: "Course Rep",
                    },
                    {
                      date: "2024-02-08",
                      session: "Lecture 3",
                      status: "Absent",
                      markedBy: "Dr. Johnson",
                    },
                  ].map((record, i) => (
                    <TableRow key={i}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>{record.session}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            record.status === "Present"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{record.markedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium">Attendance Summary</p>
                <p className="text-2xl font-bold mt-1">85%</p>
                <p className="text-xs text-muted-foreground">
                  17 out of 20 classes attended
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-[#261CC1]" />
                Course Alerts
              </CardTitle>
              {canManage && (
                <Button className="bg-[#261CC1] hover:bg-[#1e1499]">
                  Create Alert
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  title: "Class Venue Change",
                  message: "Tomorrow's class moved to LT2",
                  priority: "high",
                  date: "2024-02-15",
                },
                {
                  title: "New Lecture Notes",
                  message: "Week 5 notes uploaded to resources",
                  priority: "medium",
                  date: "2024-02-14",
                },
                {
                  title: "Assignment Reminder",
                  message: "Assignment 2 due in 3 days",
                  priority: "high",
                  date: "2024-02-13",
                },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="p-4 border rounded-lg space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.message}
                      </p>
                    </div>
                    <Badge
                      variant={
                        alert.priority === "high" ? "destructive" : "default"
                      }
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.date}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Library className="h-5 w-5 text-[#261CC1]" />
                Course Resources
              </CardTitle>
              {canManage && (
                <Button className="bg-[#261CC1] hover:bg-[#1e1499]">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Resource
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      title: "Week 5 Lecture Notes",
                      type: "PDF",
                      size: "2.4 MB",
                      date: "2024-02-14",
                    },
                    {
                      title: "Algorithm Examples",
                      type: "PDF",
                      size: "1.8 MB",
                      date: "2024-02-10",
                    },
                    {
                      title: "Practice Questions",
                      type: "DOCX",
                      size: "856 KB",
                      date: "2024-02-08",
                    },
                  ].map((resource, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {resource.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{resource.type}</Badge>
                      </TableCell>
                      <TableCell>{resource.size}</TableCell>
                      <TableCell>{resource.date}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-[#261CC1]" />
                Course Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Rating</label>
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-6 w-6 cursor-pointer text-yellow-400 fill-yellow-400"
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Comment</label>
                  <Textarea
                    placeholder="Share your feedback about this course..."
                    className="mt-2"
                    rows={4}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="anonymous" />
                  <label htmlFor="anonymous" className="text-sm">
                    Submit anonymously
                  </label>
                </div>
                <Button className="bg-[#261CC1] hover:bg-[#1e1499]">
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#261CC1]" />
                Assignments
              </CardTitle>
              {isLecturer && (
                <Button className="bg-[#261CC1] hover:bg-[#1e1499]">
                  Create Assignment
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    {
                      title: "Algorithm Analysis Report",
                      dueDate: "2024-02-20",
                      status: "Pending",
                      score: "-",
                    },
                    {
                      title: "Data Structure Implementation",
                      dueDate: "2024-02-15",
                      status: "Submitted",
                      score: "85/100",
                    },
                    {
                      title: "Complexity Analysis",
                      dueDate: "2024-02-10",
                      status: "Graded",
                      score: "92/100",
                    },
                  ].map((assignment, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {assignment.title}
                      </TableCell>
                      <TableCell>{assignment.dueDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            assignment.status === "Graded"
                              ? "default"
                              : assignment.status === "Submitted"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{assignment.score}</TableCell>
                      <TableCell>
                        {assignment.status === "Pending" && (
                          <Button
                            size="sm"
                            className="bg-[#261CC1] hover:bg-[#1e1499]"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Submit
                          </Button>
                        )}
                        {assignment.status !== "Pending" && (
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
