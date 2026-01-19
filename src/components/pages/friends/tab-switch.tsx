import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";

interface FriendsPageProps {
  currentTab: string;
}
const TabSwitch: React.FC<FriendsPageProps> = ({ currentTab }) => {
  return (
    <div className="mb-6 mt-8 flex justify-between items-center">
      <div className="flex items-end gap-6">
        <Link href={`/friends?tab=${"all-friends"}`}>
          <Button
            className={`bg-transparent hover:bg-transparent px-0 rounded-none pb-2 text-sm ${
              currentTab === "all-friends"
                ? "text-custom-purple border-b-2 border-custom-purple"
                : "text-purple-300 border-b-2 border-transparent"
            } hover:text-custom-purple`}
          >
            All friends
          </Button>
        </Link>
        <Link href={`/friends?tab=${"pending-invites"}`}>
          <Button
            className={`bg-transparent hover:bg-transparent px-0 rounded-none pb-2 text-sm ${
              currentTab === "pending-invites"
                ? "text-custom-purple border-b-2 border-custom-purple"
                : "text-purple-300 border-b-2 border-transparent"
            } hover:text-custom-purple`}
          >
            Pending
          </Button>
        </Link>
      </div>
      <SlidersHorizontal size={18} color="#D9D9D9" className="cursor-pointer" />
    </div>
  );
};

export default TabSwitch;
