export type User = {
  id: string;
  username: string;
  email: string;
  provider: "github" | "google" | "credentials";
};

export type Dog = {
  id: string;
  dogname: string;
  breed: string;
  gender: "male" | "female";
  birthday: string | null;
  description: string;
  image_url: string | null;
  thumbnail_url: string | null;
}
