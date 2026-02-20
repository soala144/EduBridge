"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";
import { UserInputForm } from "./UserInputForm";

export function QRScanner() {
  const [step, setStep] = useState<"form" | "scanner">("form");
  const [userDetails, setUserDetails] = useState<{
    userName: string;
    userEmail: string;
    matNumber: string;
  } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    setMounted(true);
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleUserDetailsSubmit = (data: {
    userName: string;
    userEmail: string;
    matNumber: string;
  }) => {
    setUserDetails(data);
    setStep("scanner");
  };

  const handleStartScan = async () => {
    try {
      setScanning(true);
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.action === "mark_attendance" && userDetails) {
              await handleMarkAttendance(data.courseCode, data.sessionDate);
              scanner.stop();
              setScanning(false);
            }
          } catch (error) {
            toast.error("Invalid QR code");
          }
        },
        () => {}
      );
    } catch (error) {
      toast.error("Failed to start camera");
      setScanning(false);
    }
  };

  const handleStopScan = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(console.error);
      setScanning(false);
    }
  };

  const handleMarkAttendance = async (
    courseCode: string,
    sessionDate: string
  ) => {
    if (!userDetails) return;

    try {
      const response = await fetch("/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseCode,
          sessionDate,
          userName: userDetails.userName,
          userEmail: userDetails.userEmail,
          matNumber: userDetails.matNumber,
        }),
      });

      if (response.ok) {
        toast.success("Attendance marked successfully!");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to mark attendance");
      }
    } catch (error) {
      toast.error("Error marking attendance");
      console.error(error);
    }
  };

  const handleSimulateScan = async () => {
    const mockData = {
      courseCode: "CSC101",
      sessionDate: new Date().toISOString().split("T")[0],
      action: "mark_attendance",
    };
    await handleMarkAttendance(mockData.courseCode, mockData.sessionDate);
    setScanning(false);
  };

  const handleBack = () => {
    setStep("form");
    setUserDetails(null);
    if (scanning) {
      handleStopScan();
    }
  };

  if (!mounted) return null;

  if (step === "form") {
    return <UserInputForm onSubmit={handleUserDetailsSubmit} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-[#261CC1]" />
          Scan QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">Scanning as:</p>
          <p className="text-sm text-muted-foreground">
            {userDetails?.userName} ({userDetails?.userEmail})
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Scan the QR code displayed by your lecturer to mark your attendance.
        </p>

        {!scanning ? (
          <div className="space-y-2">
            <Button
              className="w-full bg-[#261CC1] hover:bg-[#1e1499]"
              onClick={handleStartScan}
            >
              Start Scanning
            </Button>
            <Button variant="outline" className="w-full" onClick={handleBack}>
              Change Details
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div id="qr-reader" className="w-full"></div>
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-[#261CC1] hover:bg-[#1e1499]"
                onClick={handleSimulateScan}
              >
                Simulate Scan (Demo)
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleStopScan}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
