type Props = {
  children: React.ReactNode;
};

function MessageLayout({ children }: Props) {
  // return <div className="mx-auto flex max-w-6xl">{children}</div>;
  return <>{children}</>;
}

export default MessageLayout;
