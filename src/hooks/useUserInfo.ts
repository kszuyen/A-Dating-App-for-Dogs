import { useSession } from "next-auth/react";

// this is a helper function to get user info in client components
export default function useUserInfo() {
  const { data: session } = useSession();

  const userId = session?.user?.id;
  const username = session?.user?.name;
  return {
    userId,
    username,
  };
}
