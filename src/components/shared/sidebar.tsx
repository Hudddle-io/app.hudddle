"use client";

import { toast } from "sonner"; // Assuming sonner toast is used here
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import Image from "next/image";
import Link from "next/link";
import React, { FC, HTMLAttributes, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dribbble, Figma, Home, ImageIcon, LogOut, Pencil } from "lucide-react";
import { sideLinks } from "@/data/data"; // Make sure sideLinks contains correct icon paths
import { useUserSession } from "@/contexts/useUserSession"; // This now provides refreshUser
import { useRouter, usePathname } from "next/navigation";
import pinterest from "../../../public/assets/pinterest.svg";
import dribble from "../../../public/assets/dribble.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { backendUri } from "@/lib/config";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"; // Import Popover components

interface UserOnlineStatusProps extends HTMLAttributes<HTMLDivElement> {
  isOnline: boolean;
  statusText?: boolean | string;
  isLoading?: boolean; // Add isLoading prop for skeleton
}

const onlinestatusstyles = cva("flex items-center gap-2");

export const UserOnlineStatus: FC<UserOnlineStatusProps> = ({
  isOnline,
  statusText,
  className,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className={cn(onlinestatusstyles({ className }))}>
        <Skeleton className="w-2 h-2 rounded-full" />
        <Skeleton className="w-16 h-3" />
      </div>
    );
  }

  return (
    <div className={cn(onlinestatusstyles({ className }))}>
      {!isOnline ? (
        <span className="w-2 h-2 bg-slate-200 rounded-full" />
      ) : (
        <span className="w-2 h-2 bg-[#ADD359] rounded-full" />
      )}
      {statusText && (
        <h6
          className={`text-xs ${
            !isOnline ? "text-slate-200" : "text-[#ADD359]"
          }`}
        >
          {isOnline ? "Online" : statusText}
        </h6>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null); // State for local preview
  const [isUserOnline, setIsUserOnline] = useState(false); // State for user online status
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // State to control popover visibility

  const router = useRouter();
  const pathname = usePathname();
  const {
    loading,
    error,
    currentUser,
    logout: logoutContext,
    refreshUser,
  } = useUserSession();

  useEffect(() => {
    // Set preview image from currentUser's avatar_url
    if (currentUser) {
      setPreviewImage(currentUser.avatar_url || null);
    } else {
      setPreviewImage(null);
    }
  }, [currentUser]); // Re-run when currentUser changes

  // Polling for online status
  useEffect(() => {
    const checkOnlineStatus = async () => {
      try {
        const response = await fetch("https://fedarlight.com/", {
          method: "GET",
          mode: "no-cors", // Use no-cors for external health checks if no specific data is needed
        });
        //TODO: Expand this function to also reupdate the user when it fetches if there is change else it should not. also if there is a pending friend request, it should show how many with the red circle over the friends to show there is an activity change. also.
        setIsUserOnline(true);
      } catch (error) {
        console.error("Failed to check online status:", error);
        setIsUserOnline(false);
      }
    };

    // Run immediately on mount
    checkOnlineStatus();

    // Set up interval to run every 5 minutes (300,000 milliseconds)
    const intervalId = setInterval(checkOnlineStatus, 300000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const getInitials = (
    firstName: string | undefined,
    lastName: string | undefined
  ) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

  const handleLogout = async () => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      logoutContext();
      router.push("/auth/Sign-in");
      return;
    }
    try {
      const response = await fetch(`${backendUri}/api/v1/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Logout failed:", errorData);
        if (response.status === 401) {
          logoutContext(); // Clear context on 401 even if backend didn't officially log out
          router.push("/auth/Sign-in");
          return;
        }
        throw new Error(errorData.message || "Logout failed");
      }

      logoutContext(); // Clear context after successful backend logout
      router.push("/auth/Sign-in");
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Network Error", {
        description: "Could not connect to the server or logout failed.",
      });
      console.error("Error during logout:", error);
    } finally {
      // Ensure token is removed from localStorage even if fetch fails
      localStorage.removeItem("token");
    }
  };

  // This function is for showing local preview *before* upload
  const handleImageLocalPreview = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string); // Update local preview
      };
      reader.readAsDataURL(file);
    }
  };

  // This function handles the actual upload to the server
  const handleUploadProfileImage = async () => {
    setIsPopoverOpen(false); // Close popover immediately
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;

    if (fileInput) {
      fileInput.click(); // Programmatically click the hidden file input

      // Listen for when a file is selected
      fileInput.onchange = async (event: Event) => {
        const file = (event.target as HTMLInputElement)?.files?.[0];
        if (file) {
          const formData = new FormData();
          formData.append("profile_image", file); // Ensure your backend expects 'profile_image' as the field name

          try {
            const token = localStorage.getItem("token");
            if (!token) {
              toast.error("Authorization token not found. Please log in.");
              return;
            }

            const response = await fetch(
              `${backendUri}/api/v1/auth/update-profile-image`, // Corrected API endpoint
              {
                method: "POST", // Method is POST as requested
                headers: {
                  Authorization: `Bearer ${token}`,
                  // Do NOT set Content-Type: 'multipart/form-data' here; FormData does it automatically
                },
                body: formData, // Send the FormData object
              }
            );

            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(
                errorData.message || "Failed to update profile image"
              );
            }

            toast.success("Profile image updated successfully!");

            // Refresh user data in the context to get the new avatar_url
            if (refreshUser) {
              await refreshUser();
              console.log("User session refreshed after profile image update.");
            } else {
              console.warn(
                "refreshUser function not available in context. User state might be stale."
              );
            }
          } catch (error: any) {
            toast.error(
              error.message ||
                "Failed to update profile image. Please try again."
            );
            console.error("Error updating profile image:", error);
          } finally {
            // Clear the file input value after upload attempt (optional, to allow re-uploading same file)
            fileInput.value = "";
          }
        }
      };
    }
  };

  const handleUpdateProfile = () => {
    setIsPopoverOpen(false); // Close popover
    router.push("/edit-profile"); // Route to edit-profile page
  };

  return (
    <section className="col-span-1 min-w-[250px] ring-[0.6px] ring-[#999999] ring-opacity-[25%] flex items-start justify-center py-10 px-6">
      <div className="w-full h-full flex flex-col gap-[40px] items-center">
        <Link
          href={"/"}
          className="relative w-[clamp(clamp(3.125rem,_4.2735vw,_6.25rem))] h-[clamp(1.5625rem,_2.1368vh,_3.125rem)]"
        >
          <Image src={"/assets/logo.svg"} alt="logo" fill />
        </Link>

        {/* huddle user bar */}
        <div
          className="relative shadow-xl mt-[50px] w-full h-fit rounded-[16px] bg-[#211451] px-[14px] py-[4px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="-translate-y-[60%] w-full h-fit flex justify-center relative">
            <div className="w-[100px] h-[100px] relative">
              <Avatar>
                <AvatarImage
                  src={previewImage || undefined} // Use previewImage for immediate feedback, fallback to undefined
                  alt={`@${currentUser?.first_name}`}
                />
                <AvatarFallback>
                  {loading ? ( // Skeleton for AvatarFallback during loading
                    <Skeleton className="w-full h-full rounded-full" />
                  ) : (
                    getInitials(currentUser?.first_name, currentUser?.last_name)
                  )}
                </AvatarFallback>
              </Avatar>
            </div>
            {isHovered && (
              <div className="absolute inset-0 flex items-end justify-end gap-2">
                <div className="flex items-center gap-2 -translate-x-[10%]">
                  <Button
                    className="bg-white ring-1 ring-[#956FD6] hover:text-white shadow text-[#956FD6] h-5 w-5 rounded-full p-0"
                    onClick={() => setIsPreviewOpen(true)}
                  >
                    <ImageIcon className="w-3 h-3" />
                  </Button>

                  {/* Popover for Pencil icon */}
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        id="edit-profile-popover-trigger"
                        className="bg-white ring-1 ring-[#956FD6] hover:text-white shadow text-[#956FD6] h-5 w-5 rounded-full p-0"
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2 flex flex-col gap-2">
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={handleUploadProfileImage}
                      >
                        Upload Picture
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={handleUpdateProfile}
                      >
                        Update Profile
                      </Button>
                    </PopoverContent>
                  </Popover>

                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    placeholder="upload"
                    onChange={handleImageLocalPreview}
                  />
                </div>
              </div>
            )}
          </div>
          <header className="w-full -translate-y-[20%] flex flex-col -mt-9 items-center gap-[4px] px-8">
            {/* Pass isLoading prop to UserOnlineStatus */}
            <UserOnlineStatus
              isOnline={isUserOnline}
              statusText={true}
              isLoading={loading}
            />
            <h1 className="text-[#FFFFFF] text-[clamp(0.9375rem,_0.5128vw,_1.3125rem)] font-semibold text-center">
              {loading ? (
                <Skeleton className="w-32 h-5 mx-auto" />
              ) : (
                `${currentUser?.first_name} ${currentUser?.last_name}`
              )}
            </h1>
            <p className="font-normal text-[clamp(0.5rem,_0.3419vw,_0.75rem)] leading-[16px] text-white text-center truncate text-wrap">
              {loading ? (
                <Skeleton className="w-48 h-3 mx-auto" />
              ) : (
                currentUser?.email
              )}
            </p>
          </header>
          {/* links */}
          <div className="flex flex-col w-full h-fit gap-[24px] pb-[14px]">
            {sideLinks.map((link, i) => (
              <Link id="side-link" key={i} href={link.url}>
                <Button
                  id="side-link-btn"
                  className={cn(
                    "text-white w-full hover:bg-[#EEAE05] hover:text-[#fff] text-[clamp(0.625rem,_0.3419vw,_0.875rem)] gap-2 font-normal pl-[24px] justify-start",
                    pathname.startsWith(link.url) && "bg-[#EEAE05]" // Corrected logic here
                  )}
                  variant={"ghost"}
                >
                  <div className="relative w-[clamp(0.9375rem,_0.4274vw,_1.25rem)] h-[clamp(0.9375rem,_0.4274vh,_1.25rem]">
                    {/* Ensure link.icon contains a valid path to an image file */}
                    <Image
                      alt={link.text}
                      src={`${link.icon}`}
                      width={24}
                      height={24}
                    />
                  </div>
                  <span>{link.text}</span>
                </Button>{" "}
              </Link>
            ))}
            <Button
              onClick={handleLogout}
              className="text-white w-full hover:bg-[#EEAE05] hover:text-[#fff] text-[clamp(0.625rem,_0.3419vw,_0.875rem)] gap-2 font-normal pl-[24px] justify-start"
              variant={"ghost"}
            >
              <div className="relative w-[clamp(0.9375rem,_0.4274vw,_1.25rem)] h-[clamp(0.9375rem,_0.4274vh,_1.25rem]">
                <Image
                  width={24}
                  height={24}
                  alt="signout image"
                  src={"/assets/home.svg"} // Consider using a dedicated logout icon if available
                />
              </div>
              <span>Clock out</span>
            </Button>{" "}
          </div>
        </div>

        {/* Image Preview Overlay */}
        {isPreviewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative">
              <Image
                src={previewImage || "/assets/profileImage.svg"} // Fallback for preview
                alt="Preview"
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
              <Button
                variant="secondary"
                className="absolute top-2 right-2 text-white"
                onClick={() => setIsPreviewOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* bar footer */}
        <footer className="w-full p-[14px] mx-5 flex flex-col gap-2">
          <p className="font-normal text-[14px] leading-[20px] text-[#707070]">
            Frequently used tools
          </p>
          <div className="flex flex-row items-center space-x-2">
            <Image src={pinterest} width={20} height={20} alt="pintrest" />
            <Image src={dribble} width={20} height={20} alt="dribble" />
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Sidebar;