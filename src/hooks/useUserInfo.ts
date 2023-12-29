import { useMemo } from "react";

import { useSession } from "next-auth/react";

type UserInfo = {
  userId: string | null;
  username: string | null;
};

// This is a helper function to get user info in client components
export default function useUserInfo(): UserInfo {
  const { data: session } = useSession();

  const userId = session?.user?.id || null;
  const username = session?.user?.name || null;

  return useMemo(() => {
    return {
      userId,
      username,
    };
  }, [userId, username]);
}
