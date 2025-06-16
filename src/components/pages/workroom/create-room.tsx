"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { backendUri } from "@/lib/config";
import { Loader2 } from "lucide-react";
import axios from "axios";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { WorkroomDetails } from "@/lib/fetch-workroom"; // Import WorkroomDetails type

interface Props {
  type: "create" | "edit";
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  stepsData: any;
  setStepsData: React.Dispatch<any>;
  onWorkroomCreated?: (id: string) => void;
  workroomData?: WorkroomDetails | null; // Added workroomData prop
}

const CreateRoom = ({
  type,
  roomName,
  setRoomName,
  stepsData,
  setStepsData,
  onWorkroomCreated,
  workroomData, // Destructure workroomData here
}: Props) => {
  const [isCreating, setIsCreating] = React.useState(false);
  const params = useParams();

  // Safely determine workroomId by checking if 'window' is defined
  // This ensures localStorage is only accessed on the client-side
  const currentWorkroomId = React.useMemo(() => {
    if (type === "edit") {
      return params.roomId as string | undefined;
    } else {
      // Check if window is defined before accessing localStorage
      if (typeof window !== "undefined") {
        return localStorage.getItem("roomId");
      }
      return undefined; // Return undefined if localStorage is not available (server-side)
    }
  }, [type, params.roomId]);

  useEffect(() => {
    console.log(
      "CreateRoom component loaded. Determined Workroom ID:",
      currentWorkroomId
    );
  }, [currentWorkroomId]);

  // Effect to initialize roomName from workroomData
  useEffect(() => {
    if (workroomData && workroomData.name) {
      setRoomName(workroomData.name);
      // Ensure stepsData also reflects the fetched name
      setStepsData((prev: any) => ({ ...prev, name: workroomData.name }));
    }
  }, [workroomData, setRoomName, setStepsData]); // Re-run when workroomData changes

  // Original effect, now potentially overridden by the new useEffect if workroomData.name exists
  useEffect(() => {
    if (roomName) {
      setStepsData((prev: any) => ({ ...prev, name: roomName }));
    }
  }, [roomName, setStepsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      toast({
        description: "Authorization token not found. Please log in.",
        variant: "destructive",
      });
      setIsCreating(false); // Ensure loading state is reset
      return;
    }

    if (!currentWorkroomId) {
      toast({
        description: `Workroom ID not found. Cannot ${type} workroom.`,
        variant: "destructive",
      });
      setIsCreating(false);
      return;
    }

    const dataToUpdate = {
      name: stepsData.name || "Untitled Room",
    };

    try {
      const response = await axios.patch(
        `${backendUri}/api/v1/workrooms/${currentWorkroomId}`,
        dataToUpdate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast({
          description: "Workroom updated successfully!",
        });
        setRoomName(stepsData.name);
      }
    } catch (error) {
      console.error("Error updating workroom:", error);
      toast({
        description: "Failed to update workroom. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="w-full h-[clamp(22.25rem,_19.0598vh,_36.1875rem)] rounded-[16px] flex items-center justify-center">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-full flex flex-col gap-[clamp(1.25rem,_1.0256vw,_2rem)] items-center"
      >
        <Label
          htmlFor="roomName"
          className="text-[clamp(0.5rem,_0.6838vw,_1rem)] font-normal"
        >
          What&apos;s the name of your workroom
        </Label>
        <Input
          type="text"
          placeholder="Workroom Test 1"
          className="w-[60%] h-[clamp(2.375rem,_1.8803vh,_3.75rem)]"
          value={stepsData.name || ""} // Display value from stepsData
          onChange={(e) =>
            setStepsData((prev: any) => ({ ...prev, name: e.target.value }))
          }
        />
        <Button
          disabled={isCreating}
          type="submit"
          className="bg-[#956FD6] mt-2 w-[clamp(12.5rem,_8.547vw,_18.75rem)] h-[clamp(2.rem,_1.7094vh,_2.5rem)] text-[clamp(0.6rem,_0.5128vw,_0.875rem)] gap-2"
        >
          {isCreating
            ? type === "create"
              ? "Adding ..."
              : "Editing"
            : type === "create"
            ? "Add Room Name"
            : "Edit Room Name"}
          {isCreating && <Loader2 className="animate-spin h-3 w-3" />}
        </Button>
      </form>
    </div>
  );
};

export default CreateRoom;
