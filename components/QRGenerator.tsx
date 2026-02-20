"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QRCode from "react-qr-code";
import { QrCode, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface QRGeneratorProps {
  courseCode: string;
}

export function QRGenerator({ courseCode }: QRGeneratorProps) {
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate URL for students to scan
  const attendanceUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/mark-attendance?courseCode=${courseCode}&sessionDate=${sessionDate}`
    : "";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(attendanceUrl);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

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
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg border">
              <QRCode value={attendanceUrl} size={256} fgColor="#261CC1" />
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
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Or share this link:</label>
              <div className="flex gap-2">
                <Input
                  value={attendanceUrl}
                  readOnly
                  className="text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
