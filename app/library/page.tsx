"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Library, Upload, Download, Search, FileText } from "lucide-react";
import { getCurrentUser, type MockUser } from "@/lib/mock-users";

const mockResources = [
  {
    id: "1",
    courseCode: "CSC101",
    title: "Week 1 Lecture Notes",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "Dr. Adewale Johnson",
    uploadedAt: "2024-02-15",
  },
  {
    id: "2",
    courseCode: "CSC101",
    title: "Introduction to Programming",
    type: "PDF",
    size: "1.8 MB",
    uploadedBy: "Dr. Adewale Johnson",
    uploadedAt: "2024-02-10",
  },
  {
    id: "3",
    courseCode: "CSC201",
    title: "Data Structures Slides",
    type: "PPTX",
    size: "3.2 MB",
    uploadedBy: "Prof. Chioma Nwosu",
    uploadedAt: "2024-02-12",
  },
  {
    id: "4",
    courseCode: "CSC201",
    title: "Algorithm Examples",
    type: "PDF",
    size: "1.5 MB",
    uploadedBy: "Prof. Chioma Nwosu",
    uploadedAt: "2024-02-08",
  },
];

export default function LibraryPage() {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);

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

  const canUpload =
    currentUser.role === "LECTURER" || currentUser.role === "COURSE_REP";

  const filteredResources = mockResources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.courseCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">E-Library</h2>
          <p className="text-muted-foreground">
            Access course materials and resources
          </p>
        </div>
        {canUpload && (
          <Button className="bg-[#261CC1] hover:bg-[#1e1499]">
            <Upload className="h-4 w-4 mr-2" />
            Upload Resource
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Library className="h-5 w-5 text-[#261CC1]" />
            Course Resources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResources.map((resource) => (
                <TableRow key={resource.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#261CC1]" />
                      {resource.title}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{resource.courseCode}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{resource.type}</Badge>
                  </TableCell>
                  <TableCell>{resource.size}</TableCell>
                  <TableCell>{resource.uploadedBy}</TableCell>
                  <TableCell>{resource.uploadedAt}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredResources.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No resources found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
