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
  birthday: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
}

export type newMessage = {
  senderId: string;
  receiverId: string;
  content: string;
  sentAt: Date;
};
