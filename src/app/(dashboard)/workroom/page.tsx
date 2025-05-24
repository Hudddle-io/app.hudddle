import { Metadata } from "next"; // Import Metadata type
import WorkroomPage from "@/components/pages/workroom";
import React from "react";

// Define metadata for this page
export const metadata: Metadata = {
  title: "App.Hudddle | Workroom",
  description:
    "Collaborate efficiently in your dedicated App.Hudddle Workroom. Manage tasks, share files, and communicate seamlessly with your team.",
  keywords: [
    "App.Hudddle",
    "Workroom",
    "Collaboration",
    "Project Space",
    "Teamwork",
    "Task Management",
    "File Sharing",
  ],
  openGraph: {
    title: "App.Hudddle | Workroom",
    description:
      "Collaborate efficiently in your dedicated App.Hudddle Workroom. Manage tasks, share files, and communicate seamlessly with your team.",
    url: "https://app-hudddle.vercel.app/workroom", // Replace with your actual Workroom page URL
    siteName: "App.Hudddle",
    images: [
      {
        url: "https://app-hudddle.vercel.app/og-image-workroom.jpg", // Path to a specific image for your workroom page
        width: 1200,
        height: 630,
        alt: "App.Hudddle Workroom",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "App.Hudddle | Workroom",
    description:
      "Collaborate efficiently in your dedicated App.Hudddle Workroom. Manage tasks, share files, and communicate seamlessly with your team.",
    creator: "@your_twitter_handle", // Replace with your organization's Twitter handle
    images: ["https://app-hudddle.vercel.app/twitter-image-workroom.jpg"], // Path to Twitter card image
  },
  // If this Workroom URL should be the primary URL for its content
  // canonical: 'https://app-hudddle.vercel.app/workroom',
};

const Workroom: React.FC = () => {
  return (
    <>
      <WorkroomPage />
    </>
  );
};

export default Workroom;
