"use client";

import { useState } from "react";

import { useParams } from "next/navigation";

// import HomePage from "@/components/HomePage";
import Navbar from "@/components/Navbar";

import AuthForm from "./_components/AuthForm";

export default function Home() {
  const { auth } = useParams();
  const authMode = Array.isArray(auth) ? auth[0] : auth;
  // console.log(authMode);
  // const authToken = false;
  const [isSignUp, setIsSignUp] = useState<boolean>(
    authMode == "signin" ? false : true,
  );

  return (
    <div className="flex min-h-screen flex-col items-center px-8 py-4">
      <Navbar showButton={false} />
      <AuthForm isSignUp={isSignUp} setIsSignUp={setIsSignUp} />
    </div>
  );
}
