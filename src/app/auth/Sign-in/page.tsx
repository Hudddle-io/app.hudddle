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
import { title } from "process";
import Link from "next/link";
import { backendUri } from "@/lib/config";
// import { storeToken } from '@/utils';

const SignIn = () => {
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const SignInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/onBoarding");
    } catch (err) {
      console.error(err);
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
        throw new Error(
          "Failed to authenticate. Please check your Email or password again"
        );
      }
      const data = await response.json();
      console.log(data, data.access_token);
      localStorage.setItem("token", data.access_token);
      router.push("/onBoarding");
      toast({
        description: "Login Successfull",
      });
      //   setLoading(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex text-black max-h-screen overflow-hidden relative">
      <div className="flex w-full justify-between items-center flex-row">
        <div className="w-2/3 bg-white justify-center items-center flex flex-col space-y-4 h-full">
          <div className="flex items-center justify-center">
            <div className=" justify-center items-center card-morph p-10 w-[539px] bg-[#FDFCFC] rounded-[12px] border border-transparent">
              <div className="flex flex-col space-y-5">
                <h1 className="text-[36px] font-inter font-semibold text-center leading-[43.57px]">
                  Sign In
                </h1>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col space-y-8">
                    <div>
                      <label>Email Address</label>
                      <Input
                        disabled={loading}
                        type="text"
                        value={emailAddress}
                        placeholder="@gmail.com"
                        onChange={(e) => setEmailAddress(e.target.value)}
                        required
                        className=""
                      />
                    </div>
                    <div>
                      <label className="">Password</label>
                      <Input
                        disabled={loading}
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow-lg rounded-[26px] mb-8 placeholder-slate-300"
                        required
                      />
                    </div>
                    <p className="text-center pt-9">
                      Don&apos;t have an account?{" "}
                      <span className="text-violet-500 hover:text-violet-800 hover:underline">
                        <Link href="/auth/Sign-up">Sign up</Link>
                      </span>
                    </p>
                    <Button
                      type="submit"
                      size={"sm"}
                      disabled={loading}
                      className="bg-[#5C5CE9] my-32 rounded-[8px]"
                    >
                      {loading ? <h1>Logging In....</h1> : <h1>Sign In</h1>}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="top-8 relative">
            <Button
              onClick={SignInWithGoogle}
              className="w-[400px] justify-center text-black space-x-3 border rounded-md border-slate-200 bg-[#CACACA33]"
            >
              <Image src={Google} width={20} height={20} alt="google icon" />
              <h1>Sign In with google</h1>
            </Button>
          </div>
        </div>

        <Image
          src={huddleLogo}
          alt=""
          className="w-1/3 rounded-t-[12px] rounded-bl-[12px]"
        />
        {/* <Image /> */}
      </div>
    </div>
  );
};

export default SignIn;

// "use client";
// import React from 'react'
// import { Button } from '../../components/ui/button'
// import {auth, googleProvider, } from "../../../config/firebase";
// import { signInWithPopup,signOut } from 'firebase/auth';
// import  { useRouter } from "next/navigation";
// import { SigninForm } from '@/components/sign-in-form';
// const SignIn = () => {
//     const router = useRouter();

//     console.log(auth?.currentUser?.displayName);

//     const SignInWithGoogle = async () => {
//         try{
//             await signInWithPopup(auth,googleProvider);
//             router.push('/onBoarding');
//         }
//         catch(err){
//             console.error(err);
//         }
//     }
//     const LogOut = async() => {
//         try{
//             await signOut(auth);
//             router.push('/onBoarding');
//         }
//         catch(err){
//             console.error(err);
//         }
//     }
//   return (
//     <div className='w-full h-full '>
//         <div className='w-3/4 h-full'>
//         <div className='flex justify-center flex-col gap-5 items-center '>
//                <h1 className='font-inter font-semibold leading-[43.57px] text-[36px]'>Sign In</h1>
//                <SigninForm/>
//         </div>

//         </div>
//         <Button onClick={SignInWithGoogle}>SignIn with Google</Button>
//         <Button onClick={LogOut}>Logout</Button>
//         {

//         }
//     </div>
//   )
// }

// export default SignIn
