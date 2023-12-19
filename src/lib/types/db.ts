export type User = {
  id: string;
  username: string;
  email: string;
  provider: "github" | "google" | "credentials";
};
