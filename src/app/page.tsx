"use client";

import { useUserSession } from "@/contexts/useUserSession";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { currentUser } = useUserSession();

  useEffect(() => {
    if (currentUser) {
      redirect("/dashboard");
    } else {
      redirect("/auth/sign-up");
    }
  }, [currentUser]);
}
// w-full  min-h-screen grid place-content-center
