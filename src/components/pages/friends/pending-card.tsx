import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CancelButton from '@/components/shared/cancel-button';



interface FriendListProps {
    id: string,
    title: string;
    time: string;
    description: string;
    image: string;
}
interface pendingProps {
    pending: FriendListProps
}

const PendingCard: React.FC<pendingProps> = ({ pending }) => {
    return (
        <Card className='rounded-none shadow-none bg-transparent py-4 border-x-0 border-0 hover:bg-custom-whitesmoke  px-0 items-center grid grid-cols-9 '>
            <CardContent className='col-span-6  flex  justify-between items-center p-0'>
                <div className='space-y-1 p-0 w-full pb-5 hover:border-b-custom-purple border-b-[1px] border-b-slate-300'>
                    <div className='flex items-center gap-2'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Avatar className='w-8 h-8'>
                                        <AvatarImage src={pending.image} loading='lazy' alt="profile" />
                                        <AvatarFallback className="text-[0.5rem]">{pending.title}</AvatarFallback>
                                    </Avatar>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {pending.title}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <CardTitle className='text-slate-600 text-lg p-0'>{pending.title}</CardTitle>
                        <p className='text-xs text-slate-400 ml-5 italic'>Pending</p>
                    </div>
                </div>
            </CardContent>
            <div className='col-span-3 flex items-center justify-end p-0'>
                <CancelButton notificationType='delete'>
                    Yes, delete
                </CancelButton>
            </div>
        </Card>
    )
}

export default PendingCard;