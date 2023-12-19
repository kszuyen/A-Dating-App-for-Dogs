"use client";

import { useState } from "react";

import HomePage from "@/components/HomePage";
import Navbar from "@/components/Navbar";

import AuthForm from "./_components/AuthForm";

export default function Home() {
  const authToken = false;
  const [showForm, setShowForm] = useState<boolean>(false);
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Navbar
        showForm={showForm}
        setShowForm={setShowForm}
        setIsSignUp={setIsSignUp}
      />
      <HomePage
        authToken={authToken}
        showForm={showForm}
        setShowForm={setShowForm}
        setIsSignUp={setIsSignUp}
      />
      {showForm && (
        <AuthForm
          showForm={showForm}
          setShowForm={setShowForm}
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
        />
      )}
    </main>
  );
}
