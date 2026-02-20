"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db, seedDatabase, setCurrentUser, type User } from "@/lib/db";

export default function LoginPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      await seedDatabase();
      const allUsers = await db.users.toArray();
      setUsers(allUsers);
      setLoading(false);
    }
    init();
  }, []);

  const handleSignIn = async () => {
    if (!selectedEmail) return;
    const user = users.find((u) => u.email === selectedEmail);
    if (user) {
      await setCurrentUser(user);
      router.push("/dashboard");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#261CC1]/10 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-lg bg-[#261CC1] flex items-center justify-center mb-4">
            <span className="text-white font-bold text-2xl">EB</span>
          </div>
          <CardTitle className="text-2xl">Welcome to EduBridge</CardTitle>
          <p className="text-sm text-muted-foreground">
            Select a user to sign in (Demo Mode)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select User</label>
            <Select value={selectedEmail} onValueChange={setSelectedEmail}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user..." />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.email} value={user.email}>
                    {user.name} ({user.role})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full bg-[#261CC1] hover:bg-[#1e1499]"
            onClick={handleSignIn}
            disabled={!selectedEmail}
          >
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
