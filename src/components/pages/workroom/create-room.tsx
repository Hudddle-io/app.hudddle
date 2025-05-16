import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import React from "react";

interface Props {
  stepsData: any;
  setStepsData: React.Dispatch<any>;
  onWorkroomCreated?: (id: string) => void;
}

const CreateRoom = ({ stepsData, setStepsData, onWorkroomCreated }: Props) => {
  const handleCreateWorkroom = async (event: React.FormEvent) => {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        description: "Authorization token not found. Please log in.",
        variant: "destructive",
      });
      return;
    }

    const workroomData = {
      name: stepsData.name || "Default Workroom Name",
      description: stepsData.description || "Default Description",
    };

    try {
      const response = await axios.post(
        "https://hudddle-backend.onrender.com/api/v1/workrooms",
        workroomData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        toast({
          description: "Workroom created successfully!",
        });

        // Notify parent component about the created workroom ID
        if (onWorkroomCreated) {
          onWorkroomCreated(response.data.id);
          console.log(response.data.id);
        }
      }
    } catch (error) {
      toast({
        description: "Failed to create workroom. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full h-[clamp(22.25rem,_19.0598vh,_36.1875rem)] rounded-[16px] flex items-center justify-center">
      <form
        onSubmit={handleCreateWorkroom}
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
          type="submit"
          className="bg-[#956FD6] mt-2 w-[clamp(12.5rem,_8.547vw,_18.75rem)] h-[clamp(2.rem,_1.7094vh,_2.5rem)] text-[clamp(0.6rem,_0.5128vw,_0.875rem)]"
        >
          Create workroom
        </Button>
      </form>
    </div>
  );
};

export default CreateRoom;
