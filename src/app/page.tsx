"use client";

import HomePage from "@/components/HomePage";
import Navbar from "@/components/Navbar";

// import AuthForm from "./[auth]/_components/AuthForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between px-16 py-8">
      <Navbar showButton={true} />
      <div className="flex-grow">
        <HomePage />
      </div>
    </main>
  );
}
