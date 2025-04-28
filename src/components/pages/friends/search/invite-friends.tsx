'use client';

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Chip, ChipImage, ChipTitle } from "@/components/shared/Chip";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import InviteButton from "@/components/shared/invite-button";
import friendListData from "@/data/friends";

interface Friend {
    id: string;
    title: string;
    description: string;
    time: string;
    image: string;
}

interface Props {
    title: string;
    initialValue: string;
}

const InviteFriends: React.FC<Props> = ({ title, initialValue }) => {
    const [inputValue, setInputValue] = useState<string>(initialValue);
    const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    useEffect(() => {
        if (inputValue.trim()) {
            const filtered = friendListData.filter((friend: Friend) =>
                friend.title.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredFriends(filtered);
        } else {
            setFilteredFriends([]);
        }
    }, [inputValue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSelectedUser = (userId: string) => {
        setSelectedUser((prevSelectedUser) =>
            prevSelectedUser === userId ? null : userId
        );
    };

    const handleInviteClick = () => {
        // Handle the invite friend logic here
    };

    return (
        <main className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
                <label
                    htmlFor="addTeamMembers"
                    className={`font-normal text-[16px] ${title.startsWith("Search") ? 'text-center' : ''}  leading-[16px] text-[rgb(23,25,27)]`}
                >
                    {title}
                </label>
                <span className="flex gap-8 items-center">
                    <Input
                        className="w-[336px] h-[60px] neo-effect ring-1 ring-[#091E4224] text-[#626F86] text-[18px] leading-[20px] font-normal outline-none"
                        placeholder="Email address"
                        name="addTeamMembers"
                        id="addTeamMembers"
                        type="email"
                        value={inputValue}
                        onChange={handleInputChange}
                    />
                    <Button variant={"ghost"}>
                        <Plus className="text-[#956FD666] w-[14px] h-[14px] text-[14px]" />
                    </Button>
                </span>
            </div>

            {inputValue.trim() && filteredFriends.length > 0 ? (
                <>
                    <div className="w-[350px] flex flex-wrap h-fit gap-2">
                        {filteredFriends.map((data) => (
                            <Chip
                                key={data.id}
                                className={`${selectedUser === data.id ? 'bg-custom-purple text-white' : ''} cursor-pointer`}
                                onClick={() => handleSelectedUser(data.id)}
                            >
                                <ChipImage src={data.image} />
                                <ChipTitle className={`${selectedUser === data.id ? 'text-white' : ''}`}>
                                    {data.title}
                                </ChipTitle>
                            </Chip>
                        ))}
                    </div>
                    <InviteButton notificationType="copyLink" disabled={!selectedUser && true}>Send Request</InviteButton>
                </>
            ) : (
                <div>
                    <p className="font-normal py-10 text-[16px] text-center leading-[16px] text-[#55606a]">
                        We couldn&#39;t find that person. Want to invite them over?
                    </p>
                    <InviteButton notificationType="success" disabled={!inputValue && true}>Invite Friend</InviteButton>
                </div>
            )}
        </main>
    );
};

export default InviteFriends;
