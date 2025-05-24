// components/pages/friends/index.tsx (This is the original FriendsPage, renamed for clarity)
// This file should actually be the main Friends route component, e.g., app/friends/page.tsx

import FriendsPageContent from "@/components/pages/friends";

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
