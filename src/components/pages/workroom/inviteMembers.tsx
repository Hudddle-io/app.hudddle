import React, { useState } from "react";

// Assuming these paths are correct
import { Input } from "@/components/ui/input"; // This Input is not directly used for user typing anymore, but might be for styling or other purposes.
import { Chip, ChipImage, ChipTitle } from "@/components/shared/Chip";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { backendUri } from "@/lib/config";

// Import the SuggestionBox component
import SuggestionBox from "@/components/basics/suggestion-box"; // Make sure this path is correct

interface Props {
  roomName: string;
  workroomId?: string | null;
  stepsData: any;
  setStepsData: React.Dispatch<any>;
}

const InviteMembers = ({
  roomName,
  workroomId,
  stepsData,
  setStepsData,
}: Props) => {
  const [members, setMembers] = useState<string[]>([]);
  const [email, setEmail] = useState<string>(""); // This state is now managed by InviteMembers
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  // This function is passed to SuggestionBox
  // When a suggestion is clicked, SuggestionBox calls this with the selected email
  const handleSuggestionSelect = (selectedEmail: string) => {
    setEmail(selectedEmail); // Update the 'email' state in InviteMembers
  };

  // This function is for handling changes directly in the input field
  // It's passed to SuggestionBox so that the parent's 'email' state updates
  // as the user types, which in turn syncs with SuggestionBox's internal input.
  const handleEmailInputChange = (newEmailValue: string) => {
    setEmail(newEmailValue);
  };

  const handleAddMember = () => {
    if (email.trim() !== "") {
      // Check if member already exists to prevent duplicates
      if (members.includes(email.trim())) {
        toast({
          title: "Info",
          description: `${email.trim()} is already in the list.`,
          variant: "default",
        });
        return;
      }

      setMembers((prev) => [...prev, email.trim()]);
      setEmail(""); // Clear the input after adding
    }
  };

  const handleInviteMembers = async () => {
    console.log("Attempting to invite members:", members); // Log the members array
    if (members.length === 0) {
      toast({
        title: "Info",
        description: "Please add at least one member to invite.",
        variant: "default",
      });
      return;
    }

    if (!workroomId) {
      toast({
        title: "Error",
        description: "Workroom ID is missing. Cannot invite members.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found. Please log in.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch(
        `${backendUri}/api/v1/workrooms/${workroomId}/members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // THIS IS THE CRUCIAL CHANGE: Use 'emails' instead of 'members'
          body: JSON.stringify({ emails: members }), // Corrected to match API spec
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error inviting members" }));
        throw new Error(errorData.message || "Failed to invite members.");
      }

      const data = await response.json();
      toast({
        title: "Success",
        description: "Members invited successfully!",
        variant: "default",
      });
      console.log("Invite members response:", data);
      setMembers([]); // Clear members list after successful invitation
    } catch (error: any) {
      console.error("Error inviting members:", error);
      toast({
        title: "Error",
        description: "An error occurred: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-[clamp(1.5rem,_0.6838vw,_2rem)] max-h-[60vh] overflow-y-auto">
      <div className="flex flex-col items-center gap-2">
        <label
          htmlFor="addTeamMembers"
          className="font-normal text-[clamp(1rem,_1vw,_1.5rem)] leading-[16px] text-[#44546F] mb-6"
        >
          Add your friends to <span className="font-bold">{roomName}</span>
        </label>
        <span className="flex gap-[clamp(1.5rem,_0.6838vw,_2rem)] justify-center items-center">
          <div className="flex flex-col items-center gap-2">
            {/* SuggestionBox now fully manages the input for searching and selecting friends */}
            {/* The `className` on SuggestionBox will be applied to its root div (the one wrapping the input) */}
            <SuggestionBox
              className="w-[clamp(18rem,_4.1026vw,_21rem)]" // Pass width directly to the SuggestionBox component
              value={email}
              onValueChange={handleEmailInputChange}
              onSuggestionSelect={handleSuggestionSelect}
            />
          </div>
          <Button id="add" variant="ghost" onClick={handleAddMember}>
            <Plus className="text-[#956FD666] w-[clamp(0.7rem,_0.5128vw,_0.875rem)] h-[clamp(0.7rem,_0.5128vh,_0.875rem)] text-[clamp(0.5rem,_0.5128vw,_0.875rem)]" />
          </Button>
        </span>
      </div>
      <div className="w-[clamp(20.5rem,_5.9829vw,_21.875rem)] flex justify-center flex-wrap h-fit gap-2">
        {members.length === 0 ? (
          <p className="text-[#999999] text-center">No members yet</p>
        ) : (
          members.map((member, index) => (
            <Chip key={index}>
              <ChipImage src="/assets/images/member1.png" />{" "}
              {/* Placeholder image for now */}
              <ChipTitle>{member}</ChipTitle>
            </Chip>
          ))
        )}
      </div>
      <Button
        className="w-full bg-[#956FD699] mt-[clamp(1.875rem,_0.8547vw,_2.5rem)]"
        onClick={handleInviteMembers}
        disabled={isLoading}
      >
        {isLoading ? "Inviting..." : "Invite team members"}
      </Button>
    </main>
  );
};

export default InviteMembers;
