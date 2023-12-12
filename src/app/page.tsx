"use client";

import { useState } from "react";

import HomePage from "@/components/HomePage";
import Navbar from "@/components/Navbar";

import AuthForm from "./_components/AuthForm";

// import ImageCanvas from "../components/ImageCanvas";

export default function Home() {
  const authToken = false;
  const [showForm, setShowForm] = useState<boolean>(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Navbar />
      <HomePage
        authToken={authToken}
        showForm={showForm}
        setShowForm={setShowForm}
      />
      {showForm && <AuthForm showForm={showForm} setShowForm={setShowForm} />}

      {/* <ImageCanvas width={240} height={240} /> */}
      {/* <div id="result" className="mt-3"></div> */}
    </main>
  );
}
