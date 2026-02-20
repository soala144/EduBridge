import Dexie, { type EntityTable } from "dexie";

export interface User {
  id?: number;
  email: string;
  name: string;
  role: "STUDENT" | "COURSE_REP" | "LECTURER";
  matricNumber?: string;
}

export interface Course {
  id?: number;
  code: string;
  title: string;
  creditUnits: number;
  level: string;
  semester: string;
}

export interface AttendanceSession {
  sessionKey: string;
  attendees: string[];
  createdAt: Date;
}

export interface Alert {
  id?: number;
  courseCode: string;
  message: string;
  createdBy: string;
  timestamp: Date;
}

export interface Resource {
  id?: number;
  courseCode: string;
  title: string;
  url: string;
  uploadedBy: string;
}

const db = new Dexie("EduBridgeDB") as Dexie & {
  users: EntityTable<User, "id">;
  courses: EntityTable<Course, "id">;
  attendance: EntityTable<AttendanceSession, "sessionKey">;
  alerts: EntityTable<Alert, "id">;
  resources: EntityTable<Resource, "id">;
};

db.version(1).stores({
  users: "++id, &email, name, role, matricNumber",
  courses: "++id, &code, title, creditUnits, level, semester",
  attendance: "sessionKey, attendees, createdAt",
  alerts: "++id, courseCode, message, createdBy, timestamp",
  resources: "++id, courseCode, title, url, uploadedBy",
});

const CURRENT_USER_KEY = "edubridge_current_user";

export async function seedDatabase() {
  const userCount = await db.users.count();
  if (userCount > 0) return;

  await db.users.bulkAdd([
    {
      email: "lecturer@uni.ng",
      name: "Dr. Adewale Johnson",
      role: "LECTURER",
    },
    {
      email: "rep@uni.ng",
      name: "Course Rep Ada",
      role: "COURSE_REP",
      matricNumber: "2020/100001",
    },
    {
      email: "student1@uni.ng",
      name: "Favour Igibks",
      role: "STUDENT",
      matricNumber: "2020/123456",
    },
    {
      email: "student2@uni.ng",
      name: "Chidi Okafor",
      role: "STUDENT",
      matricNumber: "2020/123457",
    },
    {
      email: "student3@uni.ng",
      name: "Amina Bello",
      role: "STUDENT",
      matricNumber: "2020/123458",
    },
    {
      email: "student4@uni.ng",
      name: "Tunde Williams",
      role: "STUDENT",
      matricNumber: "2020/123459",
    },
  ]);

  await db.courses.bulkAdd([
    {
      code: "CSC101",
      title: "Introduction to Computer Science",
      creditUnits: 3,
      level: "100",
      semester: "First",
    },
    {
      code: "CSC201",
      title: "Data Structures and Algorithms",
      creditUnits: 3,
      level: "200",
      semester: "First",
    },
  ]);

  await db.resources.bulkAdd([
    {
      courseCode: "CSC101",
      title: "Week 1 Lecture Notes",
      url: "#",
      uploadedBy: "lecturer@uni.ng",
    },
    {
      courseCode: "CSC101",
      title: "Introduction to Programming",
      url: "#",
      uploadedBy: "lecturer@uni.ng",
    },
  ]);

  await db.alerts.bulkAdd([
    {
      courseCode: "CSC101",
      message: "Welcome to CSC101! First class is on Monday.",
      createdBy: "lecturer@uni.ng",
      timestamp: new Date(),
    },
  ]);
}

export async function getCurrentUser(): Promise<User | null> {
  if (typeof window === "undefined") return null;
  const email = localStorage.getItem(CURRENT_USER_KEY);
  if (!email) return null;
  return (await db.users.where("email").equals(email).first()) || null;
}

export async function setCurrentUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, user.email);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export async function addAttendee(sessionKey: string, email: string) {
  const session = await db.attendance.get(sessionKey);
  if (session) {
    if (!session.attendees.includes(email)) {
      session.attendees.push(email);
      await db.attendance.put(session);
    }
  } else {
    await db.attendance.add({
      sessionKey,
      attendees: [email],
      createdAt: new Date(),
    });
  }
}

export async function getAttendees(sessionKey: string): Promise<string[]> {
  const session = await db.attendance.get(sessionKey);
  return session?.attendees || [];
}

export async function addAlert(
  courseCode: string,
  message: string,
  createdBy: string
) {
  await db.alerts.add({
    courseCode,
    message,
    createdBy,
    timestamp: new Date(),
  });
}

export async function getAlerts(courseCode?: string): Promise<Alert[]> {
  if (courseCode) {
    return await db.alerts.where("courseCode").equals(courseCode).toArray();
  }
  return await db.alerts.toArray();
}

export async function getResources(courseCode: string): Promise<Resource[]> {
  return await db.resources.where("courseCode").equals(courseCode).toArray();
}

export async function addResource(
  courseCode: string,
  title: string,
  url: string,
  uploadedBy: string
) {
  await db.resources.add({
    courseCode,
    title,
    url,
    uploadedBy,
  });
}

export { db };
