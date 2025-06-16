import React, { useState, useEffect, useMemo } from "react";

// Assuming these paths are correct
import { Input } from "@/components/ui/input";
import { Chip, ChipImage, ChipTitle } from "@/components/shared/Chip";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { backendUri } from "@/lib/config";

// Import the SuggestionBox component
import SuggestionBox from "@/components/basics/suggestion-box";

// Import the IWorkroom and IMember interfaces from your Canvas
import { WorkroomDetails } from "@/lib/fetch-workroom";

// Import the IMember interface to resolve the error
import { IMember } from "@/lib/@types";

// The DefaultAvatarPlaceholder provided for remote/missing avatars
const DefaultAvatarPlaceholder =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E";

interface Props {
  workroomData: WorkroomDetails | null;
  setWorkroomData: React.Dispatch<React.SetStateAction<WorkroomDetails | null>>;
  roomName: string;
  workroomId?: string | null;
  stepsData: any;
  setStepsData: React.Dispatch<any>;
}

const InviteMembers = ({
  workroomData,
  setWorkroomData,
  roomName,
  workroomId,
  stepsData,
  setStepsData,
}: Props) => {
  const [members, setMembers] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { toast } = useToast();

  // EFFECT TO INITIALIZE MEMBERS FROM WORKROOMDATA
  useEffect(() => {
    console.log(
      "InviteMembers component loaded with workroomData:",
      workroomData?.members?.map((member) => member.email) // Added optional chaining for .members
    );
    if (
      workroomData &&
      workroomData.members &&
      workroomData.members.length > 0
    ) {
      setMembers([]); // Always start with an empty list for new invitations
    } else {
      setMembers([]);
    }
  }, [workroomData]);

  const handleSuggestionSelect = (selectedEmail: string) => {
    setEmail(selectedEmail);
  };

  const handleEmailInputChange = (newEmailValue: string) => {
    setEmail(newEmailValue);
  };

  const handleAddMember = () => {
    if (email.trim() !== "") {
      const emailToAdd = email.trim();

      const isAlreadyInPendingList = members.includes(emailToAdd);

      const isExistingWorkroomMember = workroomData?.members?.some(
        (member) => member.email === emailToAdd
      );

      if (isAlreadyInPendingList) {
        toast({
          title: "Info",
          description: `${emailToAdd} is already in the list to be invited.`,
          variant: "default",
        });
        return;
      }

      if (isExistingWorkroomMember) {
        toast({
          title: "Info",
          description: `${emailToAdd} is already a member of this workroom.`,
          variant: "default",
        });
        return;
      }

      setMembers((prev) => [...prev, emailToAdd]);
      setEmail("");
    }
  };

  const handleRemoveMember = (emailToRemove: string) => {
    setMembers((prev) => prev.filter((member) => member !== emailToRemove));
  };

  const handleInviteMembers = async () => {
    const newMembersToInvite = members.filter(
      (memberEmail) =>
        !workroomData?.members?.some(
          (existingMember) => existingMember.email === memberEmail
        )
    );

    if (newMembersToInvite.length === 0) {
      toast({
        title: "Info",
        description: "No new members to invite.",
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
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // Safely get token on client side
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

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
          body: JSON.stringify({ emails: newMembersToInvite }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Unknown error inviting members" }));
        throw new Error(errorData.message || "Failed to invite members.");
      }

      const data = await response.json();

      // IMPORTANT: Update workroomData in the parent directly
      // Corrected the type annotation for prevWorkroomData
      setWorkroomData((prevWorkroomData: WorkroomDetails | null) => {
        if (!prevWorkroomData) return null; // If no previous data, can't update

        // Map the invited emails to full Member objects (with all required fields)
        const newlyAddedMembers = newMembersToInvite.map((email) => ({
          id: `temp-${email}-${Date.now()}`,
          email: email,
          name: email.split("@")[0] || "",
          image_url: DefaultAvatarPlaceholder,
          // The following fields are for compatibility with IMember, if needed elsewhere
          first_name: email.split("@")[0] || "",
          last_name: "",
          avatar_url: DefaultAvatarPlaceholder,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          auth_provider: "manual",
          username: email.split("@")[0] || email,
          password_hash: "",
          role: "member",
          xp: 0,
          level: 0,
          is_verified: false,
          is_user_onboarded: false,
          productivity: 0,
          average_task_time: 0,
          user_type: "invited-pending",
          find_us: "",
          daily_active_minutes: 0,
          teamwork_collaborations: 0,
          software_used: [],
        }));

        return {
          ...prevWorkroomData,
          members: [...(prevWorkroomData.members || []), ...newlyAddedMembers],
        };
      });

      toast({
        title: "Success",
        description: "Members invited successfully!",
        variant: "default",
      });
      console.log("Invite members response:", data);
      setMembers([]); // Clear the list of emails added in this session
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

  // Helper to determine if a member is already an existing workroom member
  const isExistingWorkroomMember = (memberEmail: string) => {
    return workroomData?.members?.some((m) => m.email === memberEmail);
  };

  // Combine existing members and new members (to be invited) for display
  const allMembersToDisplay = useMemo(() => {
    const existing = workroomData?.members || [];
    // Filter out any 'new' members that are already in the 'existing' list
    const newOnly = members.filter(
      (newEmail) =>
        !existing.some((existingMember) => existingMember.email === newEmail)
    );

    // Map newOnly emails to minimal IMember objects for consistent rendering
    const newMemberObjects: IMember[] = newOnly.map((email) => ({
      id: `new-${email}-${Math.random().toString(36).substring(2, 9)}`, // Temp ID for rendering
      email: email,
      first_name: email.split("@")[0] || "",
      last_name: "",
      avatar_url: DefaultAvatarPlaceholder,
      // Fill other mandatory fields with dummy data for display purposes
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      auth_provider: "manual",
      username: email.split("@")[0] || email,
      password_hash: "",
      role: "member",
      xp: 0,
      level: 0,
      is_verified: false,
      is_user_onboarded: false,
      productivity: 0,
      average_task_time: 0,
      user_type: "invited-pending",
      find_us: "",
      daily_active_minutes: 0,
      teamwork_collaborations: 0,
      software_used: [],
    }));

    return { existing, newPending: newMemberObjects };
  }, [workroomData, members]);

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
            <SuggestionBox
              className="w-[clamp(18rem,_4.1026vw,_21rem)]"
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
        {/* Render existing workroom members first, if any */}
        {allMembersToDisplay.existing.length > 0 && (
          <div className="w-full text-center text-gray-700 font-semibold mb-2">
            Existing Workroom Members:
          </div>
        )}
        {allMembersToDisplay.existing.map((member) => (
          <Chip
            key={`existing-${member.id}`}
            className="bg-blue-100 border-blue-300"
          >
            <ChipImage src={member.avatar_url || DefaultAvatarPlaceholder} />
            <ChipTitle>{member.email}</ChipTitle>
          </Chip>
        ))}

        {/* Render new members to invite, if any */}
        {allMembersToDisplay.newPending.length > 0 && (
          <div className="w-full text-center text-gray-700 font-semibold my-2">
            New Members to Invite:
          </div>
        )}
        {allMembersToDisplay.newPending.map((member) => (
          <Chip key={`new-${member.id}`}>
            <ChipImage src={DefaultAvatarPlaceholder} />{" "}
            {/* Default placeholder for new invitees */}
            <ChipTitle>{member.email}</ChipTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveMember(member.email)}
              className="ml-2 p-0 h-auto text-red-500 hover:bg-transparent"
            >
              &times;
            </Button>
          </Chip>
        ))}

        {/* Show message if no existing members and no new members added */}
        {allMembersToDisplay.existing.length === 0 &&
          allMembersToDisplay.newPending.length === 0 && (
            <p className="text-[#999999] text-center">No members yet</p>
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
