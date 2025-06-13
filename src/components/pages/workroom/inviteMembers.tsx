import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Chip, ChipImage, ChipTitle } from "@/components/shared/Chip";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"; // Import useToast hook
import { backendUri } from "@/lib/config"; // Import backend URI from config
import SuggestionBox from "@/components/basics/suggestion-box";

// Assuming backendUri is imported from a config file
// import { backendUri } from "@/lib/config"; // Uncomment if you have this file

interface Props {
  roomName: string;
  workroomId?: string | null; // workroomId is now a direct prop
  stepsData: any; // stepsData remains for other properties
  setStepsData: React.Dispatch<any>;
}

const InviteMembers = ({
  roomName,
  workroomId,
  stepsData,
  setStepsData,
}: Props) => {
  const [members, setMembers] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // State for loading indicator

  const { toast } = useToast(); // Initialize useToast hook

  const handleSuggestionSelect = (email: string) => {
    setEmail(email); // Update the main input's state with the selected email
    // Optionally, you might want to hide the suggestion box immediately after selection
    // This is handled internally by SuggestionBox's blur/focus, but you could force it here.
  };

  const handleAddMember = () => {
    if (email.trim() !== "") {
      setMembers((prev) => [...prev, email.trim()]);
      setEmail("");
    }
  };

  const handleInviteMembers = async () => {
    console.log(members);
    if (members.length === 0) {
      toast({
        title: "Info",
        description: "Please add at least one member to invite.",
        variant: "default", // Default variant for info
      });
      return;
    }

    if (!workroomId) {
      toast({
        title: "Error",
        description: "Workroom ID is missing. Cannot invite members.",
        variant: "destructive", // Destructive variant for error
      });
      return;
    }

    setIsLoading(true); // Set loading state to true when API call starts
    try {
      // Fetch token from standard browser localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        toast({
          title: "Error",
          description: "Authentication token not found. Please log in.",
          variant: "destructive",
        });
        setIsLoading(false); // Reset loading state
        return;
      }

      // The API expects a list of emails directly, not an array of objects
      const response = await fetch(
        `${backendUri}/api/v1/workrooms/${workroomId}/members`, // Use the direct workroomId prop
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the authorization token
          },
          body: JSON.stringify({ members: members }), // Send the list of email strings under 'members' key
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
        variant: "default", // Default variant for success
      });
      console.log("Invite members response:", data);
      // Optionally clear members list after successful invitation
      setMembers([]);
    } catch (error: any) {
      console.error("Error inviting members:", error);
      toast({
        title: "Error",
        description: "An error occurred: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false); // Always reset loading state after API call
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
            <Input
              className="w-[clamp(18rem,_4.1026vw,_21rem)] h-[clamp(2.25rem,_2.0513vw,_3.75rem)] neo-effect ring-1 ring-[#091E4224] text-[#626F86] text-[clamp(0.75rem,_0.5128vw,_1.125rem)] leading-[20px] font-normal outline-none"
              placeholder="Email address"
              name="addTeamMembers"
              id="addTeamMembers"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                // Allow adding member on Enter key press
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission if this is part of a form
                  handleAddMember();
                }
              }}
            />
            <SuggestionBox
              value={email} // Pass the current searchId to SuggestionBox
              onSuggestionSelect={handleSuggestionSelect} // Pass the callback
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
              <ChipImage src="/assets/images/member1.png" />
              <ChipTitle>{member}</ChipTitle>
            </Chip>
          ))
        )}
      </div>
      <Button
        className="w-full bg-[#956FD699] mt-[clamp(1.875rem,_0.8547vw,_2.5rem)]"
        onClick={handleInviteMembers} // Attach the new handler
        disabled={isLoading} // Disable button when loading
      >
        {isLoading ? "Inviting..." : "Invite team members"}{" "}
        {/* Change button text */}
      </Button>
    </main>
  );
};

export default InviteMembers;
