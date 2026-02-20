"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

interface UserInputFormProps {
  onSubmit: (data: { userName: string; userEmail: string; matNumber: string }) => void;
}

export function UserInputForm({ onSubmit }: UserInputFormProps) {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [matNumber, setMatNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && userEmail) {
      onSubmit({ userName, userEmail, matNumber });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-[#261CC1]" />
          Enter Your Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              placeholder="e.g., John Doe"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              type="email"
              placeholder="e.g., john@uni.ng"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              required
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
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#261CC1] hover:bg-[#1e1499]"
          >
            Continue to Scanner
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
