type Props = {
  children: React.ReactNode;
  params: { otherDogId: string };
};

function ChatroomLayout({ children, params }: Props) {
  return <div className="w-full">{children}</div>;
}

export default ChatroomLayout;
