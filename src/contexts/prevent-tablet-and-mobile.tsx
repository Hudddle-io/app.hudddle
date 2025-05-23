"use client";

import { HTMLAttributes, useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "framer-motion"; // Import motion and useAnimation

interface PreventTabletAndMobileProps extends HTMLAttributes<HTMLDivElement> {}

export default function PreventTabletAndMobileWrapper({
  children,
  className,
  ...props
}: PreventTabletAndMobileProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const route = usePathname();
  console.log(route);

  // Use useAnimation hook for more imperative control over animations
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  useEffect(() => {
    const updateScreenSize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    updateScreenSize();
    window.addEventListener("resize", updateScreenSize);

    return () => {
      window.removeEventListener("resize", updateScreenSize);
    };
  }, []);

  useEffect(() => {
    // Function to generate random values for animation properties
    const getRandom = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const startBlobAnimation = (controls: any, delay = 0) => {
      controls.start({
        // Animate x and y within a larger range to ensure movement across the screen
        x: [
          0,
          getRandom(-200, 200),
          getRandom(-200, 200),
          getRandom(-200, 200),
          0,
        ],
        y: [
          0,
          getRandom(-200, 200),
          getRandom(-200, 200),
          getRandom(-200, 200),
          0,
        ],
        scale: [
          1,
          getRandom(0.8, 1.3),
          getRandom(0.8, 1.3),
          getRandom(0.8, 1.3),
          1,
        ],
        // Animate borderRadius for shape shifting
        borderRadius: [
          "50%",
          `${getRandom(30, 70)}% ${getRandom(30, 70)}% ${getRandom(
            30,
            70
          )}% ${getRandom(30, 70)}% / ${getRandom(30, 70)}% ${getRandom(
            30,
            70
          )}% ${getRandom(30, 70)}% ${getRandom(30, 70)}%`,
          "50%",
        ],
        // Animate filter for blur changing
        filter: [`blur(50px)`, `blur(${getRandom(40, 70)}px)`, `blur(50px)`],
        transition: {
          duration: getRandom(10, 20), // Duration of each animation cycle
          ease: "easeInOut",
          repeat: Infinity, // Loop indefinitely
          repeatType: "reverse", // Go back and forth
          delay: delay, // Stagger initial start
        },
      });
    };

    if (isMobile) {
      startBlobAnimation(controls1, 0);
      startBlobAnimation(controls2, 5); // Stagger start by 5 seconds
      startBlobAnimation(controls3, 10); // Stagger start by 10 seconds
    } else {
      // Stop animations when not mobile to prevent memory leaks
      controls1.stop();
      controls2.stop();
      controls3.stop();
    }
  }, [isMobile, controls1, controls2, controls3]); // Add controls to dependency array

  return (
    <main
      className={cn(
        `w-full h-full flex items-center justify-center fixed top-0 left-0 ${
          isMobile && "bg-gradient-to-br from-purple-800 to-indigo-900"
        }`, // Darker gradient background for better glass effect
        className
      )}
      {...props}
    >
      {isMobile ? (
        <>
          {/* Background Blobs Container */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Blob 1: Purple Gradient */}
            <motion.div
              className="blob absolute rounded-full opacity-60"
              style={{
                backgroundImage: "linear-gradient(to right, #a78bfa, #d8b4fe)",
              }}
              initial={{
                x: -150,
                y: -150,
                scale: 1,
                borderRadius: "50%",
                filter: "blur(50px)",
              }} // Initial position for visibility
              animate={controls1}
            />
            {/* Blob 2: Blue Gradient */}
            <motion.div
              className="blob absolute rounded-full opacity-60"
              style={{
                backgroundImage: "linear-gradient(to right, #60a5fa, #93c5fd)",
              }}
              initial={{
                x: 150,
                y: 150,
                scale: 1,
                borderRadius: "50%",
                filter: "blur(50px)",
              }} // Initial position for visibility
              animate={controls2}
            />
            {/* Blob 3: Green Gradient */}
            <motion.div
              className="blob absolute rounded-full opacity-60"
              style={{
                backgroundImage: "linear-gradient(to right, #34d399, #6ee7b7)",
              }}
              initial={{
                x: -100,
                y: 100,
                scale: 1,
                borderRadius: "50%",
                filter: "blur(50px)",
              }} // Initial position for visibility
              animate={controls3}
            />
          </div>

          {/* Glass Text Container */}
          <div className="relative z-10 p-8 rounded-xl backdrop-blur-xl bg-white bg-opacity-10 border border-white border-opacity-20 text-white text-center shadow-lg w-11/12 max-w-md">
            {" "}
            {/* Responsive width and max-width */}
            <h3 className="font-bold text-[#e0e0e0] text-[clamp(1.5rem,_5vw_+_1rem,_2.5rem)]">
              {" "}
              {/* Responsive text with clamp */}
              Please use Our PC version for the full Huddle experience
            </h3>
          </div>

          <style jsx>{`
            .blob {
              width: 150px; /* Base size */
              height: 150px; /* Base size */
              will-change: transform, border-radius, filter;
              /* Initial positioning is now handled by 'initial' prop in motion.div */
              /* Specific sizes for different blobs if desired, or let random scale handle it */
              /* .blob:nth-child(2) { width: 200px; height: 200px; } */
              /* .blob:nth-child(3) { width: 180px; height: 180px; } */
            }
          `}</style>
        </>
      ) : (
        children
      )}
    </main>
  );
}
