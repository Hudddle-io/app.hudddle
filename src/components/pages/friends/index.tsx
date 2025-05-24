// components/pages/friends/FriendsPageContent.tsx
"use client";
import React, { useState, useEffect } from "react";
import FriendsHeader from "./header";
import FriendList from "./friend-list";
import { useUserSession } from "@/contexts/useUserSession"; // Assuming this context is correctly implemented
import LoadingPage from "@/components/shared/loading-page"; // Assuming you have this component
import { redirect } from "next/navigation"; // For redirection

interface FriendsPageContentProps {
  tab: string;
  page: number;
}

const FriendsPageContent: React.FC<FriendsPageContentProps> = ({
  tab,
  page,
}) => {
  const { currentUser, loading, error } = useUserSession();
  // Use a refreshKey to trigger re-fetching in FriendList
  const [refreshKey, setRefreshKey] = useState(0);

  // Handle redirection if user session is not found and not loading
  useEffect(() => {
    if (!loading && !currentUser && !error) {
      // Assuming you have a login route to redirect to
      redirect("/login"); // Or handle authentication flow as per your app
    }
  }, [currentUser, loading, error]);

  if (loading) {
    return <LoadingPage loadingText="Loading user session..." />;
  }

  if (error) {
    return (
      <p className="text-center mt-20 text-red-500">
        Error loading user session: {error}
      </p>
    );
  }

  if (!currentUser) {
    // This case should ideally be handled by the redirect above, but as a fallback
    return (
      <p className="text-center mt-20 text-red-500">User not authenticated.</p>
    );
  }

  // Callback to trigger a refresh in FriendList
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="pt-8 pb-10 px-12">
      {/* Pass the refresh handler to FriendsHeader */}
      <FriendsHeader searchPage={false} onFriendRequestSent={handleRefresh} />
      {/* Pass the refreshKey to FriendList */}
      <FriendList
        tab={tab}
        page={page}
        refreshKey={refreshKey}
        onActionComplete={handleRefresh}
      />
    </div>
  );
};

export default FriendsPageContent;

// Metadata should be defined in a Server Component or the layout file in Next.js 13+ app router.
// If this file were app/friends/page.tsx, then metadata would be exported directly from here.
// Since it's a client component, metadata should be in the parent Server Component or layout.
// export const metadata: Metadata = {
//   title: "Hudddle | Friends",
// };
