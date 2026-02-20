"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User } from "lucide-react";
import { toast } from "sonner";

export function MarkAttendanceForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const courseCode = searchParams.get("courseCode");
  const sessionDate = searchParams.get("sessionDate");

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [matNumber, setMatNumber] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!courseCode || !sessionDate)) {
      toast.error("Invalid QR code data");
      router.push("/attendance");
    }
  }, [mounted, courseCode, sessionDate, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !userEmail) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseCode,
          sessionDate,
          userName,
          userEmail,
          matNumber,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        toast.success("Attendance marked successfully! ✓");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to mark attendance");
      }
    } catch (error) {
      toast.error("Error marking attendance");
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-600">
                Attendance Marked!
              </h2>
              <p className="text-muted-foreground mt-2">
                Your attendance has been recorded successfully.
              </p>
            </div>
            <div className="space-y-2 text-left bg-muted p-4 rounded-lg">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name:</span>
                <span className="text-sm font-medium">{userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Course:</span>
                <span className="text-sm font-medium">{courseCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Date:</span>
                <span className="text-sm font-medium">{sessionDate}</span>
              </div>
            </div>
            <Button
              className="w-full bg-[#261CC1] hover:bg-[#1e1499]"
              onClick={() => router.push("/attendance")}
            >
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#261CC1]/10 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-lg bg-[#261CC1] flex items-center justify-center mb-4">
            <User className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Mark Your Attendance</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Please enter your details to complete attendance
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Course:</span>
              <Badge variant="secondary">{courseCode}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Date:</span>
              <span className="text-sm font-medium">{sessionDate}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., John Doe"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="e.g., john@uni.ng"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Matric Number (Optional)
              </label>
              <Input
                placeholder="e.g., 2020/123456"
                value={matNumber}
                onChange={(e) => setMatNumber(e.target.value)}
                disabled={submitting}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#261CC1] hover:bg-[#1e1499]"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Mark Attendance"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
