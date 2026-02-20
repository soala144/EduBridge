import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";
import Link from "next/link";
import { Course } from "@/lib/mock-data";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-[#261CC1]/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-[#261CC1]" />
            </div>
            <div>
              <CardTitle className="text-lg">{course.code}</CardTitle>
              <p className="text-sm text-muted-foreground">{course.title}</p>
            </div>
          </div>
          <Badge variant="secondary">{course.creditUnits} Units</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{course.lecturer}</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{course.level} Level</Badge>
            <Badge variant="outline">{course.semester} Semester</Badge>
          </div>
          <Button asChild className="w-full bg-[#261CC1] hover:bg-[#1e1499]">
            <Link href={`/courses/${course.id}`}>View Course</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
