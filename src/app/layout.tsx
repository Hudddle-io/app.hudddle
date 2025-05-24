import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fontsource/red-hat-text";
import "@fontsource/red-hat-text/400.css";
import "@fontsource/red-hat-text/400-italic.css";
import StoreProvider from "@/store/StoreProvider";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import PreventTabletAndMobileWrapper from "../contexts/prevent-tablet-and-mobile";
// import { AuthContext } from "@/contexts/AuthContext";

const inriasans = localFont({
  src: "../../public/fonts/InriaSans-Regular.ttf",
});

export const metadata: Metadata = {
  title: "App.Hudddle | Auth",
  description:
    "Sign in to your App.Hudddle account to access your projects, collaborate with your team, and manage your tasks.",
  keywords: [
    "App.Hudddle",
    "Sign-in",
    "Login",
    "Account Access",
    "Collaboration Platform",
    "Project Management",
  ],
  openGraph: {
    title: "App.Hudddle | Sign-in",
    description:
      "Sign in to your App.Hudddle account to access your projects, collaborate with your team, and manage your tasks.",
    url: "https://app-hudddle.vercel.app/auth/Sign-in", // Replace with your actual domain
    siteName: "App.Hudddle",
    images: [
      {
        url: "https://app-hudddle.vercel.app/og-image-signin.jpg", // Path to your Open Graph image for sign-in page
        width: 1200,
        height: 630,
        alt: "App.Hudddle Sign-in Page",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "App.Hudddle | Sign-in",
    description:
      "Sign in to your App.Hudddle account to access your projects, collaborate with your team, and manage your tasks.",
    creator: "@your_twitter_handle", // Replace with your Twitter handle
    images: ["https://app-hudddle.vercel.app/twitter-image-signin.jpg"], // Path to your Twitter card image
  },
  // canonical: 'https://app-hudddle.vercel.app/auth/Sign-in', // Self-referencing canonical URL
};
// --- END IMPORTANT NOTE ---

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <StoreProvider>
      <html lang="en">
        <body className={`${inriasans.className} relative`}>
          <PreventTabletAndMobileWrapper>
            {children}
            <Toaster />
          </PreventTabletAndMobileWrapper>
        </body>
      </html>
    </StoreProvider>
  );
}
