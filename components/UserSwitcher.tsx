"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_USERS, getCurrentUser, setCurrentUser, type MockUser } from "@/lib/mock-users";

interface UserSwitcherProps {
  onUserChange?: (user: MockUser) => void;
}

export function UserSwitcher({ onUserChange }: UserSwitcherProps) {
  const [currentUser, setCurrentUserState] = useState<MockUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getCurrentUser();
    setCurrentUserState(user);
  }, []);

  const handleUserChange = (email: string) => {
    const user = MOCK_USERS.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
      setCurrentUserState(user);
      if (onUserChange) {
        onUserChange(user);
      }
      window.location.reload();
    }
  };

  if (!mounted || !currentUser) return null;

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">
        Switch User (Demo)
      </label>
      <Select value={currentUser.email} onValueChange={handleUserChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MOCK_USERS.map((user) => (
            <SelectItem key={user.email} value={user.email}>
              {user.name} ({user.role})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
