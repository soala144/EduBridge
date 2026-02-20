"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_USERS } from "@/lib/mock-users";
import { useUser } from "@/contexts/UserContext";

export function UserSwitcher() {
  const { currentUser, switchUser } = useUser();

  if (!currentUser) return null;

  const handleUserChange = (email: string) => {
    switchUser(email);
  };

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
