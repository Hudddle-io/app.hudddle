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
import { toast } from "@/components/ui/use-toast";
// import { title } from "process"; // This import is likely unused and can be removed
import Link from "next/link";
import { backendUri } from "@/lib/config";
// import { storeToken } from '@/utils'; // Commented out as in original

const SignIn = () => {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const SignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast({ description: "Logged in with Google!" }); // Added toast for Google sign-in
      router.push("/onBoarding");
    } catch (err) {
      console.error(err);
      toast({
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive", // Add a destructive variant for errors
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUri}/api/v1/auth/login`, {
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
        // You might want to parse response.json() here to get more specific error messages from your backend
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Failed to authenticate. Please check your Email or password again"
        );
      }
      const data = await response.json();
      console.log(data, data.access_token);
      localStorage.setItem("token", data.access_token);
      router.push("/onBoarding");
      toast({
        description: "Login Successful",
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        description: err.message || "An unexpected error occurred.",
        variant: "destructive",
      });
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
        {/* Left Section (Form): full width on small, 2/3 on large, centered content */}
        <div className="w-full lg:w-2/3 bg-white flex flex-col justify-center items-center py-8 px-4 sm:px-6 md:px-8 lg:py-0 lg:px-0">
          <div className="flex flex-col items-center justify-center w-full">
            {/* Form Card: flexible width, max-width to prevent stretching, responsive padding */}
            <div className="card-morph p-6 sm:p-10 w-full max-w-md md:max-w-lg lg:max-w-[539px] bg-[#FDFCFC] rounded-[12px] border border-transparent">
              <div className="flex flex-col space-y-5">
                <h1 className="text-[28px] sm:text-[36px] font-inter font-semibold text-center leading-[36px] sm:leading-[43.57px]">
                  Sign In
                </h1>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col space-y-6 sm:space-y-8">
                    <div>
                      <label htmlFor="email">Email Address</label>
                      <Input
                        id="email" // Added id for accessibility
                        disabled={loading}
                        type="email" // Changed to type="email" for better validation
                        value={emailAddress}
                        placeholder="@gmail.com"
                        onChange={(e) => setEmailAddress(e.target.value)}
                        required
                        className="shadow-lg rounded-[8px]" // Changed to 8px for consistency with other inputs
                      />
                    </div>
                    <div>
                      <label htmlFor="password">Password</label>{" "}
                      {/* Added id for accessibility */}
                      <Input
                        id="password"
                        disabled={loading}
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow-lg rounded-[8px] mb-6 sm:mb-8 placeholder-slate-300"
                        required
                      />
                    </div>
                    <p className="text-center pt-4 sm:pt-6 text-sm sm:text-base">
                      Don&apos;t have an account?{" "}
                      <span className="text-violet-500 hover:text-violet-800 hover:underline">
                        <Link href="/auth/Sign-up">Sign up</Link>
                      </span>
                    </p>
                    {error && (
                      <p className="text-red-500 text-center text-sm mt-2">
                        {error}
                      </p>
                    )}
                    <Button
                      type="submit"
                      size={"sm"}
                      disabled={loading}
                      // Reduced margin on mobile, kept large on desktop
                      className="bg-[#5C5CE9] mt-8 mb-4 rounded-[8px] w-full py-2" // Full width button
                    >
                      {loading ? <h1>Logging In....</h1> : <h1>Sign In</h1>}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          {/* Google Sign-in Button: flexible width, centered */}
          <div className="mt-8 relative w-full px-4 sm:px-0">
            {" "}
            {/* Added padding for small screens */}
            <Button
              onClick={SignInWithGoogle}
              className="w-full max-w-xs sm:max-w-[400px] mx-auto flex justify-center text-black space-x-3 border rounded-md border-slate-200 bg-[#CACACA33] py-2"
            >
              <Image src={Google} width={20} height={20} alt="google icon" />
              <h1>Sign In with Google</h1>
            </Button>
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

export default SignIn;
