"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scan } from "lucide-react";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/navigation";

export function QRScannerSimple() {
  const [scanning, setScanning] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

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
            // Check if it's a URL
            if (decodedText.includes("/mark-attendance")) {
              scanner.stop();
              setScanning(false);
              // Redirect to the attendance page
              window.location.href = decodedText;
            } else {
              toast.error("Invalid QR code. Please scan the attendance QR code.");
            }
          } catch (error) {
            toast.error("Invalid QR code");
          }
        },
        () => {}
      );
    } catch (error) {
      toast.error("Failed to start camera. Please allow camera access.");
      setScanning(false);
    }
  };

  const handleStopScan = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(console.error);
      setScanning(false);
    }
  };

  const handleSimulateScan = () => {
    const mockUrl = `${window.location.origin}/mark-attendance?courseCode=CSC101&sessionDate=${new Date().toISOString().split("T")[0]}`;
    window.location.href = mockUrl;
  };

  if (!mounted) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-[#261CC1]" />
          Scan QR Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSimulateScan}
            >
              Simulate Scan (Demo)
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div id="qr-reader" className="w-full"></div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleStopScan}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
