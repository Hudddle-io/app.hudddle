"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Circle,
  XCircle,
  MonitorPlay,
  Monitor,
  AlertTriangle,
  Image as ImageIcon, // Import Image icon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const GoliveButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const screenshotIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for screenshot interval
  const [screenshots, setScreenshots] = useState<string[]>([]); // State to store screenshots
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const takeScreenshot = async (): Promise<string | null> => {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) return null;

      const video = document.createElement("video");
      video.style.display = "none"; // Hide the video element
      document.body.appendChild(video); // Append to the body

      return new Promise<string>((resolve, reject) => {
        video.addEventListener(
          "loadedmetadata",
          () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/png");

            document.body.removeChild(video); // Remove the video element
            resolve(dataUrl);
          },
          { once: true }
        );
        video.addEventListener("error", reject);

        // Get the current stream from the MediaRecorder if available
        if (mediaRecorder && mediaRecorder.stream) {
          const stream = mediaRecorder.stream;
          video.srcObject = stream;
          video.play().catch((playError) => {
            console.error("Autoplay error:", playError);
            reject(playError);
          });
        } else {
          reject(new Error("No stream available to take screenshot."));
        }
      });
    } catch (error) {
      console.error("Error taking screenshot:", error);
      return null;
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor",
        },
        audio: true,
      });

      if (!stream) {
        return;
      }

      setIsRecording(true);
      setTimeLeft(30 * 60);

      const recorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          // Handle recorded data (e.g., store it, send to server)
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setTimeLeft(null);
        setMediaRecorder(null);
        clearIntervals();
      };

      recorder.start();

      timerIntervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === null || prevTime <= 0) {
            stopScreenShare();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      // Start taking screenshots every 10 seconds
      screenshotIntervalRef.current = setInterval(async () => {
        const screenshot = await takeScreenshot();
        if (screenshot) {
          setScreenshots((prev) => [...prev, screenshot]); // Update state
          console.log("Screenshot taken and stored.");
        }
      }, 10000); // Changed to 10000 for 10 seconds

      recordingTimeoutRef.current = setTimeout(() => {
        if (!recorder.state || recorder.state === "inactive") {
          setIsRecording(false);
        }
      }, 3000);
    } catch (error: any) {
      console.error("Error starting screen share:", error);
      setRecordingError(error.message || "Failed to start screen recording.");
      setIsRecording(false);
      setTimeLeft(null);
      clearIntervals();
    }
  };

  const stopScreenShare = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    setIsRecording(false);
    setTimeLeft(null);
    clearIntervals();
  };

  const clearIntervals = () => {
    clearTimeout(recordingTimeoutRef.current!);
    clearInterval(timerIntervalRef.current!);
    clearInterval(screenshotIntervalRef.current!);
    timerIntervalRef.current = null;
    screenshotIntervalRef.current = null;
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
      clearIntervals();
    };
  }, [mediaRecorder]);

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  return (
    <>
      <div className="space-y-4">
        <Button
          onClick={isRecording ? stopScreenShare : startScreenShare}
          className={cn(
            "px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300",
            isRecording
              ? "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/50 flex items-center gap-2"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50 flex items-center gap-2"
          )}
          disabled={recordingError !== null}
        >
          {isRecording ? (
            <>
              <XCircle className="w-5 h-5" /> Stop Recording
            </>
          ) : (
            <>
              <MonitorPlay className="w-5 h-5" /> Start Screen Share
            </>
          )}
        </Button>
        {recordingError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Recording Error</AlertTitle>
            <AlertDescription>{recordingError}</AlertDescription>
          </Alert>
        )}
      </div>

      {isRecording && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center pointer-events-none"
          style={{
            zIndex: 1000,
          }}
        >
          <div className="absolute top-4 left-4 flex items-center gap-2 text-white text-lg font-semibold bg-red-500/80 px-3 py-1.5 rounded-full border border-red-500/90 shadow-lg shadow-red-500/50 pointer-events-auto">
            <Circle className="w-4 h-4 animate-pulse text-red-400" />
            <span>Recording Screen</span>
          </div>
          <div className="text-white text-2xl font-bold p-4 bg-black/70 rounded-lg border border-white/10 pointer-events-auto flex flex-col items-center">
            <Monitor className="w-12 h-12 mx-auto mb-2 text-blue-400" />
            <p className="text-center">Your screen is being recorded.</p>
            {timeLeft !== null && (
              <p className="text-center text-lg text-red-400 mt-2 font-mono">
                Time Remaining: {formatTime(timeLeft)}
              </p>
            )}
            <p className="text-center text-sm text-gray-300 mt-1">
              This overlay is only visible to you.
            </p>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      <AnimatePresence>
        {screenshots.length > 0 &&
          !isRecording && ( // Show only when not recording
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
              style={{ zIndex: 1001 }} // Ensure it's above the recording overlay
            >
              <motion.div
                initial={{ scale: 0.8, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              >
                <div className="p-4 sm:p-6">
                  <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-blue-400" />
                    Screen Recording Screenshots
                  </h2>
                  <p className="text-gray-400 text-sm mb-4">
                    Here are the screenshots captured during your screen
                    recording.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {screenshots.map((screenshot, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="relative rounded-lg overflow-hidden border border-gray-700 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <Image
                          src={screenshot}
                          alt={`Screenshot ${index + 1}`}
                          className="w-full h-auto object-cover aspect-video"
                        />
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={() => setScreenshots([])} // Clear screenshots on close
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 px-4 py-2 rounded-full transition-colors duration-200"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
};

export default GoliveButton;
