"use client";

import Navbar from "@/components/Navbar";

import OnBoardForm from "./_components/OnBoardForm";

function OnBoardPage() {
  return (
    <>
      <Navbar showForm={true} setShowForm={() => {}} setIsSignUp={() => {}} />
      <OnBoardForm />
    </>
  );
}

export default OnBoardPage;
