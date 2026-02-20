export type Role = "STUDENT" | "COURSE_REP" | "LECTURER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  matricNumber?: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  level: string;
  semester: string;
  creditUnits: number;
  lecturer: string;
  description?: string;
}

export const mockUser: User = {
  id: "1",
  name: "Favour Igibks",
  email: "favour@uniport.edu.ng",
  role: "STUDENT",
  matricNumber: "2020/123456",
};

export const mockCourses: Course[] = [
  {
    id: "1",
    code: "CSC 301",
    title: "Data Structures and Algorithms",
    level: "300",
    semester: "First",
    creditUnits: 3,
    lecturer: "Dr. Adewale Johnson",
    description: "Advanced data structures, algorithm design and analysis",
  },
  {
    id: "2",
    code: "CSC 305",
    title: "Database Management Systems",
    level: "300",
    semester: "First",
    creditUnits: 3,
    lecturer: "Prof. Chioma Nwosu",
    description: "Relational databases, SQL, normalization, and transactions",
  },
  {
    id: "3",
    code: "GST 301",
    title: "Entrepreneurship Studies",
    level: "300",
    semester: "First",
    creditUnits: 2,
    lecturer: "Dr. Emmanuel Okafor",
    description: "Business planning, innovation, and startup fundamentals",
  },
];
