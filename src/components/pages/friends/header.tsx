'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface FriendsHeaderProps {
    searchPage: boolean;
}

const FriendsHeader: React.FC<FriendsHeaderProps> = ({ searchPage }) => {
    const [searchId, setSearchId] = useState<string>('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const router = useRouter();
    const { toast } = useToast();

    const redirectSearchItem = () => {
        if (searchId === '' || !emailRegex.test(searchId)) {
            toast({
                title: "Invalid Input",
                description: "Please enter a valid email address.",
                variant: "destructive",
            });
        } else {
            router.push(`/friends/search/${searchId}`);
        }
    };

    const handleSearch = () => {
        alert("hello world");
    }

    return (
        <div className='flex justify-between items-center'>
            <div className='flex items-center gap-10 w-full'>
                <h1 className='text-3xl text-custom-semiBlack font-semibold'>Friends</h1>
                {!searchPage && (
                    <Input
                        placeholder='Search by email'
                        type='search'
                        className='w-[500px] py-6 placeholder:font-bold focus-visible:ring-custom-purple'
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                )}
            </div>
            {!searchPage ? (
                <Button className='text-black bg-custom-yellow hover:text-white' onClick={redirectSearchItem}>
                    <Plus size={18} className='mr-2' /> Add a Friend
                </Button>
            ) : (
                <Button className='text-custom-semiBlack font-bold text-lg hover:bg-transparent bg-transparent hover:text-custom-purple'>
                    Add a Friend
                </Button>
            )}
        </div>
    );
}

export default FriendsHeader;
