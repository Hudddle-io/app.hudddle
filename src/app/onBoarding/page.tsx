"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { getToken } from "@/contexts/useUserSession";
import {
  useUserSessionContext,
  UserSessionProvider,
} from "@/contexts/useUserContext";
import { MainHeading } from "@/components/basics/Heading";
import { backendUri } from "@/lib/config";
import logo from "../../../public/assets/logo.svg";
import onBoardingImage from "../../../public/assets/images/onboard.png";

const SUGGESTED_SOFTWARE = ["Photoshop", "Figma", "Github"];

const OCCUPATION_OPTIONS = [
  {
    label: "Engineering",
    options: [
      "Frontend Developer",
      "Backend Developer",
      "Fullstack Developer",
      "Mobile Developer",
      "DevOps Engineer",
      "QA Engineer",
      "Embedded Systems Engineer",
    ],
  },
  {
    label: "Design",
    options: [
      "UX/UI Designer",
      "Product Designer",
      "Graphic Designer",
      "Motion Designer",
    ],
  },
  {
    label: "Data",
    options: ["Data Scientist", "Data Engineer", "Data Analyst", "ML Engineer"],
  },
  {
    label: "Management",
    options: [
      "Project Manager",
      "Product Manager",
      "Engineering Manager",
      "CTO/Technical Director",
    ],
  },
  {
    label: "Other Tech",
    options: [
      "Security Engineer",
      "Site Reliability Engineer",
      "Cloud Architect",
      "Blockchain Developer",
      "Game Developer",
    ],
  },
];

const AWARENESS_OPTIONS = [
  { value: "Website", label: "Website" },
  { value: "Social Media", label: "Social Media" },
  { value: "Friends and family", label: "Friends and family" },
  { value: "Web search", label: "Web search" },
  { value: "Word-of-Mouth", label: "Word of Mouth" },
];

const FormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  occupation: z.string({ required_error: "Please select your occupation." }),
  awareness: z.string({ required_error: "Please select how you found us." }),
  software: z.string({
    required_error: "Please specify the software you use.",
  }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

const OnBoarding = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { currentUser, refreshUser } = useUserSessionContext();

  useEffect(() => {
    if (currentUser?.is_user_onboarded) {
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      occupation: "Frontend Developer",
      awareness: "Website",
      software: "",
    },
  });

  const onSubmit = async (data: FormSchemaType) => {
    setLoading(true);

    try {
      const token = getToken();
      if (!token) {
        throw new Error("No access token found. Please log in again.");
      }

      const response = await fetch(
        `${backendUri}/api/v1/auth/update-profile-data`,
        {
          method: "PATCH",
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

      await refreshUser?.();

      toast({
        title: "Profile Updated Successfully!",
        description: "Your profile has been updated. Welcome to Hudddle!",
      });
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserSessionProvider>
      <div className="w-full h-auto bg-white flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 h-auto bg-white flex flex-col justify-center py-6 px-4 sm:px-6 md:px-8 lg:px-16 overflow-y-auto">
          <div className="flex flex-col space-y-6 sm:space-y-8">
            <Image
              src={logo}
              alt="Huddle Logo"
              className="w-30 object-contain"
            />

            <div className="space-y-2">
              <h1 className="text-[#211451] text-4xl font-bold">
                Just one more step!
              </h1>
              <p className="text-[#211451] text-lg">
                Let&apos;s personalize your Hudddle experience.
              </p>
            </div>
            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full max-w-lg space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-[#44546F] text-sm font-light">
                          First Name
                        </FormLabel>
                        <Input
                          {...field}
                          disabled={loading}
                          placeholder="First Name"
                          className="h-12 border-[#E0E0E0] rounded-lg"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel className="text-[#44546F] text-sm font-light">
                          Last Name
                        </FormLabel>
                        <Input
                          {...field}
                          disabled={loading}
                          placeholder="Last Name"
                          className="h-12 border-[#E0E0E0] rounded-lg"
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#44546F] text-sm font-light">
                        Which kind of user are you?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-[#E0E0E0] rounded-lg">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OCCUPATION_OPTIONS.map((group) => (
                            <SelectGroup key={group.label}>
                              <SelectLabel>{group.label}</SelectLabel>
                              {group.options.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="awareness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#44546F] text-sm font-light">
                        Where did you find us?
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={loading}
                      >
                        <FormControl>
                          <SelectTrigger className="h-12 border-[#E0E0E0] rounded-lg">
                            <SelectValue placeholder="Select a source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {AWARENESS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="software"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#44546F] text-sm font-light">
                        What software/s do you use the most?
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          placeholder="e.g., Figma, VS Code, Jira"
                          className="h-12 border-[#E0E0E0] rounded-lg"
                          disabled={loading}
                        />
                      </FormControl>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {SUGGESTED_SOFTWARE.map((software) => (
                          <button
                            key={software}
                            type="button"
                            onClick={() => {
                              const current = field.value || "";
                              const updated = current
                                ? `${current}, ${software}`
                                : software;
                              field.onChange(updated);
                            }}
                            className="bg-purple-100 text-purple-700 rounded-lg text-sm px-3 py-1 hover:bg-purple-200 transition-colors"
                          >
                            {software}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-base"
                >
                  {loading ? "Finishing setup..." : "Finish Setup"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
        {/* Right Section (Image and Text Overlay): Hidden on small/medium, visible on large */}
        <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-screen hidden lg:block">
          <Image
            src={onBoardingImage}
            alt="People collaborating on a project"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-64 left-24 z-10">
            <h1 className="text-white text-4xl font-bold leading-tight">
              Connect and work <br /> with friends <br />
              ...
            </h1>
          </div>
        </div>
      </div>
    </UserSessionProvider>
  );
};

export default OnBoarding;
