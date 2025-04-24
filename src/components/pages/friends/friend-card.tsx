import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { Clock4, Plus, Zap } from 'lucide-react';
import React from 'react';
import { TaskTodayProps } from "@/lib/@types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';



interface FriendListProps {
    id: string,
    title: string;
    time: string;
    description: string;
    image: string;
}
interface friendProps {
    task: FriendListProps
}

const FriendCard: React.FC<friendProps> = ({ task }) => {
    return (
        <Card className='rounded-none shadow-none py-4 border-x-0 border-t-0 hover:bg-custom-whitesmoke bg-transparent hover:border-b-custom-purple px-0 items-center grid grid-cols-9 border-b-[1px] border-b-slate-300'>
            <CardContent className='col-span-7 flex justify-between items-center p-0'>
                <div className='space-y-1 p-0'>
                    <div className='flex items-center gap-2'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Avatar className='w-8 h-8'>
                                        <AvatarImage src={task.image} loading='lazy' alt="profile" />
                                        <AvatarFallback className="text-[0.5rem]">{task.title}</AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {task.title}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <CardTitle className='text-slate-600 text-lg p-0'>{task.title}</CardTitle>
                    </div>
                    <CardDescription className='flex p-0'><Clock4 size={18} className='mr-2' />Due by {task.time}</CardDescription>
                </div>
                <div className='flex gap-1 items-center p-0 text-custom-yellow font-semibold'><Clock4 size={18} className='mr-2' /> {task.time}</div>
            </CardContent>
            <div className='col-span-2 flex items-center justify-end p-0'>
                <Button className='bg-custom-purple '><Plus size={18} className='mr-2' /> Invite to workroom</Button>
            </div>
        </Card>
    )
}

export default FriendCard;