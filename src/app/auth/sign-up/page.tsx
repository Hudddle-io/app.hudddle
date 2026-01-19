"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithPopup, UserCredential } from "firebase/auth";
import { auth, googleProvider } from "../../../../config/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { backendUri } from "@/lib/config";
import Google from "../../../../public/assets/google.svg";
import huddleLogo from "../../../../public/assets/images/huddle-logo.png";

const SignUp = () => {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuthSuccessAndRedirect = async (token: string) => {
    try {
      const meResponse = await fetch(`${backendUri}/api/v1/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!meResponse.ok) {
        const errorData = await meResponse.json();
        throw new Error(
          errorData.message || "Failed to fetch user profile after login."
        );
      }

      const userData = await meResponse.json();
      localStorage.setItem("userData", JSON.stringify(userData));

      const destination = userData?.is_user_onboarded
        ? "/dashboard"
        : "/onBoarding";
      router.push(destination);
    } catch (meError: any) {
      console.error("Error during post-auth user data fetch:", meError);
      setError(meError.message || "An error occurred during sign up.");
      toast({
        description:
          meError.message ||
          "An error occurred after sign up. Please try again.",
        variant: "destructive",
      });
      localStorage.removeItem("token");
      router.push("/auth/sign-in");
    }
  };

  const SignUpWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: UserCredential = await signInWithPopup(
        auth,
        googleProvider
      );
      const idToken = await result.user.getIdToken();

      const backendAuthResponse = await fetch(
        `${backendUri}/api/v1/auth/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id_token: idToken }),
        }
      );

      if (!backendAuthResponse.ok) {
        const errorData = await backendAuthResponse.json();
        throw new Error(
          errorData.message || "Backend authentication with Google failed."
        );
      }

      const backendData = await backendAuthResponse.json();
      const backendAccessToken = backendData.access_token;
      if (!backendAccessToken) {
        throw new Error("Backend did not return an access token.");
      }

      localStorage.setItem("token", backendAccessToken);

      toast({
        description: "Signed up with Google!",
      });

      await handleAuthSuccessAndRedirect(backendAccessToken);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "Failed to sign up with Google. Please try again."
      );
      toast({
        description:
          err.message || "Failed to sign up with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      toast({
        description:
          "Account Created. Please check your email to verify your account.",
      });
      router.push("/auth/sign-in");
    } catch (err: any) {
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
    <div className="w-full min-h-screen flex items-center justify-center text-black overflow-hidden relative bg-white">
      <div className="flex flex-col lg:flex-row w-full h-full lg:h-screen">
        {/* Sign Up Form Section */}
        <div className="w-full lg:w-2/3 bg-white flex flex-col justify-center items-center gap-10 py-8 px-4 sm:px-6 md:px-8 lg:py-0">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="p-8 sm:p-10 w-full max-w-md md:max-w-lg lg:max-w-[539px] bg-[#FDFCFC] rounded-[20px] shadow-[0_8px_16px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.06),0_24px_48px_rgba(0,0,0,0.04)]">
              <h1 className="text-3xl sm:text-4xl font-inter font-semibold text-center mb-8">
                Sign Up
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Email address
                  </label>
                  <Input
                    id="email"
                    disabled={loading}
                    type="email"
                    value={emailAddress}
                    placeholder="@gmail.com"
                    onChange={(e) => setEmailAddress(e.target.value)}
                    required
                    className="rounded-lg border border-gray-200 bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm text-gray-600"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      disabled={loading}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-lg border border-gray-200 bg-white placeholder-gray-300 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-red-500 text-center text-sm">{error}</p>
                )}

                <div className="flex justify-center pt-2">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-[#5C5CE9] rounded-lg px-16 py-2 hover:bg-[#4A4AD8] transition-colors"
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Google Sign In & Links */}
          <div className="w-full px-4 sm:px-0 space-y-4">
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 px-4 mx-auto hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={SignUpWithGoogle}
              disabled={loading}
            >
              <Image src={Google} alt="Google Logo" width={20} height={20} />
              <span className="text-sm sm:text-base">
                {loading ? "Please wait..." : "Sign up with Google"}
              </span>
            </button>

            <p className="text-center pt-6 text-sm sm:text-base text-violet-500">
              Already have an account?{" "}
              <Link
                href="/auth/sign-in"
                className="font-semibold hover:text-violet-800 hover:underline"
              >
                Log In
              </Link>
            </p>

            <p className="text-center text-xs mt-4 sm:text-sm text-violet-500">
              Forgot your password, again?{" "}
              <Link
                href="/auth/forgot-password"
                className="font-semibold hover:text-violet-800 hover:underline"
              >
                Reset password
              </Link>
            </p>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden relative lg:block lg:w-1/3">
          <Image
            src={huddleLogo}
            alt="Huddle Logo - Collaborative Workspace"
            className="w-full h-full object-cover rounded-tl-xl rounded-bl-xl"
          />
          <h3 className="absolute bottom-6 left-4 text-white text-4xl font-semibold w-1/2">
            A workful world of fun!
          </h3>
          <Image
            src="/assets/images/mainLogo.svg"
            alt="logo"
            className="absolute top-10 left-10"
            width={80}
            height={40}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
