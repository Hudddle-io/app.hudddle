"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { backendUri } from "@/lib/config";
import Image from "next/image";

interface UserData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  username?: string;
  password_hash?: string;
}

const GeneralSettingsTabContent = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPasswordDisplay, setOldPasswordDisplay] = useState("**********");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [initialFirstName, setInitialFirstName] = useState("");
  const [initialLastName, setInitialLastName] = useState("");
  const [initialEmail, setInitialEmail] = useState("");

  useEffect(() => {
    let userString = localStorage.getItem("user");

    // --- NEW CHECK HERE ---
    if (userString === "undefined") {
      console.warn(
        "Found 'undefined' string in local storage for 'user'. Clearing it."
      );
      localStorage.removeItem("user");
      userString = null; // Treat it as if it was null from the start
    }
    // --- END NEW CHECK ---

    if (userString) {
      try {
        const userData: UserData = JSON.parse(userString);
        setFirstName(userData.first_name || "");
        setLastName(userData.last_name || "");
        setEmail(userData.email || "");

        setInitialFirstName(userData.first_name || "");
        setInitialLastName(userData.last_name || "");
        setInitialEmail(userData.email || "");
      } catch (error) {
        console.error("Failed to parse user data from local storage:", error);
        toast.error("Failed to load user data. It might be corrupted.");
        // If parsing fails, clear localStorage 'user' to prevent future errors
        localStorage.removeItem("user");
        // Also reset states to empty
        setFirstName("");
        setLastName("");
        setEmail("");
        setInitialFirstName("");
        setInitialLastName("");
        setInitialEmail("");
      }
    } else {
      toast.info("User data not found in local storage. Please log in.");
      setFirstName("");
      setLastName("");
      setEmail("");
      setInitialFirstName("");
      setInitialLastName("");
      setInitialEmail("");
    }
  }, []);

  const handleSaveOrEdit = async () => {
    if (isEditing) {
      setIsLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization token not found. Please log in.");
        router.push("/auth/sign-in");
        setIsLoading(false);
        return;
      }

      const payload: Partial<UserData & { new_password?: string }> = {};

      if (firstName !== initialFirstName) {
        payload.first_name = firstName;
      }
      if (lastName !== initialLastName) {
        payload.last_name = lastName;
      }
      if (email !== initialEmail) {
        payload.email = email;
      }
      if (newPassword) {
        payload.password_hash = newPassword;
      }

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save.");
        setIsEditing(false);
        setNewPassword("");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${backendUri}/api/v1/auth/update-profile-data`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update profile data");
        }

        const updatedUserResponse = await response.json();
        const updatedUser = updatedUserResponse; // Assuming backend returns user object directly

        toast.success("Profile updated successfully!");

        localStorage.setItem("user", JSON.stringify(updatedUser));

        setInitialFirstName(updatedUser.first_name || "");
        setInitialLastName(updatedUser.last_name || "");
        setInitialEmail(updatedUser.email || "");

        setFirstName(updatedUser.first_name || "");
        setLastName(updatedUser.last_name || "");
        setEmail(updatedUser.email || "");

        setIsEditing(false);
        setNewPassword("");
        router.refresh();
      } catch (error: any) {
        toast.error(
          error.message || "Error updating profile. Please try again."
        );
        console.error("Error during profile update:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFirstName(initialFirstName);
    setLastName(initialLastName);
    setEmail(initialEmail);
    setNewPassword("");
    setOldPasswordDisplay("**********");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isEditing ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white dark:bg-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-white dark:bg-gray-900"
              />
            </div>
          </>
        ) : (
          <div className="space-y-2 col-span-1">
            <Label htmlFor="fullName">Your name</Label>
            <Input
              id="fullName"
              value={`${firstName} ${lastName}`.trim()}
              disabled={true}
              className="bg-gray-100 dark:bg-gray-800"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="emailAddress">Email address</Label>
          <Input
            id="emailAddress"
            value={email}
            onChange={(e) => isEditing && setEmail(e.target.value)}
            disabled={!isEditing}
            className={!isEditing ? "bg-gray-100 dark:bg-gray-800" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="oldPassword">Old Password</Label>
          <Input
            id="oldPassword"
            type="password"
            value={oldPasswordDisplay}
            onChange={(e) => setOldPasswordDisplay(e.target.value)}
            disabled={!isEditing}
            className={!isEditing ? "bg-gray-100 dark:bg-gray-800" : ""}
          />
        </div>
        {isEditing && (
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end mt-6 space-x-2">
        {isEditing && (
          <Button
            onClick={handleCancelEdit}
            variant="outline"
            className="border-[#956FD6] text-[#956FD6] hover:bg-[#F3E8FF] hover:text-[#956FD6] py-2 px-6 rounded-lg"
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleSaveOrEdit}
          className="bg-[#956FD6] hover:bg-[#805bbd] text-white py-2 px-6 rounded-lg"
          disabled={isLoading}
        >
          {isLoading
            ? "Saving..."
            : isEditing
            ? "Save Changes"
            : "Edit Profile"}
        </Button>
      </div>

      <footer className="w-full mt-10 p-[14px] flex flex-col gap-2">
        <p className="font-normal text-[14px] leading-[20px] text-[#707070]">
          Frequently used tools
        </p>
        <div className="flex flex-row items-center space-x-2">
          <Image
            src="/assets/pinterest.svg"
            width={20}
            height={20}
            alt="pinterest"
          />
          <Image
            src="/assets/dribble.svg"
            width={20}
            height={20}
            alt="dribble"
          />
          <Image src="/assets/google.svg" width={20} height={20} alt="google" />
        </div>
      </footer>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <div className="container mx-auto p-8 bg-white shadow-lg card-morph w-[90%] h-[90vh] mt-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-800">Your Profile</h1>
        <span className="text-sm text-gray-500 flex items-center gap-1">
          Edit profile <Pencil className="w-4 h-4" />
        </span>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General Settings</TabsTrigger>
          <TabsTrigger value="payments">Payment Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-6">
          <GeneralSettingsTabContent />
        </TabsContent>
        <TabsContent value="payments" className="mt-6 h-full">
          <div className="text-center text-gray-500 py-10">
            Payment settings coming soon...
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
