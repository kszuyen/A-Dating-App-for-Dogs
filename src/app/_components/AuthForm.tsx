"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import Image from "next/image";

// Run: npx shadcn-ui@latest add button
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { publicEnv } from "@/lib/env/public";

import AuthInput from "./AuthInput";

function AuthForm({
  showForm,
  setShowForm,
  isSignUp,
  setIsSignUp,
}: {
  showForm: boolean;
  setShowForm: any;
  isSignUp: boolean;
  setIsSignUp: any;
}) {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  // const [userExists, setUserExists] = useState<boolean>(false);
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
  const [passwordTooShort, setPasswordTooShort] = useState<boolean>(false);
  const [wrongConfirmPassword, setWrongConfirmPassword] =
    useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: sign in logic
    console.log("Submitted");
    if (!email) {
      setInvalidEmail(true);
      return;
    } else {
      setInvalidEmail(false);
    }
    if (isSignUp) {
      if (!username) {
        setInvalidUsername(true);
        return;
      } else {
        setInvalidUsername(false);
      }
      if (password.length < 8) {
        setPasswordTooShort(true);
        return;
      } else {
        setPasswordTooShort(false);
      }
      if (password != confirmPassword) {
        setWrongConfirmPassword(true);
        return;
      }
    } else {
    }
    signIn("credentials", {
      isSignUp,
      email,
      username,
      password,
      callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/OnBoard`,
    });
  };
  const handleClick = () => {
    console.log("close form");
    setShowForm(false);
  };
  return (
    <>
      {showForm && (
        <Card className="min-w-[300px]">
          <div className="" onClick={handleClick}>
            ⓧ
          </div>

          <CardHeader>
            <CardTitle>{isSignUp ? "Create Account" : "Log In"}</CardTitle>
          </CardHeader>
          <CardContent className=" flex flex-col gap-2">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <AuthInput
                label="Email"
                type="email"
                value={email}
                setValue={setEmail}
              />
              {invalidEmail && (
                <div className="text-xs text-red-500">
                  Please enter your email.
                </div>
              )}
              {isSignUp && (
                <AuthInput
                  label="Username"
                  type="text"
                  value={username}
                  setValue={setUsername}
                />
              )}
              {isSignUp && invalidUsername && (
                <div className="text-xs text-red-500">
                  Please enter your username.
                </div>
              )}
              <AuthInput
                label="Password"
                type="password"
                value={password}
                setValue={setPassword}
              />
              {isSignUp && passwordTooShort && (
                <div className="text-xs text-red-500">
                  Password must be at least 8 characters long.
                </div>
              )}
              {isSignUp && (
                <AuthInput
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                />
              )}
              {wrongConfirmPassword && (
                <div className="text-xs text-red-500">
                  Must match the previous entry.
                </div>
              )}
              <div className="text-sm text-gray-500">
                {isSignUp ? (
                  <span>
                    Already have an account?{" "}
                    <a
                      className="cursor-pointer hover:underline"
                      onClick={() => setIsSignUp(false)}
                    >
                      Sign In
                    </a>
                  </span>
                ) : (
                  <span>
                    Do not have an account?{" "}
                    <a
                      className="cursor-pointer hover:underline"
                      onClick={() => setIsSignUp(true)}
                    >
                      Sign Up
                    </a>
                  </span>
                )}
              </div>

              <Button type="submit" className="w-full">
                Sign {isSignUp ? "Up" : "In"}
              </Button>
            </form>
            <div className="flex w-full items-center gap-1 py-2">
              <div className="h-[1px] grow border-t"></div>
              <p className="text-xs text-gray-400">or</p>
              <div className="h-[1px] grow border-t"></div>
            </div>
            <Button
              onClick={async () => {
                signIn("google", {
                  callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/OnBoard`,
                });
              }}
              className="flex w-full"
              variant={"outline"}
            >
              <Image
                src="/google.png"
                alt="google icon"
                width={20}
                height={20}
              />
              <span className="grow">Sign In with Google</span>
            </Button>
            <Button
              onClick={async () => {
                // TODO: sign in with github
                signIn("github", {
                  callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/OnBoard`,
                });
              }}
              className="flex w-full"
              variant={"outline"}
            >
              {/* Remember to copy "github.png" to ./public folder */}
              <Image
                src="/github.png"
                alt="github icon"
                width={20}
                height={20}
              />
              <span className="grow">Sign In with Github</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default AuthForm;
