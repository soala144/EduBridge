"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import { getCurrentUser, type MockUser } from "@/lib/mock-users";
import { toast } from "sonner";

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
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

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[#261CC1]" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input defaultValue={currentUser.name} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input defaultValue={currentUser.email} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Role</label>
            <Input defaultValue={currentUser.role} disabled />
          </div>
          <Button
            className="bg-[#261CC1] hover:bg-[#1e1499]"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
