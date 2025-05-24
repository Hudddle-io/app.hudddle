import { Metadata } from "next"; // Import Metadata type
import FriendsPageContent from "@/components/pages/friends"; // Assuming this is your actual client component

// Define metadata for this page
export const metadata: Metadata = {
  title: "App.Hudddle | Friends",
  description:
    "Connect with your friends on App.Hudddle. View all your connections, manage friend requests, and discover new collaborators.",
  keywords: [
    "App.Hudddle",
    "Friends",
    "Connections",
    "Social",
    "Networking",
    "Friend Requests",
    "Collaborators",
  ],
  openGraph: {
    title: "App.Hudddle | Friends",
    description:
      "Connect with your friends on App.Hudddle. View all your connections, manage friend requests, and discover new collaborators.",
    url: "https://app-hudddle.vercel.app/friends", // Replace with your actual Friends page URL
    siteName: "App.Hudddle",
    images: [
      {
        url: "https://app-hudddle.vercel.app/og-image-friends.jpg", // Path to a specific image for your friends page
        width: 1200,
        height: 630,
        alt: "App.Hudddle Friends Page",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "App.Hudddle | Friends",
    description:
      "Connect with your friends on App.Hudddle. View all your connections, manage friend requests, and discover new collaborators.",
    creator: "@your_twitter_handle", // Replace with your organization's Twitter handle
    images: ["https://app-hudddle.vercel.app/twitter-image-friends.jpg"], // Path to Twitter card image
  },
  // If this Friends URL should be the primary URL for its content
  // canonical: 'https://app-hudddle.vercel.app/friends',
};

// app/friends/page.tsx (or equivalent route file)

interface TabProps {
  searchParams: { tab?: string; page?: string };
}

// This is a Server Component by default in Next.js app router
const Friends = ({ searchParams }: TabProps) => {
  const tab = searchParams?.tab || "all-friends";
  // Ensure page is a number, default to 1
  const page = parseInt(searchParams?.page || "1", 10);

  return (
    <main>
      {/* Pass tab and page down to the client component */}
      <FriendsPageContent tab={tab} page={page} />
    </main>
  );
};

export default Friends;
