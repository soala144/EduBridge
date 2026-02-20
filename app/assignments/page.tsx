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
import { FileText, Upload, Plus } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const mockAssignments = [
  {
    id: "1",
    courseCode: "CSC101",
    title: "Algorithm Analysis Report",
    dueDate: "2024-02-20",
    status: "pending",
    score: null,
    maxScore: 100,
  },
  {
    id: "2",
    courseCode: "CSC101",
    title: "Data Structure Implementation",
    dueDate: "2024-02-15",
    status: "submitted",
    score: 85,
    maxScore: 100,
  },
  {
    id: "3",
    courseCode: "CSC201",
    title: "Database Design Project",
    dueDate: "2024-02-25",
    status: "pending",
    score: null,
    maxScore: 100,
  },
  {
    id: "4",
    courseCode: "CSC201",
    title: "Complexity Analysis",
    dueDate: "2024-02-10",
    status: "graded",
    score: 92,
    maxScore: 100,
  },
];

export default function AssignmentsPage() {
  const { currentUser, isLoading } = useUser();
  const [mounted, setMounted] = useState(false);

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

  const isLecturer = currentUser.role === "LECTURER";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assignments</h2>
          <p className="text-muted-foreground">
            Manage and submit course assignments
          </p>
        </div>
        {isLecturer && (
          <Button className="bg-[#261CC1] hover:bg-[#1e1499]">
            <Plus className="h-4 w-4 mr-2" />
            Create Assignment
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#261CC1]" />
            All Assignments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">
                    {assignment.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{assignment.courseCode}</Badge>
                  </TableCell>
                  <TableCell>{assignment.dueDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assignment.status === "graded"
                          ? "default"
                          : assignment.status === "submitted"
                          ? "secondary"
                          : "outline"
                      }
                      className={
                        assignment.status === "graded"
                          ? "bg-green-600 hover:bg-green-700"
                          : ""
                      }
                    >
                      {assignment.status.charAt(0).toUpperCase() +
                        assignment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {assignment.score !== null
                      ? `${assignment.score}/${assignment.maxScore}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {assignment.status === "pending" && !isLecturer && (
                      <Button
                        size="sm"
                        className="bg-[#261CC1] hover:bg-[#1e1499]"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                    )}
                    {assignment.status !== "pending" && (
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    )}
                    {isLecturer && (
                      <Button variant="ghost" size="sm">
                        Grade
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
