import { Metadata } from "next"; // Import Metadata type
import PageDashboard from "@/components/pages/dashboard";

// Define metadata for this page
export const metadata: Metadata = {
  title: "App.Hudddle | Dashboard",
  description:
    "Your personalized dashboard for App.Hudddle. Manage your projects, track progress, and collaborate with your team efficiently.",
  keywords: [
    "App.Hudddle",
    "Dashboard",
    "Project Management",
    "Task Tracking",
    "Collaboration",
    "Productivity",
    "Workrooms",
  ],
  openGraph: {
    title: "App.Hudddle | Dashboard",
    description:
      "Your personalized dashboard for App.Hudddle. Manage your projects, track progress, and collaborate with your team efficiently.",
    url: "https://app-hudddle.vercel.app/dashboard", // Replace with your actual dashboard URL
    siteName: "App.Hudddle",
    images: [
      {
        url: "https://app-hudddle.vercel.app/og-image-dashboard.jpg", // Path to a specific image for your dashboard page (e.g., a dashboard screenshot)
        width: 1200,
        height: 630,
        alt: "App.Hudddle Dashboard Overview",
      },
    ],
    type: "website", // or 'profile' if more user-specific
  },
  twitter: {
    card: "summary_large_image",
    title: "App.Hudddle | Dashboard",
    description:
      "Your personalized dashboard for App.Hudddle. Manage your projects, track progress, and collaborate with your team efficiently.",
    creator: "@your_twitter_handle", // Replace with your organization's Twitter handle
    images: ["https://app-hudddle.vercel.app/twitter-image-dashboard.jpg"], // Path to Twitter card image
  },
  // If this dashboard URL should be the primary URL for its content
  // canonical: 'https://app-hudddle.vercel.app/dashboard',
};

const Dashboard: React.FC = () => {
  return (
    <main>
      {/* You might want to consider if Sidebar should be in layout.tsx */}
      {/* <Sidebar /> */}
      <PageDashboard />
    </main>
  );
};

export default Dashboard;
