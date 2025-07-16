"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import logo from "../../../public/assets/logo.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import onBoardingImage from "../../../public/assets/images/onboard.png";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { getToken } from "@/contexts/useUserSession"; // Assuming this utility is correct
import {
  useUserSessionContext,
  UserSessionProvider,
} from "@/contexts/useUserContext"; // Import updated context
import { MainHeading, SubHeading } from "@/components/basics/Heading";
import { backendUri } from "@/lib/config"; // Ensure backendUri is correctly configured here

const FormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  occupation: z.string({
    required_error: "Please select your occupation.",
  }),
  awareness: z.string({
    required_error: "Please select how you found us.",
  }),
  software: z.string({
    required_error: "Please specify the software you use.",
  }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const OnBoarding: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // Destructure refreshUser from the context
  const { currentUser, refreshUser } = useUserSessionContext();

  // Redirect if user is already marked as onboarded
  useEffect(() => {
    // Check if currentUser exists and if the backend specifically says they are onboarded
    if (currentUser && currentUser.is_user_onboarded === true) {
      console.log("User is already onboarded, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [currentUser, router]); // Dependency array should include currentUser to react to changes

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      occupation: "Frontend Developer", // Ensure default values match SelectItem values
      awareness: "Website", // Ensure default values match SelectItem values
      software: "",
    },
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No access token found. Please log in again."); // no access found , meaning there is no login
      }

      const response = await fetch(
        `${backendUri}/api/v1/auth/update-profile-data`, // Ensure this URL is correct
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            first_name: data.firstName,
            last_name: data.lastName,
            is_user_onboarded: true,
            user_type: data.occupation,
            find_us: data.awareness,
            software_used: data.software
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile.");
      }

      // IMPORTANT: Trigger a refetch of the user data in the context
      // This ensures that `currentUser` in the context is updated with the new profile info
      // so the useEffect guard works correctly on subsequent renders/visits.
      if (refreshUser) {
        await refreshUser();
        console.log("User session refreshed after profile update.");
      } else {
        console.warn(
          "refreshUser function not available in context. User state might be stale."
        );
      }

      toast({
        title: "Profile Updated Successfully!",
        description: "Your profile has been updated. Welcome to Hudddle!",
        variant: "default",
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast({
        title: "Error",
        description:
          err instanceof Error ? err.message : "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserSessionProvider>
      {/* Main container: full width, min height screen, flex column on small, flex row on large */}
      <div className="w-full min-h-screen h-auto bg-white flex flex-col lg:flex-row">
        {/* Left Section (Form): full width on small, half width on large, centered content */}
        <div className="w-full lg:w-1/2 min-h-screen h-auto bg-white flex flex-col justify-center py-8 px-4 sm:px-6 md:px-8 lg:px-16">
          <div className="flex flex-col space-y-6 sm:space-y-8">
            {/* Logo */}
            <div>
              <Image
                src={logo}
                alt="Huddle Logo"
                className="w-[clamp(3.125rem,_4.2735vw,_6.25rem)] h-[clamp(1.5625rem,_2.1368vh,_3.125rem)] object-contain"
              />
            </div>
            {/* Headings */}
            <div className="flex flex-col space-y-1 sm:space-y-2">
              <MainHeading className="text-[#211451] text-[clamp(1.5rem,_4vw_+_1rem,_2.5rem)]">
                Just one more step!
              </MainHeading>
              <SubHeading className="text-[#211451] text-[clamp(0.875rem,_2vw_+_0.5rem,_1.25rem)]">
                Let’s personalize your Hudddle experience.
              </SubHeading>
            </div>
            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-lg space-y-6"
              >
                {/* First Name & Last Name Fields */}
                <div className="w-full flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-1/2">
                        <FormLabel className="text-[#44546F] leading-[16px] text-[14px] sm:text-[16px] font-light">
                          First Name
                        </FormLabel>
                        <Input
                          {...field}
                          type="text"
                          placeholder="First Name"
                          className="w-full h-12 border border-[#E0E0E0] rounded-[8px] px-4"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="w-full sm:w-1/2">
                        <FormLabel className="text-[#44546F] leading-[16px] text-[14px] sm:text-[16px] font-light">
                          Last Name
                        </FormLabel>
                        <Input
                          {...field}
                          disabled={loading}
                          type="text"
                          placeholder="Last Name"
                          className="w-full h-12 border border-[#E0E0E0] rounded-[8px] px-4"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Occupation Select */}
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#44546F] leading-[16px] text-[14px] sm:text-[16px] font-light">
                        Which Kind of user are you?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12 border border-[#E0E0E0] rounded-[8px] px-4">
                            <SelectValue
                              placeholder="Individual"
                              className="placeholder-[#626F86]"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Engineering</SelectLabel>
                            <SelectItem value="Frontend Developer">
                              Frontend Developer
                            </SelectItem>
                            <SelectItem value="Backend Developer">
                              Backend Developer
                            </SelectItem>
                            <SelectItem value="Fullstack Developer">
                              Fullstack Developer
                            </SelectItem>
                            <SelectItem value="Mobile Developer">
                              Mobile Developer
                            </SelectItem>
                            <SelectItem value="DevOps Engineer">
                              DevOps Engineer
                            </SelectItem>
                            <SelectItem value="QA Engineer">
                              QA Engineer
                            </SelectItem>
                            <SelectItem value="Embedded Systems Engineer">
                              Embedded Systems Engineer
                            </SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Design</SelectLabel>
                            <SelectItem value="UX/UI Designer">
                              UX/UI Designer
                            </SelectItem>
                            <SelectItem value="Product Designer">
                              Product Designer
                            </SelectItem>
                            <SelectItem value="Graphic Designer">
                              Graphic Designer
                            </SelectItem>
                            <SelectItem value="Motion Designer">
                              Motion Designer
                            </SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Data</SelectLabel>
                            <SelectItem value="Data Scientist">
                              Data Scientist
                            </SelectItem>
                            <SelectItem value="Data Engineer">
                              Data Engineer
                            </SelectItem>
                            <SelectItem value="Data Analyst">
                              Data Analyst
                            </SelectItem>
                            <SelectItem value="ML Engineer">
                              ML Engineer
                            </SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Management</SelectLabel>
                            <SelectItem value="Project Manager">
                              Project Manager
                            </SelectItem>
                            <SelectItem value="Product Manager">
                              Product Manager
                            </SelectItem>
                            <SelectItem value="Engineering Manager">
                              Engineering Manager
                            </SelectItem>
                            <SelectItem value="CTO/Technical Director">
                              CTO/Technical Director
                            </SelectItem>
                          </SelectGroup>
                          <SelectGroup>
                            <SelectLabel>Other Tech</SelectLabel>
                            <SelectItem value="Security Engineer">
                              Security Engineer
                            </SelectItem>
                            <SelectItem value="Site Reliability Engineer">
                              Site Reliability Engineer
                            </SelectItem>
                            <SelectItem value="Cloud Architect">
                              Cloud Architect
                            </SelectItem>
                            <SelectItem value="Blockchain Developer">
                              Blockchain Developer
                            </SelectItem>
                            <SelectItem value="Game Developer">
                              Game Developer
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Awareness Select */}
                <FormField
                  control={form.control}
                  name="awareness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#44546F] leading-[16px] text-[14px] sm:text-[16px] font-light">
                        Where did you find us?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full h-12 border border-[#E0E0E0] rounded-[8px] px-4">
                            <SelectValue
                              placeholder="Website Search"
                              className="placeholder-[#626F86] ring-1 ring-[#091e4213]"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Website">Website</SelectItem>
                          <SelectItem value="Social Media">
                            Social Media
                          </SelectItem>
                          <SelectItem value="Friends and family">
                            Friends and family
                          </SelectItem>
                          <SelectItem value="Web search">Web search</SelectItem>
                          <SelectItem value="Word-of-Mouth">
                            Word of Mouth
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Software Input */}
                <FormField
                  control={form.control}
                  name="software"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#44546F] leading-[16px] text-[14px] sm:text-[16px] font-light">
                        What software/s do you use the most?
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          type="text"
                          placeholder="e.g., Figma, VS Code, Jira"
                          className="w-full h-12 border border-[#E0E0E0] rounded-[8px] px-4"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Submit Button */}
                <Button
                  className="w-full py-3 text-[16px]"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Finishing setup..." : "Finish Setup"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        {/* Right Section (Image and Text Overlay): Hidden on small/medium, visible on large */}
        <div className="relative  h-auto w-full lg:w-1/2 min-h-[300px] lg:min-h-screen hidden lg:block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 p-4 ">
            <MainHeading className="text-white text-[clamp(1.5rem,_4vw_+_1rem,_2.5rem)]">
              Connect and work <br /> with friends <br />
              ...
            </MainHeading>
          </div>
          <Image
            src={onBoardingImage}
            alt="People collaborating on a project"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </UserSessionProvider>
  );
};

export default OnBoarding;
