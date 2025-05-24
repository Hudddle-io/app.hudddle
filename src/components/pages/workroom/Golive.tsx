import React, { useState } from "react"; // Import useState
import { Header, HeaderActions, HeaderTexts } from "./Header";

import { Chip, ChipImage, ChipTitle } from "@/components/shared/Chip";
import NavigationLink from "@/components/basics/Navigation-link";
import { Button } from "@/components/ui/button";

import {
  Task,
  TaskActions,
  TaskDescription,
  TaskDueTime,
  TaskTitle,
} from "./Task";
import {
  Zap,
  ExternalLink,
  SquareArrowOutUpLeft,
  Loader2,
  X,
} from "lucide-react"; // Import X for modal close
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence for modal animations
import { WorkroomDetails } from "@/lib/fetch-workroom";

interface Member {
  name: string;
  avatar_url: string;
  // Add any other member properties if available in WorkroomDetails
}

interface Props {
  stepsData: any;
  workroomId: string | null;
  data: WorkroomDetails | null;
  setStepsData: React.Dispatch<any>;
  onLoad?: () => void;
}

// New Modal Component for displaying all members
interface MembersListModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
}

const MembersListModal: React.FC<MembersListModalProps> = ({
  isOpen,
  onClose,
  members,
}) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50"
            variants={overlayVariants}
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            variants={modalVariants}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-[#262626] mb-4">
              All Team Members
            </h3>
            <div className="flex flex-wrap gap-3">
              {members.map((member, index) => (
                <Chip key={index}>
                  <ChipImage
                    src={
                      member.avatar_url ||
                      "https://placehold.co/24x24/CCCCCC/000000?text=M"
                    }
                  />{" "}
                  {/* Fallback image */}
                  <ChipTitle>{member.name}</ChipTitle>
                </Chip>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Golive = ({ stepsData, workroomId, data, setStepsData }: Props) => {
  const [isMembersModalOpen, setIsMembersModalOpen] = useState<boolean>(false);

  const membersToDisplay = data?.members ? data.members.slice(0, 6) : [];
  const remainingMembersCount = data?.members
    ? data.members.length - membersToDisplay.length
    : 0;

  return (
    <motion.div className="relative w-3/4 h-3/4 rounded-[6px] p-6 flex flex-col gap-8">
      <Header>
        <HeaderTexts>
          <h2 className="font-bold text-[18px] leading-[22px] text-[#262626]">
            Your team members
          </h2>
          <HeaderActions className="flex-wrap">
            {membersToDisplay.map((member, index) => {
              // Use membersToDisplay
              return (
                <Chip key={index}>
                  {" "}
                  {/* Use index as key if member.name is not unique */}
                  <ChipImage
                    src={
                      member.avatar_url ||
                      "https://placehold.co/24x24/CCCCCC/000000?text=M"
                    }
                  />{" "}
                  {/* Fallback image */}
                  <ChipTitle>{member.name}</ChipTitle>
                </Chip>
              );
            })}

            {remainingMembersCount > 0 && ( // Conditionally render if there are more members
              <Button
                className="text-[18px] leading-[20px] font-normal text-[#956FD699]"
                variant={"ghost"}
                onClick={() => setIsMembersModalOpen(true)} // Open modal on click
              >
                + {remainingMembersCount} Others
              </Button>
            )}
          </HeaderActions>
        </HeaderTexts>
      </Header>

      <div className="flex flex-col gap-4 mt-8">
        <h2 className="font-bold text-[clamp(0.9375rem,_0.4274vw,_1.25rem)] leading-[22px] text-[#956FD6]">
          Workroom Tasks
        </h2>
        {data?.tasks.map((task) => {
          return (
            <Task key={task.id}>
              <TaskDescription>
                <TaskTitle className="text-[#211451] text-[clamp(0.9375rem,_0.4274vw,_1.25rem)]">
                  {task.title}
                </TaskTitle>
                <TaskDueTime>{task.due_by}</TaskDueTime>
              </TaskDescription>
              <TaskActions>
                <span className="text-[#EEAE05] flex items-center text-[clamp(0.5rem, _0.2564vw, _0.6875rem)]">
                  +<Zap width={10} height={10} />
                  {task.task_point}
                </span>

                <Button
                  variant={"ghost"}
                  className="text-[#EF5A63] text-[clamp(0.625rem,_0.1709vw,_0.75rem)] hover:bg-transparent ml-[clamp(1.375rem,_1.2821vw,_2.3125rem)]"
                >
                  Remove
                </Button>
              </TaskActions>
            </Task>
          );
        })}
      </div>
      <footer className="flex items-center justify-end gap-4">
        <NavigationLink
          icon={{ icon_component: <SquareArrowOutUpLeft /> }}
          href="/workroom"
          variant={"ghost"}
        >
          View all Workrooms
        </NavigationLink>
        <NavigationLink
          icon={{ icon_component: <ExternalLink /> }}
          href={`/workroom/room/${workroomId}`}
        >
          Open Workroom
        </NavigationLink>
      </footer>

      {/* Render the MembersListModal */}
      <MembersListModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        members={data?.members || []}
      />
    </motion.div>
  );
};

export default Golive;
