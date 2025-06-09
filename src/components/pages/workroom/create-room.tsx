"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { backendUri } from "@/lib/config";
import { Loader2 } from "lucide-react";
import axios from "axios";
import React, { useEffect } from "react";

interface Props {
  roomName: string;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
  stepsData: any;
  setStepsData: React.Dispatch<any>;
  onWorkroomCreated?: (id: string) => void;
}

const CreateRoom = ({
  roomName,
  setRoomName,
  stepsData,
  setStepsData,
  onWorkroomCreated,
}: Props) => {
  const [isCreating, setIsCreating] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        description: "Authorization token not found. Please log in.",
        variant: "destructive",
      });
      return;
    }

    const workroomId = localStorage.getItem("roomId");
    if (!workroomId) {
      toast({
        description: "Workroom ID not found. Please create a workroom first.",
        variant: "destructive",
      });
      return;
    }

    const workroomData = {
      name: stepsData.name || "Untitled Room",
    };

    try {
      const response = await axios.patch(
        `${backendUri}/api/v1/workrooms/${workroomId}`,
        workroomData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsCreating(false);
      if (response.status === 200) {
        toast({
          description: "Workroom updated successfully!",
        });
      }
      setRoomName(stepsData.name || "Untitled Room");
    } catch (error) {
      toast({
        description: "Failed to update workroom. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (roomName) {
      setStepsData((prev: any) => ({ ...prev, name: roomName }));
    }
  }, [roomName, setStepsData]);

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
          value={stepsData.name || ""}
          onChange={(e) =>
            setStepsData((prev: any) => ({ ...prev, name: e.target.value }))
          }
        />
        <Button
          disabled={isCreating}
          type="submit"
          className="bg-[#956FD6] mt-2 w-[clamp(12.5rem,_8.547vw,_18.75rem)] h-[clamp(2.rem,_1.7094vh,_2.5rem)] text-[clamp(0.6rem,_0.5128vw,_0.875rem)] gap-2"
        >
          {isCreating ? "Adding ..." : "Add Room Name"}
          {isCreating && <Loader2 className="animate-spin h-3 w-3" />}
        </Button>
      </form>
    </div>
  );
};

export default CreateRoom;
