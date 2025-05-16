"use client";

import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { app } from "../../../config/firebase";
import Image from "next/image";
import logo from "../../../public/assets/logo.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import onBoarding from "../../../public/assets/images/onboard.png";
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
import { getToken } from "@/contexts/useUserSession";
import {
  useUserSessionContext,
  UserSessionProvider,
} from "@/contexts/useUserContext";
import { MainHeading, SubHeading } from "@/components/basics/Heading";
import { backendUri } from "@/lib/config";

const FormSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  occupation: z.string({
    required_error: "Please select the kind of user you are.",
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
  const { currentUser } = useUserSessionContext();

  useEffect(() => {
    if (currentUser?.first_name && currentUser?.last_name) {
      console.log("Profile already exists, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [currentUser?.first_name, currentUser?.last_name, router]); // Minimized dependencies to avoid unnecessary re-renders

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

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setLoading(true);
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No access token found.");
      }

      const response = await fetch(`${backendUri}/api/v1/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          user_type: data.occupation,
          find_us: data.awareness,
          software_used: data.software
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile.");
      }
      console.log("This is the response ", +response.json());
      toast({
        title: "Profile Updated Successfully!",
      });
      router.push("/dashboard");
    } catch (err) {
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
      <div className="w-full min-h-screen bg-white">
        <div className="flex justify-between items-center">
          <div className="w-full min-h-screen pl-32 bg-white flex flex-col justify-center">
            <div className="flex flex-col space-y-8">
              <div>
                <Image
                  src={logo}
                  alt="huddle-logo"
                  className="w-[clamp(clamp(3.125rem,_4.2735vw,_6.25rem))] h-[clamp(1.5625rem,_2.1368vh,_3.125rem)]"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <MainHeading className="text-[#211451]">
                  Just one more step!
                </MainHeading>
                <SubHeading className="text-[#211451]">
                  Let’s personalize your Hudddle experience.
                </SubHeading>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-2/3 space-y-6"
                >
                  <div className="w-full flex flex-row space-x-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel className="text-[#44546F] leading-[16px] text-[16px] font-light">
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
                        <FormItem className="w-1/2">
                          <FormLabel className="text-[#44546F] leading-[16px] text-[16px] font-light">
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
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[#44546F] leading-[16px] text-[16px] font-light">
                          Which Kind of user are you?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder="Individual"
                                className="placeholder-[#626F86]"
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Engineering</SelectLabel>
                              <SelectItem value="frontend">
                                Frontend Developer
                              </SelectItem>
                              <SelectItem value="backend">
                                Backend Developer
                              </SelectItem>
                              <SelectItem value="fullstack">
                                Fullstack Developer
                              </SelectItem>
                              <SelectItem value="mobile">
                                Mobile Developer
                              </SelectItem>
                              <SelectItem value="devops">
                                DevOps Engineer
                              </SelectItem>
                              <SelectItem value="qa">QA Engineer</SelectItem>
                              <SelectItem value="embedded">
                                Embedded Systems Engineer
                              </SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Design</SelectLabel>
                              <SelectItem value="uxui">
                                UX/UI Designer
                              </SelectItem>
                              <SelectItem value="product">
                                Product Designer
                              </SelectItem>
                              <SelectItem value="graphic">
                                Graphic Designer
                              </SelectItem>
                              <SelectItem value="motion">
                                Motion Designer
                              </SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Data</SelectLabel>
                              <SelectItem value="dataScience">
                                Data Scientist
                              </SelectItem>
                              <SelectItem value="dataEngineer">
                                Data Engineer
                              </SelectItem>
                              <SelectItem value="dataAnalyst">
                                Data Analyst
                              </SelectItem>
                              <SelectItem value="mlEngineer">
                                ML Engineer
                              </SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Management</SelectLabel>
                              <SelectItem value="projectManager">
                                Project Manager
                              </SelectItem>
                              <SelectItem value="productManager">
                                Product Manager
                              </SelectItem>
                              <SelectItem value="engineeringManager">
                                Engineering Manager
                              </SelectItem>
                              <SelectItem value="cto">
                                CTO/Technical Director
                              </SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                              <SelectLabel>Other Tech</SelectLabel>
                              <SelectItem value="security">
                                Security Engineer
                              </SelectItem>
                              <SelectItem value="sre">
                                Site Reliability Engineer
                              </SelectItem>
                              <SelectItem value="cloud">
                                Cloud Architect
                              </SelectItem>
                              <SelectItem value="blockchain">
                                Blockchain Developer
                              </SelectItem>
                              <SelectItem value="game">
                                Game Developer
                              </SelectItem>
                            </SelectGroup>
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
                        <FormLabel className="text-[#44546F] leading-[16px] text-[16px] font-light">
                          Where did you find us?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
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
                            <SelectItem value="Web search">
                              Web search
                            </SelectItem>
                            <SelectItem value="Word-of-Mouth">
                              Word of Mouth
                            </SelectItem>
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
                        <FormLabel className="text-[#44546F] leading-[16px] text-[16px] font-light">
                          What software/s do you use the most?
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            type="text"
                            placeholder="e.g., Figma, VS Code, Jira"
                            className="w-full h-12 border border-[#E0E0E0] rounded-[8px] px-4"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button className="w-full" type="submit">
                    {loading ? "Finishing setup..." : "Finish Setup"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
          <div className="relative w-5/6 overflow-hidden">
            <div className="absolute top-[70%] left-[10%]">
              <MainHeading className="text-white">
                Connect and work <br /> with friends <br />
                ...
              </MainHeading>
            </div>
            <Image
              src={onBoarding}
              alt=""
              className="z-[800px] w-full h-screen object-cover"
            />
          </div>
        </div>
      </div>
    </UserSessionProvider>
  );
};

export default OnBoarding;
