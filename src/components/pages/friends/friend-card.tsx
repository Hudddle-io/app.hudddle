import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface FriendProps {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

interface FriendCardProps {
  friend: FriendProps; // The prop name is 'friend'
}

const FriendCard: React.FC<FriendCardProps> = ({ friend }) => {
  return (
    <Card className="rounded-none shadow-none py-4 border-x-0 border-t-0 hover:bg-custom-whitesmoke bg-transparent hover:border-b-custom-purple px-0 items-center grid grid-cols-9 border-b-[1px] border-b-slate-300">
      <CardContent className="col-span-7 flex justify-between items-center p-0">
        <div className="space-y-1 p-0">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar className="w-8 h-8">
                    <AvatarImage
                      src={friend.avatar}
                      loading="lazy"
                      alt={friend.name}
                    />
                    <AvatarFallback className="text-[0.5rem]">
                      {friend.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>{friend.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <CardTitle className="text-slate-600 text-lg p-0">
              {friend.name}
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            {friend.email}
          </CardDescription>
        </div>
      </CardContent>
      <div className="col-span-2 flex items-center justify-end p-0">
        <Button className="bg-custom-purple">
          <Plus size={18} className="mr-2" /> Invite to workroom
        </Button>
      </div>
    </Card>
  );
};
export default FriendCard;
