"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

// Run: npx shadcn-ui@latest add button
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { publicEnv } from "@/lib/env/public";

import AuthInput from "./AuthInput";

function AuthForm({
  isSignUp,
  setIsSignUp,
}: {
  isSignUp: boolean;
  setIsSignUp: any;
}) {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [invalidEmail, setInvalidEmail] = useState<boolean>(false);
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
  // const [userExists, setUserExists] = useState<boolean>(false);
  const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
  const [passwordTooShort, setPasswordTooShort] = useState<boolean>(false);
  const [wrongConfirmPassword, setWrongConfirmPassword] =
    useState<boolean>(false);
  const [showErrorMessage, setShowErrorMessage] = useState<boolean>(false);

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
    if (!password) {
      setInvalidPassword(true);
    } else {
      setInvalidPassword(false);
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
  const router = useRouter();
  const handleClick = () => {
    // console.log("close form");
    // setShowForm(false);
    router.push("/");
  };
  const searchParams = useSearchParams();

  const error = searchParams.get("error");
  const errors = {
    Signin: "Try signing with a different account.",
    OAuthSignin: "Try signing with a different account.",
    OAuthCallback: "Try signing with a different account.",
    OAuthCreateAccount: "Try signing with a different account.",
    EmailCreateAccount: "Try signing with a different account.",
    Callback: "Try signing with a different account.",
    OAuthAccountNotLinked:
      "To confirm your identity, sign in with the same account you used originally.",
    EmailSignin: "Check your email address.",
    CredentialsSignin:
      "Sign in/up failed. Check the details you provided are correct.",
    default: "Unable to sign in/up.",
  };
  // const [errorMessage, setErrorMessage] =
  //   useState<string>("Unable to sign in.");
  const SignInError = (error: any) => {
    const errorMessage = error && (errors[error.error] ?? errors.default);
    setShowErrorMessage(true);
    return (
      <div className="items-center pl-2 text-base text-red-500">
        {errorMessage}
      </div>
    );
  };
  return (
    <>
      <Card className="max-w-[500px] rounded-3xl border-4 border-purple-200 bg-white p-8 shadow-xl">
        <div className="flex justify-end">
          <div className="rounded-full">
            <button
              className="w-5 rounded text-xl hover:bg-purple-200"
              onClick={handleClick}
            >
              <p>X</p>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center font-mono text-5xl font-extrabold italic text-purple-500">
          <p className="">GET STARTED</p>
        </div>
        <div className="flex items-center justify-center px-8 py-2 font-mono text-base">
          <p className="text-center text-zinc-500">
            By clicking login in, you agree to our terms and conditions.
          </p>
        </div>
        {/* 
            <CardHeader>
              <CardTitle>{isSignUp ? "Create Account" : "Log In"}</CardTitle>
            </CardHeader> */}
        <CardContent className="flex flex-col gap-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <AuthInput
              label="Email"
              type="email"
              value={email}
              setValue={setEmail}
            />
            {invalidEmail && (
              <div className="text-sm text-red-500">
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
              <div className="text-sm text-red-500">
                Please enter your username.
              </div>
            )}
            <AuthInput
              label="Password"
              type="password"
              value={password}
              setValue={setPassword}
            />
            {!isSignUp && invalidPassword && (
              <div className="text-sm text-red-500">
                Password cannot be empty.
              </div>
            )}
            {isSignUp && passwordTooShort && (
              <div className="text-sm text-red-500">
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
              <div className="text-sm text-red-500">
                Must match the previous entry.
              </div>
            )}
            <div className="self-center p-3 font-mono text-lg text-zinc-500">
              {isSignUp ? (
                <span>
                  Already have an account?{" "}
                  <a
                    className="cursor-pointer hover:underline"
                    onClick={() => {
                      setPasswordTooShort(false);
                      setWrongConfirmPassword(false);
                      setIsSignUp(false);
                    }}
                  >
                    Sign In
                  </a>
                </span>
              ) : (
                <span>
                  Do not have an account?{" "}
                  <a
                    className="cursor-pointer hover:underline "
                    onClick={() => {
                      setInvalidPassword(false);
                      setIsSignUp(true);
                    }}
                  >
                    Sign Up
                  </a>
                </span>
              )}
            </div>
            <Button
              type="submit"
              className="mx-8 h-auto w-auto rounded-full bg-gradient-to-r from-purple-400 to-rose-400 shadow-lg hover:from-purple-300 hover:to-rose-300"
            >
              <p className="p-1 text-xl">Sign {isSignUp ? "Up" : "In"}</p>
            </Button>
            {showErrorMessage && <SignInError error={error} />}
          </form>
          <div className="flex w-full items-center gap-1 py-2">
            <div className="h-[1px] grow border-t"></div>
            <p className="text-lg text-gray-400">or</p>
            <div className="h-[1px] grow border-t"></div>
          </div>
          <Button
            onClick={async () => {
              signIn("google", {
                callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/OnBoard`,
              });
            }}
            className="flex h-auto w-full rounded-2xl border-zinc-400"
            variant={"outline"}
          >
            <Image src="/google.png" alt="google icon" width={20} height={20} />
            <span className="grow py-1 text-xl">Sign In with Google</span>
          </Button>
          <Button
            onClick={async () => {
              // TODO: sign in with github
              signIn("github", {
                callbackUrl: `${publicEnv.NEXT_PUBLIC_BASE_URL}/OnBoard`,
              });
            }}
            className="flex h-auto w-full rounded-2xl border-zinc-400"
            variant={"outline"}
          >
            {/* Remember to copy "github.png" to ./public folder */}
            <Image src="/github.png" alt="github icon" width={20} height={20} />
            <span className="grow py-1 text-xl">Sign In with Github</span>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default AuthForm;
