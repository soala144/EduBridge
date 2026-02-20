"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { QrCode } from "lucide-react";

interface QRGeneratorProps {
  courseCode: string;
}

export function QRGenerator({ courseCode }: QRGeneratorProps) {
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showQR, setShowQR] = useState(false);

  const qrData = JSON.stringify({
    courseCode,
    sessionDate,
    action: "mark_attendance",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-[#261CC1]" />
          Generate Attendance QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Session Date</label>
          <Input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />
        </div>
        <Button
          className="w-full bg-[#261CC1] hover:bg-[#1e1499]"
          onClick={() => setShowQR(!showQR)}
        >
          {showQR ? "Hide QR Code" : "Generate QR Code"}
        </Button>
        {showQR && (
          <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg border">
            <QRCode value={qrData} size={256} fgColor="#261CC1" />
            <div className="text-center space-y-1">
              <p className="text-sm font-semibold text-[#261CC1]">
                {courseCode}
              </p>
              <p className="text-sm text-muted-foreground">{sessionDate}</p>
              <p className="text-xs text-muted-foreground mt-2">
                Students scan this code to mark attendance
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
