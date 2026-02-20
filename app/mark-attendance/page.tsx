"use client";

import { Suspense } from "react";
import { MarkAttendanceForm } from "@/components/MarkAttendanceForm";

export default function MarkAttendancePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    }>
      <MarkAttendanceForm />
    </Suspense>
  );
}
