"use client";

import Navbar from "@/components/Navbar";

import OnBoardForm from "./_components/OnBoardForm";

function OnBoardPage() {
  return (
    <>
      <Navbar showButton={false} />
      <OnBoardForm />
    </>
  );
}

export default OnBoardPage;
