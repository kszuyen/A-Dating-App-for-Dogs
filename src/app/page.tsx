"use client";

// import { useState } from "react";
import HomePage from "@/components/HomePage";
import Navbar from "@/components/Navbar";

// import AuthForm from "./auth/[auth]/_components/AuthForm";

export default function Home() {
  // const [showForm, setShowForm] = useState<boolean>(false);
  // const [isSignUp, setIsSignUp] = useState<boolean>(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-purple-50 p-24">
      <Navbar showButton={true} />
      <HomePage />
    </main>
  );
}
