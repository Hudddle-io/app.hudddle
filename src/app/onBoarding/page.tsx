"use client";

import { getAuth } from 'firebase/auth'
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { app } from '../../../config/firebase';
import Image from 'next/image';
import logo from "../../../public/assets/logo.svg";
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "@/components/ui/use-toast";
import onBoarding  from "../../../public/assets/onBoarding.svg";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { useUserSession } from '@/contexts/useUserSession';
import { getToken } from '@/contexts/useUserSession';

const FormSchema = z.object({
  firstName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  occupation: z
    .string({
      required_error: "Please select the kind of user you are ",
    }),
  awareness: z
    .string({
      required_error: "Please select the kind of user you are ",
    }),
  software: z
    .string({
      required_error: "Please select the kind of user you are ",
    }),
})

const OnBoarding = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const auth = getAuth(app);
  const user = auth.currentUser;

  const { currentUser } = useUserSession();

  useEffect(() => {
    if (currentUser?.first_name && currentUser?.last_name) {
      console.log("Profile already exists, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [currentUser, router]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      occupation: "Frontend Developer",
      awareness: "Website", 
      software: ""
    }
  })
  
   const onSubmit = async(data:z.infer<typeof FormSchema>) => {
      setLoading(true);
      // setError(null);
        try{
          const token = getToken();
          if(!token){
            throw new Error("No access token found.");
          }

          console.log(data);

          const onBoardingData = await fetch("https://hudddle-backend.onrender.com/api/v1/auth/update-profile", { 
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              first_name: data.firstName,
              last_name: data.lastName,
              user_type: data.occupation,
              find_us: data.awareness, 
              software_used: data.software.split(',').map(item => item.trim()).filter(Boolean),
            }),
          });
          const responseData = await onBoardingData.json();
          if (!onBoardingData.ok) {
           console.log("Error", responseData);
            // const errorResponse = await onBoardingData.json();
            // throw new Error(`Failed to onBoard user ${errorResponse.message}`);
          }
          console.log("Current user", currentUser)
          console.log("Response:", responseData);
          router.push("/dashboard");
      
          toast({
            title: "Profile Updated Successfully!",
          });
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        console.error("Error:", err);
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : "Failed to update profile",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
  }
  return (
    <div className='w-full min-h-screen bg-white'>
      <div className='flex justify-between items-center'>
      <div className='w-2/4 min-h-screen pl-32 bg-white'>
        <div className='flex flex-col -mt-20 space-y-8'>
          <div>
            <Image src={logo} alt="huddle-logo" className='-mt-12'/>
          </div>
          <div className='flex flex-col space-y-2'>
            <h1 className='text-[#211451] text-[45px] leading-[60px] font-bold font-inria'>Just one more step!</h1>
            <h1 className='text-[#211451] text-[20px] font-medium'>Let’s personalize your Hudddle experience. </h1>
          </div>
          <div className='flex flex-col space-x-3'>
            {/* For the "What Kind of User are you " */}
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
      <div className="flex flex-row space-x-4">
        <FormField
        control={form.control}
        name="firstName"
        render={({field}) => (
          <FormItem>
            <FormLabel className="text-[#44546F] leading-[16px] text-[16px] font-light">First Name</FormLabel>
            <Input {...field} type="text" placeholder="First Name"  className="w-full h-12 border border-[#E0E0E0] rounded-[8px] px-4" />
            <FormMessage />
          </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="lastName"
        render={({field}) => (
          <FormItem>
            <FormLabel className="text-[#44546F] leading-[16px] text-[16px] font-light">Last Name</FormLabel>
            <Input {...field} disabled={loading} type="text" placeholder="Last Name" className="w-full h-12 border border-[#E0E0E0] rounded-[8px] px-4" />
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
              <FormLabel className="text-[#44546F] leading-[16px] text-[16px] font-light">Which Kind of user are you?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Individual" className="placeholder-[#626F86]"/>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Engineering */}
                  <SelectGroup>
                    <SelectLabel>Engineering</SelectLabel>
                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                    <SelectItem value="backend">Backend Developer</SelectItem>
                    <SelectItem value="fullstack">Fullstack Developer</SelectItem>
                    <SelectItem value="mobile">Mobile Developer</SelectItem>
                    <SelectItem value="devops">DevOps Engineer</SelectItem>
                    <SelectItem value="qa">QA Engineer</SelectItem>
                    <SelectItem value="embedded">Embedded Systems Engineer</SelectItem>
                  </SelectGroup>

                  {/* Design */}
                  <SelectGroup>
                    <SelectLabel>Design</SelectLabel>
                    <SelectItem value="uxui">UX/UI Designer</SelectItem>
                    <SelectItem value="product">Product Designer</SelectItem>
                    <SelectItem value="graphic">Graphic Designer</SelectItem>
                    <SelectItem value="motion">Motion Designer</SelectItem>
                  </SelectGroup>

                  {/* Data */}
                  <SelectGroup>
                    <SelectLabel>Data</SelectLabel>
                    <SelectItem value="dataScience">Data Scientist</SelectItem>
                    <SelectItem value="dataEngineer">Data Engineer</SelectItem>
                    <SelectItem value="dataAnalyst">Data Analyst</SelectItem>
                    <SelectItem value="mlEngineer">ML Engineer</SelectItem>
                  </SelectGroup>

                  {/* Management */}
                  <SelectGroup>
                    <SelectLabel>Management</SelectLabel>
                    <SelectItem value="projectManager">Project Manager</SelectItem>
                    <SelectItem value="productManager">Product Manager</SelectItem>
                    <SelectItem value="engineeringManager">Engineering Manager</SelectItem>
                    <SelectItem value="cto">CTO/Technical Director</SelectItem>
                  </SelectGroup>

                  {/* Other Tech */}
                  <SelectGroup>
                    <SelectLabel>Other Tech</SelectLabel>
                    <SelectItem value="security">Security Engineer</SelectItem>
                    <SelectItem value="sre">Site Reliability Engineer</SelectItem>
                    <SelectItem value="cloud">Cloud Architect</SelectItem>
                    <SelectItem value="blockchain">Blockchain Developer</SelectItem>
                    <SelectItem value="game">Game Developer</SelectItem>
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
              <FormLabel className="text-[#44546F] leading-[16px] text-[16px] font-light">Where did you find us?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Website Search" className="placeholder-[#626F86]" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Website">Website</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Friends and family">Friends and family</SelectItem>
                  <SelectItem value="Web search">Web search</SelectItem>
                  <SelectItem value="Word-of-Mouth">Word of Mouth</SelectItem>
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
                  <FormDescription className="text-[#626F86] text-sm">
                    Separate multiple tools with commas
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        />
        <Button className='w-full' type="submit">
          {loading ? "Finishing setup..." : "Finish Setup"}
          </Button>
      </form>
    </Form>
    </div>
        </div>
      </div>
      <div className='relative overflow-hidden'>
      <div className='absolute bottom-20 -translate-y-1/2 transform -translate-x-1/2  left-8'>
        <text className='font-inria leading-[55px] text-[50px] font-bold text-[#fffff]'>Connect and work with friends</text>
        </div>
        <Image src={onBoarding} alt="" className='z-[800px] min-h-screen'/>
       
      </div>
      </div>
        </div>
  )
}

export default OnBoarding