"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import Google from "../../../../public/assets/google.svg";
import huddleLogo from "../../../../public/assets/images/huddle-logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithPopup, UserCredential } from "firebase/auth"; // Import UserCredential
import { auth, googleProvider } from "../../../../config/firebase";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import { backendUri } from "@/lib/config";

// Define an interface for the expected response from /api/v1/auth/me
interface UserProfileData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_user_onboarded: boolean; // The field we need
  // Add other fields you expect from your /auth/me endpoint
}

const SignIn = () => {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles fetching user data from /api/v1/auth/me and redirects based on onboarding status.
   * @param token The access token to use for authentication.
   */
  const handleAuthSuccessAndRedirect = async (token: string) => {
    try {
      const meResponse = await fetch(`${backendUri}/api/v1/auth/me`, {
        method: "GET", // Generally GET for fetching user data
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Good practice even for GET
        },
      });

      if (!meResponse.ok) {
        const errorData = await meResponse.json();
        throw new Error(
          errorData.message || "Failed to fetch user profile after login."
        );
      }

      const userData: UserProfileData = await meResponse.json();
      // Store the entire user data in local storage as well for easier access across components
      localStorage.setItem("userData", JSON.stringify(userData));

      if (userData.is_user_onboarded) {
        router.push("/dashboard");
      } else {
        router.push("/onBoarding");
      }
      toast({
        description: "Login Successful!",
      });
    } catch (meError: any) {
      console.error(
        "Error during post-login user data fetch or redirect:",
        meError
      );
      setError(meError.message || "An error occurred during login process.");
      toast({
        description:
          meError.message || "An error occurred after login. Please try again.",
        variant: "destructive",
      });
      // Important: If fetching user data fails, clear the token and send back to sign-in
      localStorage.removeItem("token");
      router.push("/auth/Sign-in");
    }
  };

  // const SignInWithGoogle = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const result: UserCredential = await signInWithPopup(
  //       auth,
  //       googleProvider
  //     );
  //     const idToken = await result.user.getIdToken(); // Get Firebase ID Token

  //     // Step 1: Send Firebase ID token to your backend to get your backend's access_token
  //     // Replace `/api/v1/auth/google-login` with your actual backend endpoint for Google auth.
  //     const backendAuthResponse = await fetch(
  //       `${backendUri}/api/v1/auth/google-login`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ id_token: idToken }), // Send the Firebase ID token to your backend
  //       }
  //     );

  //     if (!backendAuthResponse.ok) {
  //       const errorData = await backendAuthResponse.json();
  //       throw new Error(
  //         errorData.message || "Backend authentication with Google failed."
  //       );
  //     }

  //     const backendData = await backendAuthResponse.json();
  //     const backendAccessToken = backendData.access_token; // Your backend's access token

  //     if (!backendAccessToken) {
  //       throw new Error("Backend did not return an access token.");
  //     }

  //     localStorage.setItem("token", backendAccessToken);

  //     // Step 2: Use the backend access token to fetch user profile and redirect
  //     await handleAuthSuccessAndRedirect(backendAccessToken);
  //   } catch (err: any) {
  //     console.error("Google sign-in process failed:", err);
  //     setError(
  //       err.message || "Failed to sign in with Google. Please try again."
  //     );
  //     toast({
  //       description:
  //         err.message || "Failed to sign in with Google. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Failed to authenticate. Please check your Email or password again."
        );
      }

      const data = await response.json();
      console.log(data, data.access_token);

      const accessToken = data.access_token;
      if (!accessToken) {
        throw new Error("Login successful but no access token received.");
      }
      localStorage.setItem("token", accessToken);

      // Call the new helper function to fetch user data and redirect
      await handleAuthSuccessAndRedirect(accessToken);
    } catch (err: any) {
      setError(err.message);
      toast({
        description:
          err.message || "An unexpected error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row justify-center items-center text-black overflow-hidden relative">
      <div className="flex flex-col lg:flex-row w-full h-full lg:h-screen">
        <div className="w-full gap-10 lg:w-2/3 bg-white flex flex-col justify-center items-center py-8 px-4 sm:px-6 md:px-8 lg:py-0 lg:px-0">
          <Image src={"/assets/logo.svg"} alt="logo" width={60} height={30} />
          <div className="flex flex-col items-center justify-center w-full">
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
                        id="email"
                        disabled={loading}
                        type="email"
                        value={emailAddress}
                        placeholder="@gmail.com"
                        onChange={(e) => setEmailAddress(e.target.value)}
                        required
                        className="shadow-lg rounded-[8px]"
                      />
                    </div>
                    <div>
                      <label htmlFor="password">Password</label>
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
                      className="bg-[#5C5CE9] mt-8 mb-4 rounded-[8px] w-full py-2"
                    >
                      {loading ? <h1>Logging In....</h1> : <h1>Sign In</h1>}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="mt-8 relative w-full px-4 sm:px-0"></div>
        </div>
        <div className="hidden lg:block lg:w-1/3">
          <Image
            src={huddleLogo}
            alt="Huddle Logo - Collaborative Workspace"
            className="w-full h-full object-cover rounded-t-[12px] rounded-bl-[12px]"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
