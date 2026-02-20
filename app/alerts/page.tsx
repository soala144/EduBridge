"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Bell, Plus, AlertCircle } from "lucide-react";
import { getCurrentUser, type MockUser } from "@/lib/mock-users";
import { toast } from "sonner";

const mockAlerts = [
  {
    id: "1",
    courseCode: "CSC101",
    title: "Class Venue Change",
    message: "Tomorrow's class moved to LT2",
    priority: "high",
    createdBy: "Dr. Adewale Johnson",
    timestamp: "2024-02-15T10:30:00",
  },
  {
    id: "2",
    courseCode: "CSC101",
    title: "New Lecture Notes",
    message: "Week 5 notes uploaded to resources",
    priority: "medium",
    createdBy: "Dr. Adewale Johnson",
    timestamp: "2024-02-14T14:20:00",
  },
  {
    id: "3",
    courseCode: "CSC201",
    title: "Assignment Reminder",
    message: "Assignment 2 due in 3 days",
    priority: "high",
    createdBy: "Prof. Chioma Nwosu",
    timestamp: "2024-02-13T09:15:00",
  },
  {
    id: "4",
    courseCode: "CSC201",
    title: "Office Hours",
    message: "Extra office hours this Friday 2-4pm",
    priority: "low",
    createdBy: "Prof. Chioma Nwosu",
    timestamp: "2024-02-12T16:45:00",
  },
];

export default function AlertsPage() {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const canCreate =
    currentUser.role === "LECTURER" || currentUser.role === "COURSE_REP";

  const handleCreateAlert = () => {
    toast.success("Alert created successfully!");
    setShowCreateForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alerts</h2>
          <p className="text-muted-foreground">
            Course announcements and notifications
          </p>
        </div>
        {canCreate && (
          <Button
            className="bg-[#261CC1] hover:bg-[#1e1499]"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        )}
      </div>

      {showCreateForm && canCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Course Code</label>
              <Input placeholder="e.g., CSC101" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Alert title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Alert message" rows={4} />
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-[#261CC1] hover:bg-[#1e1499]"
                onClick={handleCreateAlert}
              >
                Create Alert
              </Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#261CC1]" />
            All Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 border rounded-lg space-y-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{alert.courseCode}</Badge>
                      <Badge
                        variant={
                          alert.priority === "high"
                            ? "destructive"
                            : alert.priority === "medium"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {alert.priority}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-lg">{alert.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>By {alert.createdBy}</span>
                      <span>
                        {new Date(alert.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {alert.priority === "high" && (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
