import FriendsPage from "@/components/pages/friends";

interface TabProps {
    searchParams: { tab?: string; page?: string };
}

const Friends = ({ searchParams }: TabProps) => {
    const tab = searchParams?.tab || 'all-friends';
    const page = parseInt(searchParams?.page || '1', 10);

    return (
        <main>
            <FriendsPage tab={tab} page={page} />
        </main>
    );
};

export default Friends;
