export type UserRole = "LECTURER" | "COURSE_REP" | "STUDENT";

export interface MockUser {
  email: string;
  name: string;
  role: UserRole;
}

export const MOCK_USERS: MockUser[] = [
  {
    email: "lecturer@uni.ng",
    name: "Dr. Adewale Johnson",
    role: "LECTURER",
  },
  {
    email: "rep@uni.ng",
    name: "Course Rep Ada",
    role: "COURSE_REP",
  },
  {
    email: "student1@uni.ng",
    name: "Favour Igibks",
    role: "STUDENT",
  },
  {
    email: "student2@uni.ng",
    name: "Chidi Okafor",
    role: "STUDENT",
  },
  {
    email: "student3@uni.ng",
    name: "Amina Bello",
    role: "STUDENT",
  },
];

export function getCurrentUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("currentUser");
  if (!stored) return MOCK_USERS[0];
  return JSON.parse(stored);
}

export function setCurrentUser(user: MockUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem("currentUser", JSON.stringify(user));
}
