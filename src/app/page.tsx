"use client";

import SignUp from "@/app/auth/sign-up/page";
import { useUserSession } from "@/contexts/useUserSession";
import { redirect } from "next/navigation";

export default function Home() {
  const { currentUser } = useUserSession();

  if (currentUser) {
    redirect("/dashboard");
  }

  //  const auth = getAuth();

  //  const user = auth.currentUser;

  //  if(user){
  //   return <Dashboard/>
  //  }
  return (
    <div className="w-full h-screen">
      <SignUp />
      {/* <Link href={'/dashboard'}>
        <Button>Dashboard</Button>
      </Link> */}
    </div>
  );
}
// w-full  min-h-screen grid place-content-center
