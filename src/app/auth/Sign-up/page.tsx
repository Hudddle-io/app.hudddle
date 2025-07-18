"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import Google from "../../../../public/assets/google.svg";
import huddleLogo from "../../../../public/assets/images/huddle-logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../../../config/firebase";
import Link from "next/link";
import { toast } from "../../../components/ui/use-toast";

import { useUserSession } from "@/contexts/useUserSession";
import { backendUri } from "@/lib/config";

const SignUp = () => {
  const { currentUser } = useUserSession(); // This might be used for auth state, but not directly in the UI here.
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const SignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        description: "Account created with Google!",
      });
      router.push("/onBoarding");
    } catch (err: any) {
      // Catch and display Firebase errors
      console.error(err);
      toast({
        description:
          err.message || "Failed to sign up with Google. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${backendUri}/api/v1/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailAddress,
          password: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get error message from backend
        throw new Error(
          errorData.message ||
            "Failed to create account. Please check your credentials."
        );
      }

      const data = await response.json();
      console.log(data);
      toast({
        description:
          "Account Created. Please check your email to verify your account.",
      });
      router.push("/auth/Sign-in");
      // setLoading(true); // This might be a logic error, usually set to false after redirect or success
    } catch (err: any) {
      console.log(err.message);
      toast({
        description:
          err.message ||
          "Failed to authenticate. Please check your credentials.",
        variant: "destructive",
      });
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Main container: full width, min height screen, flex column on small, flex row on large
    // Centered content both vertically and horizontally
    <div className="w-full min-h-screen flex flex-col lg:flex-row justify-center items-center text-black overflow-hidden relative">
      <div className="flex flex-col lg:flex-row w-full h-full lg:h-screen">
        {" "}
        {/* Adjusted height for lg screens */}
        {/* Left Section (Form): full width on small, 3/4 on large, centered content */}
        <div className="w-full lg:w-3/4 bg-white flex flex-col justify-center gap-10 items-center py-8 px-4 sm:px-6 md:px-8 lg:py-0 lg:px-0">
          <Image src={"/assets/logo.svg"} alt="logo" width={60} height={30} />
          <div className="flex flex-col items-center justify-center w-full">
            {/* Form Card: flexible width, max-width to prevent stretching, responsive padding */}
            <div className="card-morph p-6 sm:p-10 w-full max-w-md md:max-w-lg lg:max-w-[539px] bg-[#ffffff] rounded-[5px] border border-transparent">
              <div className="flex flex-col space-y-5">
                <h1 className="text-[28px] sm:text-[36px] font-inter font-semibold text-center leading-[36px] sm:leading-[43.57px]">
                  Sign Up
                </h1>

                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col space-y-6 sm:space-y-8">
                    <div>
                      <label htmlFor="email">Email Address</label>
                      <Input
                        id="email" // Added id for accessibility
                        type="email" // Changed to type="email" for better validation
                        value={emailAddress}
                        placeholder="@gmail.com"
                        onChange={(e) => setEmailAddress(e.target.value)}
                        required
                        className="shadow-lg rounded-[8px]" // Changed to 8px for consistency
                      />
                    </div>
                    <div>
                      <label htmlFor="password">Password</label>{" "}
                      {/* Added id for accessibility */}
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow-lg rounded-[8px] mb-6 sm:mb-8 placeholder-slate-300" // Adjusted margin-bottom
                        required
                      />
                    </div>
                    {error && (
                      <p className="text-red-500 text-center text-sm mt-2">
                        {error}
                      </p>
                    )}
                    <Button
                      type="submit"
                      size={"sm"}
                      disabled={loading}
                      // Adjusted margin-top/bottom and made full width
                      className="bg-[#5C5CE9] mt-8 mb-4 rounded-[8px] w-full py-2 mx-auto"
                    >
                      {loading ? (
                        <h1>Creating account ....</h1>
                      ) : (
                        <h1>Sign Up</h1>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
              <p className="text-center pt-6 sm:pt-9 text-sm sm:text-base">
                {" "}
                {/* Adjusted padding-top */}
                Already have an account?
                <span className="text-violet-500 hover:text-violet-800 hover:underline">
                  <Link href="/auth/Sign-in">Log In</Link>
                </span>
              </p>
            </div>
          </div>
          {/* Google Sign-in Button: flexible width, centered */}
          <div className="mt-8 relative w-full px-4 sm:px-0">
            {" "}
            {/* Adjusted margin-top and added padding */}
          </div>
        </div>
        {/* Right Section (Image): Hidden on small/medium screens, visible on large */}
        <div className="hidden lg:block lg:w-1/3">
          <Image
            src={huddleLogo}
            alt="Huddle Logo - Collaborative Workspace" // Descriptive alt text
            className="w-full h-full object-cover rounded-t-[12px] rounded-bl-[12px]" // Ensure image covers its container
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
