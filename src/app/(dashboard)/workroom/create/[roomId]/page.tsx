import { Metadata } from "next"; // Import Metadata type
import CreateWorkroom from "@/components/pages/workroom/createWorkroom/CreateWorkroom";
import React from "react";

// Define metadata for this page
export const metadata: Metadata = {
  title: "App.Hudddle | Create Workroom",
  description:
    "Easily create a new workroom on App.Hudddle to start a new project, invite collaborators, and organize your tasks.",
  keywords: [
    "App.Hudddle",
    "Create Workroom",
    "New Project",
    "Collaboration Space",
    "Team Setup",
    "Workroom Creation",
  ],
  openGraph: {
    title: "App.Hudddle | Create Workroom",
    description:
      "Easily create a new workroom on App.Hudddle to start a new project, invite collaborators, and organize your tasks.",
    url: "https://app-hudddle.vercel.app/create-workroom", // Replace with your actual Create Workroom page URL
    siteName: "App.Hudddle",
    images: [
      {
        url: "https://app-hudddle.vercel.app/og-image-create-workroom.jpg", // Path to a specific image for this page
        width: 1200,
        height: 630,
        alt: "Create New Workroom on App.Hudddle",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "App.Hudddle | Create Workroom",
    description:
      "Easily create a new workroom on App.Hudddle to start a new project, invite collaborators, and organize your tasks.",
    creator: "@your_twitter_handle", // Replace with your organization's Twitter handle
    images: [
      "https://app-hudddle.vercel.app/twitter-image-create-workroom.jpg",
    ], // Path to Twitter card image
  },
  // If this URL should be the primary URL for its content
  // canonical: 'https://app-hudddle.vercel.app/create-workroom',
};

type Props = {};

const Page = (props: Props) => {
  return (
    <div>
      <CreateWorkroom></CreateWorkroom>
    </div>
  );
};

export default Page;
