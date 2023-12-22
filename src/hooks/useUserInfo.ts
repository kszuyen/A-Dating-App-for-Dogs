import { useMemo } from "react";

// import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";


// import { getAvatar } from "@/lib/utils";

// this is a helper function to get user info in client components
export default function useUserInfo() {
  const { data: session } = useSession();
  console.log(session);
  // const {data: session} = useMemo(() => useSession(), [useSession]);
// const userId = session?.user?.id;
  // const searchParams = useSearchParams();
  // const username = useMemo(() => searchParams.get("username"), [searchParams]);
  //   const handle = useMemo(() => searchParams.get("handle"), [searchParams]);
  //   const avatarURL = useMemo(() => getAvatar(username), [username]);

    const userId = session?.user?.id;
    const username = session?.user?.name;
    console.log(userId, username);
    return {
      userId,
      username,
    };

}
