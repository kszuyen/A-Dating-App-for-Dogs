import { privateEnv } from "../env/private";
import { publicEnv } from "../env/public";
import PusherServer from "pusher";

export const pusherServer = new PusherServer({
  appId: privateEnv.PUSHER_ID,
  key: publicEnv.NEXT_PUBLIC_PUSHER_KEY,
  secret: privateEnv.PUSHER_SECRET,
  cluster: publicEnv.NEXT_PUBLIC_PUSHER_CLUSTER,
  useTLS: true,
});
