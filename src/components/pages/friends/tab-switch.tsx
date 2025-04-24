
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import Link from "next/link";


interface FriendsPageProps {
    currentTab: string;
}
const TabSwitch: React.FC<FriendsPageProps> = ({ currentTab }) => {
    return (
        <div className="mb-10 mt-20 flex justify-between items-center">
            <div className="flex">
                <Link href={`/friends?tab=${'all-friends'}`}>
                    <Button className={`bg-transparent hover:bg-transparent ${currentTab === "all-friends" ? 'text-custom-purple' : 'text-purple-300'}  hover:text-custom-purple text-sm`} >All Friends</Button>
                </Link>
                <Link href={`/friends?tab=${'pending-invites'}`}>
                    <Button className={`bg-transparent hover:bg-transparent ${currentTab !== "all-friends" ? 'text-custom-purple' : 'text-purple-300'}  hover:text-custom-purple text-sm`} >Pending Invites</Button>
                </Link>
            </div>
            <SlidersHorizontal
                size={18}
                color="#D9D9D9"
                className="cursor-pointer"
            />
        </div>)
}

export default TabSwitch;