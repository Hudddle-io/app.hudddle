"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { backendUri } from "@/lib/config";
import huddleLogo from "../../../../public/assets/images/huddle-logo.png";

const ForgotPassword = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${backendUri}/api/v1/auth/password-reset-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: emailAddress,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to send password reset email."
        );
      }

      setSuccess(true);
      toast({
        title: "Password Reset Email Sent!",
        description: "Please check your email for password reset instructions.",
      });

      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
      toast({
        title: "Error",
        description: err.message || "Failed to send password reset email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center text-black overflow-hidden relative bg-white">
      <div className="flex flex-col lg:flex-row w-full h-full lg:h-screen">
        {/* Forgot Password Form Section */}
        <div className="w-full lg:w-2/3 bg-white flex flex-col justify-center items-center gap-10 py-8 px-4 sm:px-6 md:px-8 lg:py-0">
          <div className="flex flex-col items-center justify-center w-full">
            <div className="p-8 sm:p-10 w-full max-w-md md:max-w-lg lg:max-w-[539px] bg-[#FDFCFC] rounded-[20px] shadow-[0_8px_16px_rgba(0,0,0,0.08),0_16px_32px_rgba(0,0,0,0.06),0_24px_48px_rgba(0,0,0,0.04)]">
              <h1 className="text-3xl sm:text-4xl font-inter font-semibold text-center mb-3">
                Reset Password
              </h1>
              <p className="text-center text-gray-600 text-sm mb-8">
                Let's get you a new password. Send a reset link to your email address.
              </p>

              {success ? (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-700">
                    Password reset email has been sent! Please check your inbox.
                  </p>
                  <p className="text-sm text-gray-500">
                    Redirecting to sign in...
                  </p>
                </div>
              ) : (
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

                  {error && (
                    <p className="text-red-500 text-center text-sm">{error}</p>
                  )}

                  <div className="flex justify-center pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-[#5C5CE9] rounded-lg px-16 py-2 hover:bg-[#4A4AD8] transition-colors"
                    >
                      {loading ? "Sending..." : "Reset Password"}
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <Link
                      href="/auth/sign-in"
                      className="text-sm text-violet-500 hover:text-violet-800 hover:underline"
                    >
                      Back to Sign In
                    </Link>
                  </div>
                </form>
              )}
            </div>
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

export default ForgotPassword;
