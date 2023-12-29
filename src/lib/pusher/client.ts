import PusherClient from "pusher-js";

import { publicEnv } from "@/lib/env/public";

export const pusherClient = new PusherClient(publicEnv.NEXT_PUBLIC_PUSHER_KEY, {
  channelAuthorization: {
    endpoint: "/api/auth/pusher",
    transport: "ajax",
  },

  cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
});
