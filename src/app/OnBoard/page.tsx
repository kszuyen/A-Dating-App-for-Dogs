"use client";

import Navbar from "@/components/Navbar";

import OnBoardForm from "./_components/OnBoardForm";

function OnBoardPage() {
  return (
    <>
      <Navbar showButton={true} setShowForm={() => {}} setIsSignUp={() => {}} />
      <OnBoardForm />
    </>
  );
}

export default OnBoardPage;
